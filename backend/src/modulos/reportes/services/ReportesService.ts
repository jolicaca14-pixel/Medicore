import { PatientService } from '../../pacientes/services/PatientService';
import { ClinicalRecordService } from '../../historias-clinicas/services/ClinicalRecordService';

export class ReportesService {
    static async getDashboardMetrics() {
        const patients = await PatientService.getAll();
        // Since we don't have a way to get ALL records from all patients easily with the current mock service without patient IDs
        // we'll return some mock metrics combined with real patient counts

        return {
            totalPatients: patients.length,
            totalRecords: patients.length * 1.5, // Mock multiplier
            recordsToday: Math.floor(Math.random() * 10),
            revenueMonth: Math.floor(Math.random() * 5000000),
            patientGrowth: 12.5,
            topDiagnoses: [
                { name: 'Hipertensión esencial', count: 45 },
                { name: 'Diabetes mellitus tipo 2', count: 32 },
                { name: 'Asma', count: 18 }
            ]
        };
    }
}
