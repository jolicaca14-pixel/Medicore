import { BillingService } from '../../facturacion/services/BillingService';
import PatientService from '../../pacientes/services/PatientService';

export class ReportService {
    static async getMetrics() {
        const invoices = await BillingService.getInvoices();
        const patients = await PatientService.getAllPatients();

        const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
        const pendingRevenue = invoices.reduce((sum, inv) => sum + inv.balance, 0);
        const patientCount = patients.length;

        return {
            totalRevenue,
            pendingRevenue,
            patientCount,
            activePatients: patientCount, // Mock
            closedRecordsPercentage: 85, // Mock
            systemAlerts: 3 // Mock
        };
    }
}
