import pool from '../../../config/database';
import { ClinicalRecord, RecordStatus } from '../types';

export class ClinicalRecordService {
    static async getByPatientId(patientId: string): Promise<ClinicalRecord[]> {
        const result = await pool.query(
            'SELECT * FROM historias_clinicas WHERE paciente_id = $1 ORDER BY fecha_creacion DESC',
            [patientId]
        );
        return result.rows.map(this.mapToCamelCase);
    }

    static async createOrUpdate(data: Partial<ClinicalRecord>): Promise<ClinicalRecord> {
        const {
            id, patientId, professionalId, professionalName, recordType,
            status, chiefComplaint, historyOfPresentIllness, antecedents,
            dynamicData, diagnoses, plan, prescriptions, performedProcedures
        } = data;

        if (id) {
            const existing = await pool.query('SELECT * FROM historias_clinicas WHERE id = $1', [id]);
            if (existing.rows.length > 0) {
                if (existing.rows[0].estado === RecordStatus.FINALIZED) {
                    throw new Error("No se puede editar una historia finalizada.");
                }

                const result = await pool.query(
                    `UPDATE historias_clinicas SET
                        motivo_consulta = $1, enfermedad_actual = $2, antecedentes = $3,
                        datos_dinamicos = $4, diagnosticos = $5, plan_tratamiento = $6,
                        prescripciones = $7, procedimientos_realizados = $8, updated_at = NOW()
                    WHERE id = $9 RETURNING *`,
                    [
                        chiefComplaint, historyOfPresentIllness, antecedents,
                        JSON.stringify(dynamicData || {}), JSON.stringify(diagnoses || []),
                        plan, JSON.stringify(prescriptions || []),
                        JSON.stringify(performedProcedures || []), id
                    ]
                );
                return this.mapToCamelCase(result.rows[0]);
            }
        }

        // Create
        const result = await pool.query(
            `INSERT INTO historias_clinicas (
                paciente_id, profesional_id, profesional_nombre, tipo_registro,
                estado, motivo_consulta, enfermedad_actual, antecedentes,
                datos_dinamicos, diagnosticos, plan_tratamiento, prescripciones,
                procedimientos_realizados
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
            [
                patientId, professionalId, professionalName, recordType,
                status || RecordStatus.DRAFT, chiefComplaint, historyOfPresentIllness, antecedents,
                JSON.stringify(dynamicData || {}), JSON.stringify(diagnoses || []),
                plan, JSON.stringify(prescriptions || []),
                JSON.stringify(performedProcedures || [])
            ]
        );
        return this.mapToCamelCase(result.rows[0]);
    }

    static async finalize(id: string, signature: string): Promise<ClinicalRecord | undefined> {
        const existing = await pool.query('SELECT * FROM historias_clinicas WHERE id = $1', [id]);
        if (existing.rows.length === 0) return undefined;

        if (existing.rows[0].estado === RecordStatus.FINALIZED) {
            throw new Error("La historia clínica ya ha sido finalizada.");
        }

        const result = await pool.query(
            `UPDATE historias_clinicas SET
                estado = $1, fecha_finalizacion = NOW(), updated_at = NOW()
            WHERE id = $2 RETURNING *`,
            [RecordStatus.FINALIZED, id]
        );

        console.log(`[SIGNATURE] Record ${id} finalized with signature: ${signature.slice(0, 10)}...`);
        return this.mapToCamelCase(result.rows[0]);
    }

    private static mapToCamelCase(row: any): ClinicalRecord {
        return {
            id: row.id,
            patientId: row.paciente_id,
            professionalId: row.profesional_id,
            professionalName: row.profesional_nombre,
            recordType: row.tipo_registro,
            dateCreated: row.fecha_creacion,
            dateFinalized: row.fecha_finalizacion,
            status: row.estado,
            rdaStatus: row.rda_status,
            rdaPayload: row.rda_payload,
            chiefComplaint: row.motivo_consulta,
            historyOfPresentIllness: row.enfermedad_actual,
            antecedents: row.antecedentes,
            dynamicData: row.datos_dinamicos,
            diagnoses: row.diagnosticos,
            plan: row.plan_tratamiento,
            prescriptions: row.prescripciones,
            performedProcedures: row.procedimientos_realizados,
            attachments: row.adjuntos,
            clarifyingNotes: row.notas_aclaratorias,
            emailSent: row.email_enviado
        };
    }
}
