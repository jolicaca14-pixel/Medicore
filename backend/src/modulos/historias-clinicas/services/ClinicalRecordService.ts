import pool from '../../../config/database';
import { ClinicalRecord, RecordStatus } from '../types';

export class ClinicalRecordService {
    static async getByPatientId(patientId: string): Promise<ClinicalRecord[]> {
        const result = await pool.query(
            'SELECT * FROM historias_clinicas WHERE paciente_id = $1 ORDER BY fecha_creacion DESC',
            [patientId]
        );
        return result.rows.map(this.mapToModel);
    }

    static async createOrUpdate(data: Partial<ClinicalRecord>): Promise<ClinicalRecord> {
        const isUpdate = !!data.id;

        if (isUpdate) {
            const check = await pool.query('SELECT estado FROM historias_clinicas WHERE id = $1', [data.id]);
            if (check.rows.length > 0 && check.rows[0].estado === RecordStatus.FINALIZED) {
                throw new Error("No se puede editar una historia finalizada.");
            }

            const result = await pool.query(
                `UPDATE historias_clinicas SET
                    motivo_consulta = COALESCE($1, motivo_consulta),
                    enfermedad_actual = COALESCE($2, enfermedad_actual),
                    antecedentes = COALESCE($3, antecedentes),
                    datos_dinamicos = COALESCE($4, datos_dinamicos),
                    diagnosticos = COALESCE($5, diagnosticos),
                    plan_manejo = COALESCE($6, plan_manejo),
                    prescripciones = COALESCE($7, prescripciones),
                    procedimientos_realizados = COALESCE($8, procedimientos_realizados),
                    updated_at = NOW()
                 WHERE id = $9
                 RETURNING *`,
                [
                    data.chiefComplaint,
                    data.historyOfPresentIllness,
                    data.antecedents,
                    JSON.stringify(data.dynamicData || {}),
                    JSON.stringify(data.diagnoses || []),
                    data.plan,
                    JSON.stringify(data.prescriptions || []),
                    JSON.stringify(data.performedProcedures || []),
                    data.id
                ]
            );
            return this.mapToModel(result.rows[0]);
        } else {
            const result = await pool.query(
                `INSERT INTO historias_clinicas (
                    paciente_id, profesional_id, profesional_nombre, tipo_registro,
                    motivo_consulta, enfermedad_actual, antecedentes, datos_dinamicos,
                    diagnosticos, plan_manejo, prescripciones, procedimientos_realizados, estado
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                RETURNING *`,
                [
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
                ]
            );
            return this.mapToModel(result.rows[0]);
        }
    }

    static async finalize(id: string, signature: string): Promise<ClinicalRecord | undefined> {
        const check = await pool.query('SELECT estado FROM historias_clinicas WHERE id = $1', [id]);
        if (check.rows.length === 0) return undefined;

        if (check.rows[0].estado === RecordStatus.FINALIZED) {
            throw new Error("La historia clínica ya ha sido finalizada y no puede ser modificada.");
        }

        const result = await pool.query(
            `UPDATE historias_clinicas SET
                estado = $1,
                fecha_finalizacion = NOW(),
                updated_at = NOW()
             WHERE id = $2
             RETURNING *`,
            [RecordStatus.FINALIZED, id]
        );

        console.log(`[SIGNATURE] Record ${id} finalized with signature hash: ${signature.slice(0, 10)}...`);
        return this.mapToModel(result.rows[0]);
    }

    private static mapToModel(row: any): ClinicalRecord {
        return {
            id: row.id,
            patientId: row.paciente_id,
            professionalId: row.profesional_id,
            professionalName: row.profesional_nombre,
            recordType: row.tipo_registro,
            status: row.estado,
            chiefComplaint: row.motivo_consulta,
            historyOfPresentIllness: row.enfermedad_actual,
            antecedents: row.antecedentes,
            dynamicData: row.datos_dinamicos,
            diagnoses: row.diagnosticos,
            plan: row.plan_manejo,
            prescriptions: row.prescripciones,
            performedProcedures: row.procedimientos_realizados,
            rdaStatus: row.rda_status,
            rdaPayload: row.rda_payload,
            dateCreated: row.fecha_creacion,
            dateFinalized: row.fecha_finalizacion
        };
    }
}
