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
    IMAGING_REPORT = 'IMAGING_REPORT',
    PYP_GROWTH_DEV = 'PYP_GROWTH_DEV',
    PYP_YOUNG = 'PYP_YOUNG',
    PYP_PREGNANCY = 'PYP_PREGNANCY',
    PYP_PUERPERIUM = 'PYP_PUERPERIUM',
    PYP_NEWBORN = 'PYP_NEWBORN',
    PYP_ADULT = 'PYP_ADULT',
    PYP_CV_RISK = 'PYP_CV_RISK',
    PYP_FAMILY_PLANNING = 'PYP_FAMILY_PLANNING',
    PYP_VISUAL = 'PYP_VISUAL',
    PYP_CANCER = 'PYP_CANCER'
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
