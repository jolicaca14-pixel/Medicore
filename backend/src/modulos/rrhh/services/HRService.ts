import { Contract, DisciplinaryRecord } from '../types';

class HRService {
    private contracts: Contract[] = [
        {
            id: 'c1',
            userId: 'u1',
            type: 'OPS',
            startDate: '2023-01-01',
            salary: 6000000,
            position: 'Médico General',
            status: 'ACTIVE',
            auditTrail: [{ date: '2023-01-01', action: 'CREATED', changedBy: 'Admin Sistema', details: 'Creación inicial' }]
        }
    ];

    private disciplinaryRecords: DisciplinaryRecord[] = [
        {
            id: 'd1',
            userId: 'u1',
            date: '2023-11-01',
            title: 'Llegada Tarde',
            type: 'WARNING',
            description: 'Se registra llegada tarde a turno de 07:00 am.',
            status: 'OPEN'
        }
    ];

    async getContractByUserId(userId: string): Promise<Contract | undefined> {
        return this.contracts.find(c => c.userId === userId);
    }

    async getDisciplinaryByUserId(userId: string): Promise<DisciplinaryRecord[]> {
        return this.disciplinaryRecords.filter(r => r.userId === userId);
    }

    async addDisciplinaryResponse(recordId: string, response: string): Promise<DisciplinaryRecord | undefined> {
        const record = this.disciplinaryRecords.find(r => r.id === recordId);
        if (record) {
            record.response = response;
            return record;
        }
        return undefined;
    }
}

export default new HRService();
