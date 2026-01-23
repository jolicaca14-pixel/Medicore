export enum UserRole {
  ADMIN = 'ADMIN',
  PROFESSIONAL = 'PROFESSIONAL', // Doctors, Nurses, etc.
  BACTERIOLOGIST = 'BACTERIOLOGIST', // Lab
  RADIOLOGIST = 'RADIOLOGIST', // Imaging
  SECRETARY = 'SECRETARY',
  PSYCHOLOGIST = 'PSYCHOLOGIST' // New Role
}

export enum RecordStatus {
  DRAFT = 'DRAFT',
  FINALIZED = 'FINALIZED'
}

// NEW: Interoperability Status per Res 1888 of 2025
export enum RDAStatus {
  PENDING = 'PENDING',        // Not yet generated
  GENERATED = 'GENERATED',    // Created locally
  SENDING = 'SENDING',        // In transit to Ministry Platform
  SENT_MINSALUD = 'SENT_MINSALUD', // Successfully acknowledged by IHCE Platform
  FAILED = 'FAILED'           // Transmission error
}

export enum RecordType {
  GENERAL = 'GENERAL',
  PROCEDURE = 'PROCEDURE', // Notas de procedimiento
  NUTRITION = 'NUTRITION',
  PSYCHOLOGY = 'PSYCHOLOGY',
  
  // DIAGNOSTIC TYPES
  LAB_RESULT = 'LAB_RESULT',
  IMAGING_REPORT = 'IMAGING_REPORT',

  // PYP RES 412
  PYP_GROWTH_DEV = 'PYP_GROWTH_DEV', // < 10 Años
  PYP_YOUNG = 'PYP_YOUNG', // 10-29 Años
  PYP_PREGNANCY = 'PYP_PREGNANCY', // Control Prenatal
  PYP_PUERPERIUM = 'PYP_PUERPERIUM', // Post-parto
  PYP_NEWBORN = 'PYP_NEWBORN', // Recién Nacido
  PYP_ADULT = 'PYP_ADULT', // > 45 Años
  PYP_CV_RISK = 'PYP_CV_RISK', // Riesgo Cardiovascular
  PYP_FAMILY_PLANNING = 'PYP_FAMILY_PLANNING',
  PYP_VISUAL = 'PYP_VISUAL', // Agudeza Visual
  PYP_CANCER = 'PYP_CANCER' // Cuello Uterino y Seno
}

// --- NEW TEMPLATE ENGINE TYPES ---
export type FieldType = 'TEXT' | 'TEXTAREA' | 'NUMBER' | 'DATE' | 'SELECT' | 'CHECKBOX' | 'CALCULATED' | 'HEADER' | 'INFO' | 'FILE';

export interface TemplateField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  options?: string[]; // For SELECT type (comma separated in UI, array here)
  formula?: string;   // For CALCULATED type
  unit?: string;      // e.g., "kg", "cm", "mmHg"
  isGlobal?: boolean; // If true, it comes from the Global Field Library
  defaultValue?: string | number;
}

export interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  fields: TemplateField[];
}

export interface RoleTemplate {
  id: string;
  name: string;
  description: string;
  active: boolean;
  allowedRoles: UserRole[]; // Which roles can use this template
  sections: TemplateSection[]; 
  recordType: RecordType; // Link template to RecordType
}

// --- HR & CONTRACTS ---
export enum ContractType {
  NOMINA = 'NOMINA', // Laboral
  OPS = 'OPS' // Prestación de Servicios
}

export interface ContractAudit {
  date: string;
  action: 'CREATED' | 'UPDATED' | 'STATUS_CHANGE';
  changedBy: string; // User Name
  details: string; // What changed
  snapshot?: string; // JSON string of previous state
}

export interface Contract {
  id: string;
  userId: string;
  type: ContractType;
  startDate: string;
  endDate?: string; // Duration end
  isActive: boolean;
  fileUrl?: string; // PDF URL
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'TERMINATED'; // For requests

  // Audit
  auditTrail: ContractAudit[];

  // Nomina Specifics
  baseSalary?: number; // Monthly
  
  // OPS Specifics
  opsPaymentMethod?: 'PER_HOUR' | 'PER_PROCEDURE' | 'FIXED_MONTHLY';
  opsValue?: number; // Value per hour or fixed
  opsPercentage?: number; // e.g., 0.7 (70% of procedure value)
}

export interface DisciplinaryAction {
  id: string;
  userId: string;
  date: string;
  type: 'COMPLAINT' | 'REQUEST' | 'SANCTION';
  title: string;
  description: string;
  status: 'OPEN' | 'RESOLVED';
  documents: string[]; // URLs
  response?: string; // Worker's response (Descargos)
}

export interface WorkShift {
  id: string;
  userId: string;
  startTime: string; // ISO String
  endTime: string; // ISO String
  type: 'DIURNAL' | 'NOCTURNAL' | 'HOLIDAY'; // Simplified for demo
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  contractId: string;
  period: string;
  amount: number;
  dateSubmitted: string;
  status: 'SUBMITTED' | 'PAID' | 'REJECTED';
  attachments: {
      name: string;
      type: string;
  }[];
  paymentReceiptUrl?: string; // URL for the payment receipt uploaded by admin
}

// --------------------------------

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    type: 'ALERT' | 'INFO' | 'SUCCESS';
    targetTab?: string; // To redirect user
    timestamp: string;
    read: boolean;
}

export interface User {
  id: string;
  documentNumber: string; // NEW: Cédula / DNI
  name: string; // Full Name (Computed or manual)
  firstName?: string; 
  lastName?: string; 
  birthDate?: string; 
  
  username: string;
  password?: string; // Optional for mock checks
  
  // Professional Details
  eps?: string;
  arl?: string;
  pensionFund?: string;
  professionalLicense?: string;
  digitalStampUrl?: string; 
  specialty?: string; 

  roles: UserRole[]; 
  
  // HR Module
  contracts?: Contract[]; 
  disciplinaryHistory?: DisciplinaryAction[];
  
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface Patient {
  id: string;
  fullName: string;
  identification: string;
  birthDate: string;
  gender: 'M' | 'F';
  phone: string;
  email: string;
  insuranceType: string;
  allergies?: string;
}

export interface ClarifyingNote {
  id: string;
  date: string;
  content: string;
  authorId: string;
  authorName: string;
}

export interface PrescriptionItem {
  id: string;
  medicationName: string; // CUM standard
  dose: string;
  frequency: string;
  route: string;
  duration: string;
  totalQuantity: number;
  observations: string;
}

export interface DiagnosisItem {
    code: string;
    name: string;
    type: 'PRINCIPAL' | 'RELATED';
}

// --- PROCEDURES & TARIFFS ---
export interface TariffItem {
  code: string; // CUPS
  name: string;
  soatFactor: number; // Factor for SMLDV calculation
  basePrice?: number; // Manual base price if not using SOAT
}

export interface ProcedureItem {
  id: string;
  code: string;
  name: string;
  amount: number; // Quantity
  notes?: string;
}

export interface ClinicalRecord {
  id: string;
  patientId: string;
  professionalId: string;
  professionalName: string; // Snapshot
  recordType: RecordType;
  dateCreated: string;
  dateFinalized?: string;
  status: RecordStatus;
  
  // RDA / Interoperability Fields (Res 1888/2025)
  rdaStatus?: RDAStatus;
  rdaPayload?: string; // JSON string of the RDA for audit

  // Clinical Content
  chiefComplaint: string;
  historyOfPresentIllness: string; // Current illness narrative
  
  // Persistence: These load from previous, can be edited
  antecedents: string; // Pathological, Surgical, Allergic history

  // Dynamic Fields Store (Key: FieldID, Value: Value)
  // Replaces fixed 'vitals', 'riskVariables' for template flexibility
  dynamicData: Record<string, any>;

  diagnoses: DiagnosisItem[]; // Changed from single code/name
  plan: string;
  
  prescriptions: PrescriptionItem[];
  performedProcedures: ProcedureItem[]; 

  attachments: Attachment[];
  clarifyingNotes: ClarifyingNote[];
  emailSent?: boolean; 
}

export interface Attachment {
  id: string;
  type: 'LAB' | 'IMAGING';
  name: string;
  url: string; // Placeholder URL
  uploadedBy: string;
  date: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName?: string; // Denormalized for ease
  professionalId: string;
  date: string;
  time: string;
  reason: string;
  status: 'SCHEDULED' | 'WAITING' | 'COMPLETED' | 'CANCELLED'; // Added WAITING
  // NEW: Linked procedures for auto-billing
  procedures?: TariffItem[]; 
}

// --- BILLING TYPES ---
export interface ServiceItem {
  code: string; // CUPS
  name: string;
  price: number;
}

export interface InvoiceItem extends ServiceItem {
  quantity: number;
  discount?: number; // Per item discount percentage
  isSupply?: boolean; 
}

export interface Payment {
    id: string;
    date: string;
    amount: number;
    method: 'CASH' | 'CARD' | 'TRANSFER';
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number; // Global Amount
  total: number;
  balance: number; // Remaining to pay
  payments: Payment[]; // Partial payments history
  payerType: 'PATIENT' | 'INSURER';
  status: 'PAID' | 'PENDING' | 'PARTIAL' | 'CANCELLED';
}