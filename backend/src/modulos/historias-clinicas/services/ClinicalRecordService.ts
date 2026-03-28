import { pool } from '../../../config/database';
import { ClinicalRecord, RecordStatus } from '../types';

export class ClinicalRecordService {
    static async getByPatientId(patientId: string): Promise<ClinicalRecord[]> {
        const query = `
            SELECT
                h.id,
                h.paciente_id as "patientId",
                h.profesional_id as "professionalId",
                u.nombre_completo as "professionalName",
                h.tipo_registro as "recordType",
                h.fecha_creacion as "dateCreated",
                h.fecha_finalizacion as "dateFinalized",
                h.estado as "status",
                h.motivo_consulta as "chiefComplaint",
                h.enfermedad_actual as "historyOfPresentIllness",
                h.antecedentes as "antecedents",
                h.diagnosticos as "diagnoses",
                h.plan_manejo as "plan",
                h.prescripciones as "prescriptions",
                h.procedimientos as "performedProcedures",
                h.datos_dinamicos as "dynamicData",
                h.notas_aclaratorias as "clarifyingNotes",
                h.firma_hash as "firmaHash"
            FROM historias_clinicas h
            LEFT JOIN usuarios u ON h.profesional_id = u.id
            WHERE h.paciente_id = $1
            ORDER BY h.fecha_creacion DESC
        `;

        const result = await pool.query(query, [patientId]);
        return result.rows;
    }

    static async createOrUpdate(data: Partial<ClinicalRecord>): Promise<ClinicalRecord> {
        const client = await pool.connect();
        try {
            if (data.id) {
                // Check if it exists and status
                const existing = await client.query('SELECT estado FROM historias_clinicas WHERE id = $1', [data.id]);
                if (existing.rows.length > 0) {
                    if (existing.rows[0].estado === RecordStatus.FINALIZED) {
                        throw new Error("No se puede editar una historia finalizada.");
                    }

                    const updateQuery = `
                        UPDATE historias_clinicas SET
                            tipo_registro = COALESCE($1, tipo_registro),
                            motivo_consulta = COALESCE($2, motivo_consulta),
                            enfermedad_actual = COALESCE($3, enfermedad_actual),
                            antecedentes = COALESCE($4, antecedentes),
                            diagnosticos = COALESCE($5, diagnosticos),
                            plan_manejo = COALESCE($6, plan_manejo),
                            prescripciones = COALESCE($7, prescripciones),
                            procedimientos = COALESCE($8, procedimientos),
                            datos_dinamicos = COALESCE($9, datos_dinamicos),
                            updated_at = NOW()
                        WHERE id = $10
                        RETURNING id
                    `;

                    await client.query(updateQuery, [
                        data.recordType,
                        data.chiefComplaint,
                        data.historyOfPresentIllness,
                        data.antecedents,
                        data.diagnoses ? JSON.stringify(data.diagnoses) : null,
                        data.plan,
                        data.prescriptions ? JSON.stringify(data.prescriptions) : null,
                        data.performedProcedures ? JSON.stringify(data.performedProcedures) : null,
                        data.dynamicData ? JSON.stringify(data.dynamicData) : null,
                        data.id
                    ]);

                    const updated = await this.getById(data.id, client);
                    return updated!;
                }
            }

            // Create
            const insertQuery = `
                INSERT INTO historias_clinicas (
                    paciente_id, profesional_id, tipo_registro, estado,
                    motivo_consulta, enfermedad_actual, antecedentes,
                    diagnosticos, plan_manejo, prescripciones, procedimientos, datos_dinamicos
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING id
            `;

            const result = await client.query(insertQuery, [
                data.patientId,
                data.professionalId,
                data.recordType,
                data.status || RecordStatus.DRAFT,
                data.chiefComplaint,
                data.historyOfPresentIllness,
                data.antecedents,
                JSON.stringify(data.diagnoses || []),
                data.plan,
                JSON.stringify(data.prescriptions || []),
                JSON.stringify(data.performedProcedures || []),
                JSON.stringify(data.dynamicData || {})
            ]);

            const created = await this.getById(result.rows[0].id, client);
            return created!;

        } finally {
            client.release();
        }
    }

    static async finalize(id: string, signature: string): Promise<ClinicalRecord | undefined> {
        const client = await pool.connect();
        try {
            const existing = await client.query('SELECT estado FROM historias_clinicas WHERE id = $1', [id]);
            if (existing.rows.length === 0) return undefined;
            if (existing.rows[0].estado === RecordStatus.FINALIZED) {
                throw new Error("La historia clínica ya ha sido finalizada.");
            }

            await client.query(
                'UPDATE historias_clinicas SET estado = $1, fecha_finalizacion = NOW(), firma_hash = $2 WHERE id = $3',
                [RecordStatus.FINALIZED, signature, id]
            );

            return await this.getById(id, client);
        } finally {
            client.release();
        }
    }

    private static async getById(id: string, client?: any): Promise<ClinicalRecord | undefined> {
        const exec = client || pool;
        const query = `
            SELECT
                h.id,
                h.paciente_id as "patientId",
                h.profesional_id as "professionalId",
                u.nombre_completo as "professionalName",
                h.tipo_registro as "recordType",
                h.fecha_creacion as "dateCreated",
                h.fecha_finalizacion as "dateFinalized",
                h.estado as "status",
                h.motivo_consulta as "chiefComplaint",
                h.enfermedad_actual as "historyOfPresentIllness",
                h.antecedentes as "antecedents",
                h.diagnosticos as "diagnoses",
                h.plan_manejo as "plan",
                h.prescripciones as "prescriptions",
                h.procedimientos as "performedProcedures",
                h.datos_dinamicos as "dynamicData",
                h.notas_aclaratorias as "clarifyingNotes",
                h.firma_hash as "firmaHash"
            FROM historias_clinicas h
            LEFT JOIN usuarios u ON h.profesional_id = u.id
            WHERE h.id = $1
        `;
        const result = await exec.query(query, [id]);
        return result.rows[0];
    }
}
