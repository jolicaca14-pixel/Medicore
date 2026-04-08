import { ClinicalRecord, RecordStatus } from '../types';
import pool from '../../../config/database';

export class ClinicalRecordService {
    private static mapToCamelCase(row: any): ClinicalRecord {
        return {
            id: row.id,
            patientId: row.paciente_id || row.patientId,
            professionalId: row.profesional_id || row.professionalId,
            recordType: row.tipo_registro || row.recordType,
            status: row.estado || row.status,
            chiefComplaint: row.motivo_consulta || row.chiefComplaint,
            historyOfPresentIllness: row.enfermedad_actual || row.historyOfPresentIllness,
            antecedents: row.antecedentes,
            dynamicData: row.datos_dinamicos || row.dynamicData,
            diagnoses: row.diagnosticos || row.diagnoses,
            plan: row.plan_manejo || row.plan,
            prescriptions: row.prescripciones || row.prescriptions,
            performedProcedures: row.procedimientos_realizados || row.performedProcedures,
            attachments: row.adjuntos || row.attachments,
            clarifyingNotes: row.notas_aclaratorias || row.clarifyingNotes,
            signature: row.firma_digital || row.signature,
            rdaStatus: row.rda_status || row.rdaStatus,
            rdaPayload: row.rda_payload || row.rdaPayload,
            dateCreated: row.created_at || row.dateCreated,
            dateFinalized: row.date_finalized || row.dateFinalized
        } as ClinicalRecord;
    }

    static async getByPatientId(patientId: string): Promise<ClinicalRecord[]> {
        const query = `
            SELECT
                id,
                paciente_id as "patientId",
                profesional_id as "professionalId",
                tipo_registro as "recordType",
                estado as "status",
                motivo_consulta as "chiefComplaint",
                enfermedad_actual as "historyOfPresentIllness",
                antecedentes as "antecedents",
                datos_dinamicos as "dynamicData",
                diagnosticos as "diagnoses",
                plan_manejo as "plan",
                prescripciones as "prescriptions",
                procedimientos_realizados as "performedProcedures",
                adjuntos as "attachments",
                notas_aclaratorias as "clarifyingNotes",
                firma_digital as "signature",
                rda_status as "rdaStatus",
                rda_payload as "rdaPayload",
                created_at as "dateCreated",
                date_finalized as "dateFinalized"
            FROM historias_clinicas
            WHERE paciente_id = $1
            ORDER BY created_at DESC
        `;
        const result = await pool.query(query, [patientId]);
        return result.rows;
    }

    static async createOrUpdate(data: Partial<ClinicalRecord>): Promise<ClinicalRecord> {
        const {
            id,
            patientId,
            professionalId,
            recordType,
            status,
            chiefComplaint,
            historyOfPresentIllness,
            antecedents,
            dynamicData,
            diagnoses,
            plan,
            prescriptions,
            performedProcedures,
            attachments,
            clarifyingNotes
        } = data;

        if (id) {
            // Check if exists and is not finalized
            const checkQuery = 'SELECT estado FROM historias_clinicas WHERE id = $1';
            const checkResult = await pool.query(checkQuery, [id]);

            if (checkResult.rows.length > 0) {
                if (checkResult.rows[0].estado === RecordStatus.FINALIZED) {
                    throw new Error("No se puede editar una historia finalizada.");
                }

                // Update
                const updateQuery = `
                    UPDATE historias_clinicas SET
                        tipo_registro = COALESCE($2, tipo_registro),
                        estado = COALESCE($3, estado),
                        motivo_consulta = COALESCE($4, motivo_consulta),
                        enfermedad_actual = COALESCE($5, enfermedad_actual),
                        antecedentes = COALESCE($6, antecedentes),
                        datos_dinamicos = COALESCE($7, datos_dinamicos),
                        diagnosticos = COALESCE($8, diagnosticos),
                        plan_manejo = COALESCE($9, plan_manejo),
                        prescripciones = COALESCE($10, prescripciones),
                        procedimientos_realizados = COALESCE($11, procedimientos_realizados),
                        adjuntos = COALESCE($12, adjuntos),
                        notas_aclaratorias = COALESCE($13, notas_aclaratorias),
                        updated_at = NOW()
                    WHERE id = $1
                    RETURNING *
                `;
                const result = await pool.query(updateQuery, [
                    id, recordType, status, chiefComplaint, historyOfPresentIllness,
                    antecedents, JSON.stringify(dynamicData || {}), JSON.stringify(diagnoses || []),
                    plan, JSON.stringify(prescriptions || []), JSON.stringify(performedProcedures || []),
                    JSON.stringify(attachments || []), JSON.stringify(clarifyingNotes || [])
                ]);
                return this.mapToCamelCase(result.rows[0]);
            }
        }

        // Create
        const insertQuery = `
            INSERT INTO historias_clinicas (
                paciente_id, profesional_id, tipo_registro, estado,
                motivo_consulta, enfermedad_actual, antecedentes, datos_dinamicos,
                diagnosticos, plan_manejo, prescripciones, procedimientos_realizados,
                adjuntos, notas_aclaratorias
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING *
        `;
        const result = await pool.query(insertQuery, [
            patientId, professionalId, recordType, status || RecordStatus.DRAFT,
            chiefComplaint, historyOfPresentIllness, antecedents, JSON.stringify(dynamicData || {}),
            JSON.stringify(diagnoses || []), plan, JSON.stringify(prescriptions || []),
            JSON.stringify(performedProcedures || []), JSON.stringify(attachments || []),
            JSON.stringify(clarifyingNotes || [])
        ]);

        return this.mapToCamelCase(result.rows[0]);
    }

    static async finalize(id: string, signature: string): Promise<ClinicalRecord | undefined> {
        // 🛡️ MORPHEUS: Inmutabilidad de la HCE
        const checkQuery = 'SELECT estado FROM historias_clinicas WHERE id = $1';
        const checkResult = await pool.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) return undefined;
        if (checkResult.rows[0].estado === RecordStatus.FINALIZED) {
            throw new Error("La historia clínica ya ha sido finalizada y no puede ser modificada.");
        }

        const finalizeQuery = `
            UPDATE historias_clinicas SET
                estado = $2,
                firma_digital = $3,
                date_finalized = NOW(),
                updated_at = NOW()
            WHERE id = $1
            RETURNING *
        `;
        const result = await pool.query(finalizeQuery, [id, RecordStatus.FINALIZED, signature]);

        console.log(`[SIGNATURE] Record ${id} finalized by professional with signature hash: ${signature.slice(0, 10)}...`);

        return this.mapToCamelCase(result.rows[0]);
    }
}
