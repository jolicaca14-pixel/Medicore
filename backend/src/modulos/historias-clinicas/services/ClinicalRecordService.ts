import pool from '../../../config/database';
import { ClinicalRecord, RecordStatus } from '../types';
import { BillingService } from '../../facturacion/services/BillingService';

export class ClinicalRecordService {
    static async getByPatientId(patientId: string): Promise<ClinicalRecord[]> {
        const query = `
            SELECT
                id, paciente_id as "patientId", profesional_id as "professionalId",
                motivo_consulta as "reasonForConsultation", enfermedad_actual as "currentIllness",
                antecedentes as "antecedents", signos_vitales as "vitalSigns",
                examen_fisico as "physicalExam", diagnoses, prescriptions,
                performed_procedures as "performedProcedures", plan_manejo as "managementPlan",
                status, date_created as "dateCreated", date_finalized as "dateFinalized",
                signature_hash as "signatureHash"
            FROM historias_clinicas
            WHERE paciente_id = $1
            ORDER BY date_created DESC
        `;
        const result = await pool.query(query, [patientId]);
        return result.rows;
    }

    static async createOrUpdate(data: Partial<ClinicalRecord>): Promise<ClinicalRecord> {
        const client = await pool.connect();
        try {
            if (data.id) {
                // Check if exists and is not finalized
                const checkQuery = 'SELECT status FROM historias_clinicas WHERE id = $1';
                const checkResult = await client.query(checkQuery, [data.id]);

                if (checkResult.rows.length > 0) {
                    if (checkResult.rows[0].status === RecordStatus.FINALIZED) {
                        throw new Error("No se puede editar una historia finalizada.");
                    }

                    // Update
                    const updateQuery = `
                        UPDATE historias_clinicas SET
                            motivo_consulta = COALESCE($1, motivo_consulta),
                            enfermedad_actual = COALESCE($2, enfermedad_actual),
                            antecedentes = COALESCE($3, antecedentes),
                            signos_vitales = COALESCE($4, signos_vitales),
                            examen_fisico = COALESCE($5, examen_fisico),
                            diagnoses = COALESCE($6, diagnoses),
                            prescriptions = COALESCE($7, prescriptions),
                            performed_procedures = COALESCE($8, performed_procedures),
                            plan_manejo = COALESCE($9, plan_manejo),
                            updated_at = NOW()
                        WHERE id = $10
                        RETURNING
                            id, paciente_id as "patientId", profesional_id as "professionalId",
                            motivo_consulta as "reasonForConsultation", enfermedad_actual as "currentIllness",
                            antecedentes as "antecedents", signos_vitales as "vitalSigns",
                            examen_fisico as "physicalExam", diagnoses, prescriptions,
                            performed_procedures as "performedProcedures", plan_manejo as "managementPlan",
                            status, date_created as "dateCreated", date_finalized as "dateFinalized"
                    `;
                    const values = [
                        data.reasonForConsultation, data.currentIllness,
                        data.antecedents ? JSON.stringify(data.antecedents) : null,
                        data.vitalSigns ? JSON.stringify(data.vitalSigns) : null,
                        data.physicalExam, JSON.stringify(data.diagnoses || []),
                        JSON.stringify(data.prescriptions || []), JSON.stringify(data.performedProcedures || []),
                        data.managementPlan, data.id
                    ];
                    const result = await client.query(updateQuery, values);
                    return result.rows[0];
                }
            }

            // Create new
            const insertQuery = `
                INSERT INTO historias_clinicas (
                    paciente_id, profesional_id, motivo_consulta, enfermedad_actual,
                    antecedentes, signos_vitales, examen_fisico, diagnoses,
                    prescriptions, performed_procedures, plan_manejo, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING
                    id, paciente_id as "patientId", profesional_id as "professionalId",
                    motivo_consulta as "reasonForConsultation", enfermedad_actual as "currentIllness",
                    antecedentes as "antecedents", signos_vitales as "vitalSigns",
                    examen_fisico as "physicalExam", diagnoses, prescriptions,
                    performed_procedures as "performedProcedures", plan_manejo as "managementPlan",
                    status, date_created as "dateCreated"
            `;
            const insertValues = [
                data.patientId, data.professionalId, data.reasonForConsultation,
                data.currentIllness, JSON.stringify(data.antecedents || {}),
                JSON.stringify(data.vitalSigns || {}), data.physicalExam,
                JSON.stringify(data.diagnoses || []), JSON.stringify(data.prescriptions || []),
                JSON.stringify(data.performedProcedures || []), data.managementPlan,
                RecordStatus.DRAFT
            ];
            const result = await client.query(insertQuery, insertValues);
            return result.rows[0];
        } finally {
            client.release();
        }
    }

    static async finalize(id: string, signature: string): Promise<ClinicalRecord | undefined> {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const query = `
                UPDATE historias_clinicas
                SET status = $1, date_finalized = NOW(), signature_hash = $2
                WHERE id = $3 AND status != $1
                RETURNING *
            `;
            const result = await client.query(query, [RecordStatus.FINALIZED, signature, id]);

            if (result.rows.length === 0) {
                const check = await client.query('SELECT status FROM historias_clinicas WHERE id = $1', [id]);
                if (check.rows.length > 0 && check.rows[0].status === RecordStatus.FINALIZED) {
                    throw new Error("La historia clínica ya ha sido finalizada.");
                }
                await client.query('ROLLBACK');
                return undefined;
            }

            const record = result.rows[0];

            // 💰 LEDGER: Trigger draft invoice generation upon HCE finalization
            const procedures = record.performed_procedures || [];
            if (procedures.length > 0) {
                const invoiceItems = procedures.map((p: any) => ({
                    descripcion: p.description || p.code || 'Procedimiento Médico',
                    codigo_servicio: p.code,
                    cantidad: 1,
                    valor_unitario: 50000, // Valor base por defecto
                    valor_total: 50000
                }));

                await BillingService.createInvoice({
                    paciente_id: record.paciente_id,
                    hce_id: record.id,
                    notas: `Generado automáticamente desde HCE ${record.id}`
                }, invoiceItems);
            }

            await client.query('COMMIT');
            console.log(`[DATABASE] Record ${id} finalized and invoice draft created.`);
            return record;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}
