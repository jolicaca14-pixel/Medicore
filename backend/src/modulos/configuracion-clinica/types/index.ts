import { Usuario } from '../../auth/types';

export enum FieldType {
    TEXT = 'TEXT',
    TEXTAREA = 'TEXTAREA',
    NUMBER = 'NUMBER',
    DATE = 'DATE',
    SELECT = 'SELECT',
    CHECKBOX = 'CHECKBOX',
    CALCULATED = 'CALCULATED',
    HEADER = 'HEADER',
    INFO = 'INFO',
    FILE = 'FILE'
}

export enum RecordType {
    GENERAL = 'GENERAL',
    PSYCHOLOGY = 'PSYCHOLOGY',
    NUTRITION = 'NUTRITION',
    PYP_GROWTH_DEV = 'PYP_GROWTH_DEV',
    PYP_PREGNANCY = 'PYP_PREGNANCY',
    PYP_CV_RISK = 'PYP_CV_RISK',
    LAB_RESULT = 'LAB_RESULT',
    IMAGING_REPORT = 'IMAGING_REPORT'
}

export interface TemplateField {
    id: string;
    label: string;
    type: FieldType;
    required?: boolean;
    options?: string[];
    unit?: string;
    placeholder?: string;
    formula?: string;
    defaultValue?: any;
    validation?: string;
}

export interface TemplateSection {
    id: string;
    title: string;
    fields: TemplateField[];
    isDefault?: boolean;
}

export interface RoleTemplate {
    id: string;
    name: string;
    description: string;
    allowedRoles: Usuario['rol'][];
    recordType: RecordType;
    sections: TemplateSection[];
    active: boolean;
}
