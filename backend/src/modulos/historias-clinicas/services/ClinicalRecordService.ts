import pool from '../../../config/database';
import { ClinicalRecord, RecordStatus } from '../types';
import bcrypt from 'bcrypt';

export class ClinicalRecordService {
    static async getByPatientId(patientId: string): Promise<ClinicalRecord[]> {
        const query = `
            SELECT
                id,
                paciente_id as "patientId",
                profesional_id as "professionalId",
                motivo_consulta as "reasonForConsultation",
                enfermedad_actual as "currentIllness",
                antecedentes as "history",
                revision_sistemas as "systemsReview",
                examen_fisico as "physicalExam",
                signos_vitales as "vitalSigns",
                diagnosticos as "diagnoses",
                analisis_plan as "analysisAndPlan",
                prescripciones as "prescriptions",
                procedimientos_realizados as "performedProcedures",
                estado as "status",
                firma_profesional as "signature",
                fecha_creacion as "dateCreated",
                fecha_finalizacion as "dateFinalized"
            FROM historias_clinicas
            WHERE paciente_id = $1
            ORDER BY fecha_creacion DESC
        `;
        const result = await pool.query(query, [patientId]);
        return result.rows;
    }

    static async createOrUpdate(data: Partial<ClinicalRecord>): Promise<ClinicalRecord> {
        if (data.id) {
            // Check if it exists and is not finalized
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
                        antecedentes = COALESCE($3::jsonb, antecedentes),
                        revision_sistemas = COALESCE($4, revision_sistemas),
                        examen_fisico = COALESCE($5::jsonb, examen_fisico),
                        signos_vitales = COALESCE($6::jsonb, signos_vitales),
                        diagnosticos = COALESCE($7::jsonb, diagnosticos),
                        analisis_plan = COALESCE($8, analisis_plan),
                        prescripciones = COALESCE($9::jsonb, prescripciones),
                        procedimientos_realizados = COALESCE($10::jsonb, procedimientos_realizados),
                        updated_at = NOW()
                    WHERE id = $11
                    RETURNING
                        id, paciente_id as "patientId", profesional_id as "professionalId",
                        motivo_consulta as "reasonForConsultation", enfermedad_actual as "currentIllness",
                        antecedentes as "history", revision_sistemas as "systemsReview",
                        examen_fisico as "physicalExam", signos_vitales as "vitalSigns",
                        diagnosticos as "diagnoses", analisis_plan as "analysisAndPlan",
                        prescripciones as "prescriptions", procedimientos_realizados as "performedProcedures",
                        estado as "status", firma_profesional as "signature",
                        fecha_creacion as "dateCreated", fecha_finalizacion as "dateFinalized"
                `;
                const values = [
                    data.reasonForConsultation || null, data.currentIllness || null,
                    data.history ? JSON.stringify(data.history) : null, data.systemsReview || null,
                    data.physicalExam ? JSON.stringify(data.physicalExam) : null,
                    data.vitalSigns ? JSON.stringify(data.vitalSigns) : null,
                    data.diagnoses ? JSON.stringify(data.diagnoses) : null, data.analysisAndPlan || null,
                    data.prescriptions ? JSON.stringify(data.prescriptions) : null,
                    data.performedProcedures ? JSON.stringify(data.performedProcedures) : null,
                    data.id
                ];
                const result = await pool.query(updateQuery, values);
                return result.rows[0];
            }
        }

        // Create
        const insertQuery = `
            INSERT INTO historias_clinicas (
                paciente_id, profesional_id, motivo_consulta, enfermedad_actual,
                antecedentes, revision_sistemas, examen_fisico, signos_vitales,
                diagnosticos, analisis_plan, prescripciones, procedimientos_realizados,
                estado
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING
                id, paciente_id as "patientId", profesional_id as "professionalId",
                motivo_consulta as "reasonForConsultation", enfermedad_actual as "currentIllness",
                antecedentes as "history", revision_sistemas as "systemsReview",
                examen_fisico as "physicalExam", signos_vitales as "vitalSigns",
                diagnosticos as "diagnoses", analisis_plan as "analysisAndPlan",
                prescripciones as "prescriptions", procedimientos_realizados as "performedProcedures",
                estado as "status", firma_profesional as "signature",
                fecha_creacion as "dateCreated", fecha_finalizacion as "dateFinalized"
        `;
        const values = [
            data.patientId, data.professionalId, data.reasonForConsultation, data.currentIllness,
            JSON.stringify(data.history || {}), data.systemsReview,
            JSON.stringify(data.physicalExam || {}), JSON.stringify(data.vitalSigns || {}),
            JSON.stringify(data.diagnoses || []), data.analysisAndPlan,
            JSON.stringify(data.prescriptions || []), JSON.stringify(data.performedProcedures || []),
            RecordStatus.DRAFT
        ];
        const result = await pool.query(insertQuery, values);
        return result.rows[0];
    }

    static async finalize(id: string, signature: string, userId: string, password?: string): Promise<ClinicalRecord | undefined> {
        // 🛡️ MORPHEUS: Re-validación de identidad para cierre de HCE
        if (!password) {
            throw new Error("Se requiere la contraseña para finalizar la historia clínica.");
        }

        const userQuery = 'SELECT password_hash FROM usuarios WHERE id = $1';
        const userResult = await pool.query(userQuery, [userId]);

        if (userResult.rows.length === 0) {
            throw new Error("Usuario no encontrado.");
        }

        const isPasswordValid = await bcrypt.compare(password, userResult.rows[0].password_hash);
        if (!isPasswordValid) {
            throw new Error("Contraseña incorrecta. No se puede finalizar la historia.");
        }

        // 🛡️ MORPHEUS: Inmutabilidad de la HCE
        const checkQuery = 'SELECT estado FROM historias_clinicas WHERE id = $1';
        const checkResult = await pool.query(checkQuery, [id]);

        if (checkResult.rows.length === 0) return undefined;
        if (checkResult.rows[0].estado === RecordStatus.FINALIZED) {
            throw new Error("La historia clínica ya ha sido finalizada y no puede ser modificada.");
        }

        const finalizeQuery = `
            UPDATE historias_clinicas SET
                estado = $1,
                firma_profesional = $2,
                fecha_finalizacion = NOW(),
                updated_at = NOW()
            WHERE id = $3
            RETURNING
                id, paciente_id as "patientId", profesional_id as "professionalId",
                motivo_consulta as "reasonForConsultation", enfermedad_actual as "currentIllness",
                antecedentes as "history", revision_sistemas as "systemsReview",
                examen_fisico as "physicalExam", signos_vitales as "vitalSigns",
                diagnosticos as "diagnoses", analisis_plan as "analysisAndPlan",
                prescripciones as "prescriptions", procedimientos_realizados as "performedProcedures",
                estado as "status", firma_profesional as "signature",
                fecha_creacion as "dateCreated", fecha_finalizacion as "dateFinalized"
        `;
        const result = await pool.query(finalizeQuery, [RecordStatus.FINALIZED, signature, id]);

        console.log(`[SIGNATURE] Record ${id} finalized by professional with signature hash: ${signature.slice(0, 10)}...`);

        return result.rows[0];
    }
}
