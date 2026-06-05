import { ClinicalRecord, RecordStatus } from '../types';
import { v4 as uuidv4 } from 'uuid';
import FacturacionService from '../../facturacion/services/FacturacionService';

let records: ClinicalRecord[] = [];

export class ClinicalRecordService {
    static async getByPatientId(patientId: string): Promise<ClinicalRecord[]> {
        return records.filter(r => r.patientId === patientId);
    }

    static async createOrUpdate(data: Partial<ClinicalRecord>): Promise<ClinicalRecord> {
        // If data has an id, check if it exists (it might be a local temp ID or a real one)
        const existingIndex = data.id ? records.findIndex(r => r.id === data.id) : -1;

        if (existingIndex >= 0) {
            // Update
            if (records[existingIndex].status === RecordStatus.FINALIZED) {
                throw new Error("No se puede editar una historia finalizada.");
            }
            records[existingIndex] = {
                ...records[existingIndex],
                ...data,
                id: records[existingIndex].id // Preserve original ID
            } as ClinicalRecord;
            return records[existingIndex];
        } else {
            // Create
            const newRecord: ClinicalRecord = {
                ...data,
                id: uuidv4(),
                dateCreated: new Date().toISOString(),
                status: data.status || RecordStatus.DRAFT,
                diagnoses: data.diagnoses || [],
                prescriptions: data.prescriptions || [],
                performedProcedures: data.performedProcedures || []
            } as ClinicalRecord;
            records.push(newRecord);
            return newRecord;
        }
    }

    static async finalize(id: string, signature: string): Promise<ClinicalRecord | undefined> {
        const index = records.findIndex(r => r.id === id);
        if (index === -1) return undefined;

        // 🛡️ MORPHEUS: Inmutabilidad de la HCE
        if (records[index].status === RecordStatus.FINALIZED) {
            throw new Error("La historia clínica ya ha sido finalizada y no puede ser modificada.");
        }

        records[index] = {
            ...records[index],
            status: RecordStatus.FINALIZED,
            dateFinalized: new Date().toISOString()
        };

        // 💰 LEDGER: Generate draft invoice automatically if there are procedures
        if (records[index].performedProcedures && records[index].performedProcedures!.length > 0) {
            try {
                const detalles = records[index].performedProcedures!.map(p => ({
                    codigo_servicio: p.code,
                    descripcion: p.name,
                    cantidad: p.amount || 1,
                    valor_unitario: FacturacionService.calculateSOATRate(1.0), // Default factor 1.0 for demo
                    valor_total: FacturacionService.calculateSOATRate(1.0) * (p.amount || 1)
                }));

                await FacturacionService.createInvoice({
                    paciente_id: records[index].patientId,
                    historia_id: records[index].id,
                    detalles
                });
                console.log(`[LEDGER] Factura automática generada para HCE: ${id}`);
            } catch (err) {
                console.error("[LEDGER] Error generando factura automática:", err);
            }
        }

        console.log(`[SIGNATURE] Record ${id} finalized by professional with signature hash: ${signature.slice(0, 10)}...`);

        return records[index];
    }
}
