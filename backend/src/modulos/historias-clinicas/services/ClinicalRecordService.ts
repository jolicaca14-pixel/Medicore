import pool from '../../../config/database';
import { ClinicalRecord, RecordStatus } from '../types';
import { BillingService } from '../../facturacion/services/BillingService';

export class ClinicalRecordService {
    static async getByPatientId(patientId: string): Promise<ClinicalRecord[]> {
        const result = await pool.query(
            `SELECT
                id,
                paciente_id as "patientId",
                profesional_id as "professionalId",
                fecha_creacion as "dateCreated",
                fecha_finalizacion as "dateFinalized",
                motivo_consulta as "reasonForConsultation",
                enfermedad_actual as "currentIllness",
                revision_sistemas as "reviewOfSystems",
                examen_fisico as "physicalExam",
                signos_vitales as "vitals",
                diagnoses,
                prescriptions,
                performed_procedures as "performedProcedures",
                plan_manejo as "managementPlan",
                status,
                signature_hash as "signatureHash"
             FROM historias_clinicas
             WHERE paciente_id = $1
             ORDER BY fecha_creacion DESC`,
            [patientId]
        );
        return result.rows;
    }

    static async createOrUpdate(data: Partial<ClinicalRecord>): Promise<ClinicalRecord> {
        const {
            id, patientId, professionalId, reasonForConsultation, currentIllness,
            reviewOfSystems, physicalExam, vitals, diagnoses, prescriptions,
            performedProcedures, managementPlan, status
        } = data;

        // Si hay ID, intentamos actualizar
        if (id) {
            const check = await pool.query('SELECT status FROM historias_clinicas WHERE id = $1', [id]);
            if (check.rows.length > 0 && check.rows[0].status === RecordStatus.FINALIZED) {
                throw new Error("No se puede editar una historia finalizada.");
            }

            const result = await pool.query(
                `UPDATE historias_clinicas SET
                    motivo_consulta = COALESCE($1, motivo_consulta),
                    enfermedad_actual = COALESCE($2, enfermedad_actual),
                    revision_sistemas = COALESCE($3, revision_sistemas),
                    examen_fisico = COALESCE($4, examen_fisico),
                    signos_vitales = COALESCE($5, signos_vitales),
                    diagnoses = COALESCE($6, diagnoses),
                    prescriptions = COALESCE($7, prescriptions),
                    performed_procedures = COALESCE($8, performed_procedures),
                    plan_manejo = COALESCE($9, plan_manejo),
                    updated_at = NOW()
                 WHERE id = $10
                 RETURNING
                    id, paciente_id as "patientId", profesional_id as "professionalId",
                    fecha_creacion as "dateCreated", status`,
                [
                    reasonForConsultation, currentIllness, reviewOfSystems,
                    JSON.stringify(physicalExam), JSON.stringify(vitals),
                    JSON.stringify(diagnoses), JSON.stringify(prescriptions),
                    JSON.stringify(performedProcedures), managementPlan,
                    id
                ]
            );

            if (result.rows.length > 0) return result.rows[0];
        }

        // Crear nueva historia
        const result = await pool.query(
            `INSERT INTO historias_clinicas (
                paciente_id, profesional_id, motivo_consulta, enfermedad_actual,
                revision_sistemas, examen_fisico, signos_vitales, diagnoses,
                prescriptions, performed_procedures, plan_manejo, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING
                id, paciente_id as "patientId", profesional_id as "professionalId",
                fecha_creacion as "dateCreated", status`,
            [
                patientId, professionalId, reasonForConsultation, currentIllness,
                reviewOfSystems, JSON.stringify(physicalExam || {}), JSON.stringify(vitals || {}),
                JSON.stringify(diagnoses || []), JSON.stringify(prescriptions || []),
                JSON.stringify(performedProcedures || []), managementPlan,
                status || RecordStatus.DRAFT
            ]
        );

        return result.rows[0];
    }

    static async finalize(id: string, signature: string): Promise<ClinicalRecord | undefined> {
        const result = await pool.query(
            `UPDATE historias_clinicas SET
                status = $1,
                fecha_finalizacion = NOW(),
                signature_hash = $2,
                updated_at = NOW()
             WHERE id = $3 AND status != $1
             RETURNING id, status, fecha_finalizacion as "dateFinalized"`,
            [RecordStatus.FINALIZED, signature, id]
        );

        if (result.rows.length === 0) {
            const check = await pool.query('SELECT status FROM historias_clinicas WHERE id = $1', [id]);
            if (check.rows.length > 0 && check.rows[0].status === RecordStatus.FINALIZED) {
                throw new Error("La historia clínica ya ha sido finalizada.");
            }
            return undefined;
        }

        console.log(`[POSTGRES] Record ${id} finalized with signature hash.`);

        // 💰 LEDGER: Generar factura automática al finalizar
        try {
            await BillingService.createInvoiceFromRecord(id);
        } catch (billingError) {
            console.error('[BILLING ERROR] Could not create automatic invoice:', billingError);
            // No bloqueamos la finalización de la historia si falla la factura
        }

        return result.rows[0];
    }
}
