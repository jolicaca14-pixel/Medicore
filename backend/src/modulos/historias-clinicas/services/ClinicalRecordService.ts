import pool from '../../../config/database';
import { ClinicalRecord, RecordStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ClinicalRecordService {
    static async getByPatientId(patientId: string): Promise<ClinicalRecord[]> {
        const query = 'SELECT * FROM historias_clinicas WHERE paciente_id = $1 ORDER BY fecha_creacion DESC';
        const result = await pool.query(query, [patientId]);

        return result.rows.map(row => ({
            id: row.id,
            patientId: row.paciente_id,
            professionalId: row.profesional_id,
            professionalName: row.profesional_nombre,
            recordType: row.tipo_registro,
            dateCreated: row.fecha_creacion,
            dateFinalized: row.fecha_finalizacion,
            status: row.estado,
            chiefComplaint: row.motivo_consulta,
            historyOfPresentIllness: row.enfermedad_actual,
            antecedents: row.antecedentes,
            dynamicData: row.datos_dinamicos,
            diagnoses: row.diagnosticos,
            plan: row.plan,
            prescriptions: row.prescripciones,
            performedProcedures: row.procedimientos_realizados,
            rdaStatus: row.rda_status,
            rdaPayload: row.rda_payload
        } as ClinicalRecord));
    }

    static async createOrUpdate(data: Partial<ClinicalRecord>): Promise<ClinicalRecord> {
        if (data.id) {
            // Check if exists and status
            const checkQuery = 'SELECT estado FROM historias_clinicas WHERE id = $1';
            const checkResult = await pool.query(checkQuery, [data.id]);

            if (checkResult.rows.length > 0) {
                if (checkResult.rows[0].estado === RecordStatus.FINALIZED) {
                    throw new Error("No se puede editar una historia finalizada.");
                }

                // Update
                const updateQuery = `
                    UPDATE historias_clinicas SET
                        motivo_consulta = COALESCE($1, motivo_consulta),
                        enfermedad_actual = COALESCE($2, enfermedad_actual),
                        antecedentes = COALESCE($3, antecedentes),
                        datos_dinamicos = COALESCE($4, datos_dinamicos),
                        diagnosticos = COALESCE($5, diagnosticos),
                        plan = COALESCE($6, plan),
                        prescripciones = COALESCE($7, prescripciones),
                        procedimientos_realizados = COALESCE($8, procedimientos_realizados),
                        updated_at = NOW()
                    WHERE id = $9
                    RETURNING *
                `;
                const values = [
                    data.chiefComplaint,
                    data.historyOfPresentIllness,
                    data.antecedents,
                    JSON.stringify(data.dynamicData),
                    JSON.stringify(data.diagnoses),
                    data.plan,
                    JSON.stringify(data.prescriptions),
                    JSON.stringify(data.performedProcedures),
                    data.id
                ];
                const result = await pool.query(updateQuery, values);
                return this.mapRowToRecord(result.rows[0]);
            }
        }

        // Create
        const insertQuery = `
            INSERT INTO historias_clinicas (
                id, paciente_id, profesional_id, profesional_nombre, tipo_registro,
                motivo_consulta, enfermedad_actual, antecedentes, datos_dinamicos,
                diagnosticos, plan, prescripciones, procedimientos_realizados, estado
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *
        `;
        const id = data.id || uuidv4();
        const values = [
            id,
            data.patientId,
            data.professionalId,
            data.professionalName,
            data.recordType,
            data.chiefComplaint,
            data.historyOfPresentIllness,
            data.antecedents,
            JSON.stringify(data.dynamicData || {}),
            JSON.stringify(data.diagnoses || []),
            data.plan,
            JSON.stringify(data.prescriptions || []),
            JSON.stringify(data.performedProcedures || []),
            RecordStatus.DRAFT
        ];
        const result = await pool.query(insertQuery, values);
        return this.mapRowToRecord(result.rows[0]);
    }

    static async finalize(id: string, signature: string): Promise<ClinicalRecord | undefined> {
        const checkQuery = 'SELECT estado FROM historias_clinicas WHERE id = $1';
        const checkResult = await pool.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) return undefined;
        if (checkResult.rows[0].estado === RecordStatus.FINALIZED) {
            throw new Error("La historia clínica ya ha sido finalizada.");
        }

        const finalizeQuery = `
            UPDATE historias_clinicas SET
                estado = $1,
                fecha_finalizacion = NOW(),
                updated_at = NOW()
            WHERE id = $2
            RETURNING *
        `;
        const result = await pool.query(finalizeQuery, [RecordStatus.FINALIZED, id]);

        console.log(`[SIGNATURE] Record ${id} finalized with signature hash: ${signature.slice(0, 10)}...`);

        return this.mapRowToRecord(result.rows[0]);
    }

    private static mapRowToRecord(row: any): ClinicalRecord {
        return {
            id: row.id,
            patientId: row.paciente_id,
            professionalId: row.profesional_id,
            professionalName: row.profesional_nombre,
            recordType: row.tipo_registro,
            dateCreated: row.fecha_creacion,
            dateFinalized: row.fecha_finalizacion,
            status: row.estado,
            chiefComplaint: row.motivo_consulta,
            historyOfPresentIllness: row.enfermedad_actual,
            antecedents: row.antecedentes,
            dynamicData: row.datos_dinamicos,
            diagnoses: row.diagnosticos,
            plan: row.plan,
            prescriptions: row.prescripciones,
            performedProcedures: row.procedimientos_realizados,
            rdaStatus: row.rda_status,
            rdaPayload: row.rda_payload
        } as ClinicalRecord;
    }
}
