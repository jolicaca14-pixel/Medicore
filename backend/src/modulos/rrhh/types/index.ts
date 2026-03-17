export interface Contract {
    id: string;
    userId: string;
    type: 'NOMINA' | 'OPS' | 'FIXED_MONTHLY';
    startDate: string;
    endDate?: string;
    salary: number;
    position: string;
    status: 'ACTIVE' | 'TERMINATED' | 'SUSPENDED';
    auditTrail: any[];
}

export interface DisciplinaryRecord {
    id: string;
    userId: string;
    date: string;
    title: string;
    type: 'WARNING' | 'SUSPENSION' | 'MEMO' | 'SANCTION' | 'COMPLAINT';
    description: string;
    status: 'OPEN' | 'RESOLVED';
    response?: string;
}
