export enum RecordStatus {
    DRAFT = 'DRAFT',
    FINALIZED = 'FINALIZED'
}

export enum RecordType {
    GENERAL = 'GENERAL',
    PROCEDURE = 'PROCEDURE',
    NUTRITION = 'NUTRITION',
    PSYCHOLOGY = 'PSYCHOLOGY',
    LAB_RESULT = 'LAB_RESULT',
    IMAGING_REPORT = 'IMAGING_REPORT'
}

export interface ClinicalRecord {
    id: string;
    patientId: string;
    professionalId: string;
    professionalName: string;
    recordType: RecordType;
    dateCreated: string;
    dateFinalized?: string;
    status: RecordStatus;

    rdaStatus?: string;
    rdaPayload?: string;

    chiefComplaint: string;
    historyOfPresentIllness: string;
    antecedents: string;
    dynamicData: Record<string, any>;

    diagnoses: any[];
    plan: string;

    prescriptions: any[];
    performedProcedures: any[];

    attachments?: any[];
    clarifyingNotes?: any[];
    emailSent?: boolean;
}
