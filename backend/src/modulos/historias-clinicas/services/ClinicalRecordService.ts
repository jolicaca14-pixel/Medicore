import pool from '../../../config/database';
import { ClinicalRecord, RecordStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class ClinicalRecordService {
    private static mapRowToRecord(row: any): ClinicalRecord {
        return {
            id: row.id,
            patientId: row.patientId,
            professionalId: row.professionalId,
            professionalName: row.professionalName,
            recordType: row.recordType,
            dateCreated: row.dateCreated,
            dateFinalized: row.dateFinalized,
            status: row.status,
            chiefComplaint: row.chiefComplaint,
            antecedents: row.antecedents,
            dynamicData: typeof row.dynamicData === 'string' ? JSON.parse(row.dynamicData) : row.dynamicData,
            diagnoses: typeof row.diagnosticos === 'string' ? JSON.parse(row.diagnosticos) : (row.diagnosticos || []),
            plan: row.plan,
            prescriptions: [],
            performedProcedures: [],
            historyOfPresentIllness: '' // Placeholder if not in DB yet
        } as ClinicalRecord;
    }

    static async getByPatientId(patientId: string): Promise<ClinicalRecord[]> {
        const query = `
            SELECT
                h.id, h.paciente_id as "patientId", h.profesional_id as "professionalId",
                u.nombre_completo as "professionalName", h.tipo_registro as "recordType",
                h.created_at as "dateCreated", h.fecha_finalizada as "dateFinalized",
                h.estado as "status", h.motivo_consulta as "chiefComplaint",
                h.antecedentes, h.datos_dinamicos as "dynamicData",
                h.diagnosticos as "diagnosticos", h.plan_tratamiento as "plan",
                h.firma_digital as "signature"
            FROM historias_clinicas h
            LEFT JOIN usuarios u ON h.profesional_id = u.id
            WHERE h.paciente_id = $1
            ORDER BY h.created_at DESC
        `;
        const result = await pool.query(query, [patientId]);
        return result.rows.map(this.mapRowToRecord);
    }

    static async createOrUpdate(data: Partial<ClinicalRecord>): Promise<ClinicalRecord> {
        const id = data.id || uuidv4();

        const checkQuery = 'SELECT estado FROM historias_clinicas WHERE id = $1';
        const checkResult = await pool.query(checkQuery, [id]);

        if (checkResult.rows.length > 0) {
            if (checkResult.rows[0].estado === RecordStatus.FINALIZED) {
                throw new Error("No se puede editar una historia finalizada.");
            }

            const updateQuery = `
                UPDATE historias_clinicas
                SET
                    tipo_registro = COALESCE($1, tipo_registro),
                    motivo_consulta = COALESCE($2, motivo_consulta),
                    antecedentes = COALESCE($3, antecedentes),
                    diagnosticos = COALESCE($4, diagnosticos),
                    plan_tratamiento = COALESCE($5, plan_tratamiento),
                    datos_dinamicos = COALESCE($6, datos_dinamicos),
                    updated_at = NOW()
                WHERE id = $7
                RETURNING
                    id, paciente_id as "patientId", profesional_id as "professionalId",
                    tipo_registro as "recordType", created_at as "dateCreated",
                    estado as "status", motivo_consulta as "chiefComplaint",
                    antecedentes, datos_dinamicos as "dynamicData",
                    diagnosticos as "diagnosticos", plan_tratamiento as "plan"
            `;
            const values = [
                data.recordType, data.chiefComplaint, data.antecedents,
                JSON.stringify(data.diagnoses || []), data.plan,
                JSON.stringify(data.dynamicData || {}), id
            ];
            const result = await pool.query(updateQuery, values);
            return this.mapRowToRecord(result.rows[0]);
        } else {
            const insertQuery = `
                INSERT INTO historias_clinicas (
                    id, paciente_id, profesional_id, tipo_registro,
                    estado, motivo_consulta, antecedentes,
                    diagnosticos, plan_tratamiento, datos_dinamicos
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING
                    id, paciente_id as "patientId", profesional_id as "professionalId",
                    tipo_registro as "recordType", created_at as "dateCreated",
                    estado as "status", motivo_consulta as "chiefComplaint",
                    antecedentes, datos_dinamicos as "dynamicData",
                    diagnosticos as "diagnosticos", plan_tratamiento as "plan"
            `;
            const values = [
                id, data.patientId, data.professionalId, data.recordType,
                RecordStatus.DRAFT, data.chiefComplaint, data.antecedents,
                JSON.stringify(data.diagnoses || []), data.plan,
                JSON.stringify(data.dynamicData || {})
            ];
            const result = await pool.query(insertQuery, values);
            return this.mapRowToRecord(result.rows[0]);
        }
    }

    static async finalize(id: string, signature: string): Promise<ClinicalRecord | undefined> {
        const checkQuery = 'SELECT estado FROM historias_clinicas WHERE id = $1';
        const checkResult = await pool.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) return undefined;

        if (checkResult.rows[0].estado === RecordStatus.FINALIZED) {
            throw new Error("La historia clínica ya ha sido finalizada.");
        }

        const finalizeQuery = `
            UPDATE historias_clinicas
            SET
                estado = $1,
                firma_digital = $2,
                fecha_finalizada = NOW(),
                updated_at = NOW()
            WHERE id = $3
            RETURNING
                id, paciente_id as "patientId", profesional_id as "professionalId",
                tipo_registro as "recordType", created_at as "dateCreated",
                fecha_finalizada as "dateFinalized",
                estado as "status", motivo_consulta as "chiefComplaint",
                antecedentes, datos_dinamicos as "dynamicData",
                diagnosticos as "diagnosticos", plan_tratamiento as "plan",
                firma_digital as "signature"
        `;
        const result = await pool.query(finalizeQuery, [RecordStatus.FINALIZED, signature, id]);

        return this.mapRowToRecord(result.rows[0]);
    }
}
