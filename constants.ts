import { User, UserRole, Patient, Appointment, ClinicalRecord, RecordStatus, RecordType, RoleTemplate, TemplateSection, TemplateField, ServiceItem, TariffItem, Contract, ContractType, WorkShift, RDAStatus, AppNotification, PaymentRequest } from './types';

// Constants
export const SMLDV_2024 = 43333; // Salario Mínimo Legal Diario Vigente Colombia 2024 (Aprox)
export const HR_SURCHARGES = {
  NIGHT: 0.35, // 35% Recargo Nocturno (21:00 - 06:00)
  HOLIDAY: 0.75, // 75% Dominical/Festivo
  NIGHT_HOLIDAY: 1.10 // 110% Recargo Nocturno Festivo
};

// UTILS
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Mock Notifications
export const MOCK_NOTIFICATIONS: AppNotification[] = [
    { id: 'n1', title: 'Paciente en Sala', message: 'Juan Pérez ha llegado para su cita de las 09:00.', type: 'INFO', targetTab: 'dashboard', timestamp: 'Hace 5 min', read: false },
    { id: 'n2', title: 'Resultados Listos', message: 'Laboratorios de María González disponibles.', type: 'SUCCESS', targetTab: 'records', timestamp: 'Hace 1 hora', read: false },
    { id: 'n3', title: 'Alerta Financiera', message: 'Facturación del mes bajo el promedio.', type: 'ALERT', targetTab: 'reports', timestamp: 'Hace 2 horas', read: true },
];

// Mock Contracts
export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'c1',
    userId: 'u1', 
    type: ContractType.OPS,
    startDate: '2023-01-01',
    endDate: '2025-01-01',
    isActive: true,
    status: 'ACTIVE',
    opsValue: 6000000,
    opsPaymentMethod: 'FIXED_MONTHLY',
    fileUrl: 'contrato_ops_elena.pdf',
    auditTrail: [ { date: '2023-01-01', action: 'CREATED', changedBy: 'Admin Sistema', details: 'Creación inicial' } ]
  }
];

export const MOCK_PAYMENT_REQUESTS: PaymentRequest[] = [
    {
        id: 'pay-001',
        userId: 'u1',
        userName: 'Dra. Elena Foster',
        contractId: 'c1',
        period: 'Septiembre 2023',
        amount: 6000000,
        dateSubmitted: '2023-10-02',
        status: 'PAID',
        attachments: [
            { name: 'Seguridad_Social_Sep.pdf', type: 'SOCIAL_SECURITY' },
            { name: 'Informe_Actividades.pdf', type: 'ACTIVITY_REPORT' }
        ]
    }
];

export const MOCK_SHIFTS: WorkShift[] = [];

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    documentNumber: '1098765432',
    name: 'Dra. Elena Foster',
    firstName: 'Elena',
    lastName: 'Foster',
    birthDate: '1980-05-15',
    username: 'doc_elena',
    roles: [UserRole.PROFESSIONAL, UserRole.ADMIN],
    contracts: MOCK_CONTRACTS,
    status: 'ACTIVE',
    specialty: 'Medicina Interna',
    professionalLicense: 'MED-99281',
    digitalStampUrl: 'https://via.placeholder.com/150x80?text=Firma+Digital',
    eps: 'Sura',
    arl: 'Sura',
    pensionFund: 'Protección'
  },
  {
    id: 'u2',
    documentNumber: '80123456',
    name: 'Admin Sistema',
    firstName: 'Admin',
    lastName: 'Sistema',
    username: 'admin',
    roles: [UserRole.ADMIN],
    contracts: [],
    status: 'ACTIVE',
    eps: 'Sanitas',
    arl: 'Bolivar'
  },
  {
    id: 'u3',
    documentNumber: '1122334455',
    name: 'Sara Secretaria',
    firstName: 'Sara',
    lastName: 'Secretaria',
    username: 'sarah_sec',
    roles: [UserRole.SECRETARY],
    contracts: [],
    status: 'ACTIVE'
  },
  {
    id: 'u4',
    documentNumber: '99887766',
    name: 'Bact. Marco Lab',
    firstName: 'Marco',
    lastName: 'Lab',
    username: 'marco_lab',
    roles: [UserRole.BACTERIOLOGIST],
    professionalLicense: 'BAC-11002',
    digitalStampUrl: 'https://via.placeholder.com/150x80?text=Firma+Marco',
    contracts: [],
    status: 'ACTIVE'
  },
  {
    id: 'u5',
    documentNumber: '77665544',
    name: 'Dr. Rayos X',
    firstName: 'Carlos',
    lastName: 'Rayos',
    username: 'carlos_rad',
    roles: [UserRole.RADIOLOGIST],
    professionalLicense: 'RAD-55221',
    digitalStampUrl: 'https://via.placeholder.com/150x80?text=Firma+Carlos',
    contracts: [],
    status: 'ACTIVE'
  },
  {
    id: 'u6',
    documentNumber: '55667788',
    name: 'Dra. Sofia Mente',
    firstName: 'Sofia',
    lastName: 'Mente',
    username: 'psicologa',
    roles: [UserRole.PSYCHOLOGIST, UserRole.PROFESSIONAL],
    professionalLicense: 'PSI-33211',
    specialty: 'Psicología Clínica',
    digitalStampUrl: 'https://via.placeholder.com/150x80?text=Firma+Sofia',
    contracts: [],
    status: 'ACTIVE'
  }
];

// --- FINANCIAL / TARIFFS ---
export const MOCK_SOAT_TARIFF: TariffItem[] = [
    { code: '890201', name: 'CONSULTA DE PRIMERA VEZ POR MEDICINA GENERAL', soatFactor: 1.00 },
    { code: '890301', name: 'CONSULTA DE CONTROL POR MEDICINA GENERAL', soatFactor: 0.89 },
    { code: '890208', name: 'CONSULTA DE PRIMERA VEZ POR PSICOLOGIA', soatFactor: 0.95 },
    { code: '890308', name: 'CONSULTA DE CONTROL POR PSICOLOGIA', soatFactor: 0.85 },
    { code: '903895', name: 'HEMOGRAMA IV [AUTOMATIZADO]', soatFactor: 0.55 }, 
    { code: '902213', name: 'UROANALISIS CON SEDIMENTO', soatFactor: 0.35 },
    { code: '871020', name: 'RADIOGRAFIA DE TORAX', soatFactor: 1.10 },
    { code: '881234', name: 'ECOGRAFIA DE ABDOMEN TOTAL', soatFactor: 2.10 },
];

// --- GLOBAL FIELD LIBRARY ---
export const MOCK_FIELD_LIBRARY: TemplateField[] = [
    { id: 'global_weight', label: 'Peso', type: 'NUMBER', unit: 'kg', required: true, isGlobal: true },
    { id: 'global_height', label: 'Talla', type: 'NUMBER', unit: 'm', required: true, isGlobal: true },
    { id: 'global_bmi', label: 'IMC', type: 'CALCULATED', unit: 'kg/m²', formula: 'global_weight / (global_height * global_height)', required: false, isGlobal: true },
    { id: 'global_sys_bp', label: 'Tensión Sistólica', type: 'NUMBER', unit: 'mmHg', required: true, isGlobal: true },
    { id: 'global_dia_bp', label: 'Tensión Diastólica', type: 'NUMBER', unit: 'mmHg', required: true, isGlobal: true },
    { id: 'global_temp', label: 'Temperatura', type: 'NUMBER', unit: '°C', required: true, isGlobal: true },
    { id: 'global_creatinine', label: 'Creatinina Sérica', type: 'NUMBER', unit: 'mg/dL', required: false, isGlobal: true },
    { id: 'global_chol_total', label: 'Colesterol Total', type: 'NUMBER', unit: 'mg/dL', required: false, isGlobal: true },
    { id: 'global_chol_hdl', label: 'Colesterol HDL', type: 'NUMBER', unit: 'mg/dL', required: false, isGlobal: true },
    { id: 'global_smoker', label: 'Fumador Activo', type: 'SELECT', options: ['NO', 'SI'], required: true, isGlobal: true },
    { id: 'global_barthel', label: 'Puntaje Barthel (0-100)', type: 'NUMBER', required: false, isGlobal: true },
];

// --- GLOBAL SECTION LIBRARY ---
export const MOCK_SECTION_LIBRARY: TemplateSection[] = [
  {
    id: 'sec_anamnesis',
    title: 'Anamnesis General',
    fields: [
      { id: 'f_mc', label: 'Motivo de Consulta', type: 'TEXTAREA', required: true },
      { id: 'f_ea', label: 'Enfermedad Actual', type: 'TEXTAREA', required: true }
    ]
  },
  {
    id: 'sec_antecedentes_full',
    title: 'Antecedentes Completos',
    fields: [
      { id: 'f_ant_pat', label: 'Personales Patológicos', type: 'TEXTAREA', required: false },
      { id: 'f_ant_qx', label: 'Quirúrgicos', type: 'TEXTAREA', required: false },
      { id: 'f_ant_alerg', label: 'Alergias', type: 'TEXT', required: true },
      { id: 'f_ant_fam', label: 'Antecedentes Familiares', type: 'TEXTAREA', required: false },
      { id: 'f_ant_gineco', label: 'Gineco-Obstétricos (G/P/A/C)', type: 'TEXT', required: false }
    ]
  },
  {
    id: 'sec_vitals_adult',
    title: 'Signos Vitales',
    fields: [
      MOCK_FIELD_LIBRARY[0], // Weight
      MOCK_FIELD_LIBRARY[1], // Height
      MOCK_FIELD_LIBRARY[2], // BMI
      MOCK_FIELD_LIBRARY[3], // Sys BP
      MOCK_FIELD_LIBRARY[4], // Dia BP
      { id: 'v_tam', label: 'Tensión Media', type: 'CALCULATED', required: false, formula: '(2 * global_dia_bp + global_sys_bp) / 3', unit: 'mmHg' },
      { id: 'v_fc', label: 'Frec. Cardíaca', type: 'NUMBER', required: true, unit: 'lpm' },
      { id: 'v_fr', label: 'Frec. Respiratoria', type: 'NUMBER', required: true, unit: 'rpm' },
      { id: 'v_sat', label: 'Saturación O2', type: 'NUMBER', required: false, unit: '%' }
    ]
  },
  {
    id: 'sec_diagnosis_plan',
    title: 'Diagnóstico y Plan',
    fields: [
      { id: 'd_analisis', label: 'Análisis Clínico', type: 'TEXTAREA', required: true },
      { id: 'd_plan', label: 'Plan de Manejo / Recomendaciones', type: 'TEXTAREA', required: true },
      { id: 'd_rx_header', label: 'Módulo de Prescripción', type: 'HEADER', required: false }
    ]
  },
  // --- LAB SECTIONS (NEW) ---
  {
      id: 'sec_lab_hemogram',
      title: 'Hemograma IV [Automatizado]',
      fields: [
          { id: 'lab_hgb', label: 'Hemoglobina', type: 'NUMBER', unit: 'g/dL', required: true },
          { id: 'lab_hct', label: 'Hematocrito', type: 'NUMBER', unit: '%', required: true },
          { id: 'lab_wbc', label: 'Leucocitos', type: 'NUMBER', unit: 'x10^3/uL', required: true },
          { id: 'lab_plt', label: 'Plaquetas', type: 'NUMBER', unit: 'x10^3/uL', required: true },
          { id: 'lab_neut', label: 'Neutrófilos', type: 'NUMBER', unit: '%', required: false },
          { id: 'lab_lymph', label: 'Linfocitos', type: 'NUMBER', unit: '%', required: false }
      ]
  },
  {
      id: 'sec_lab_uro',
      title: 'Uroanálisis',
      fields: [
          { id: 'lab_uro_color', label: 'Color', type: 'TEXT', required: true },
          { id: 'lab_uro_aspect', label: 'Aspecto', type: 'SELECT', options: ['Transparente', 'Lig. Turbio', 'Turbio'], required: true },
          { id: 'lab_uro_ph', label: 'pH', type: 'NUMBER', required: true },
          { id: 'lab_uro_dens', label: 'Densidad', type: 'NUMBER', required: true },
          { id: 'lab_uro_leuc', label: 'Leucocitos (Tira)', type: 'TEXT', required: true }
      ]
  },
  // --- IMAGING SECTIONS (NEW) ---
  {
      id: 'sec_rad_report',
      title: 'Informe Radiológico',
      fields: [
          { id: 'rad_technique', label: 'Técnica', type: 'TEXT', required: true, defaultValue: 'Proyecciones estándar.' },
          { id: 'rad_findings', label: 'Hallazgos', type: 'TEXTAREA', required: true },
          { id: 'rad_conclusion', label: 'Conclusión / Impresión Diagnóstica', type: 'TEXTAREA', required: true },
          { id: 'rad_images', label: 'Imágenes / Placas', type: 'FILE', required: false }
      ]
  },
  // --- PSYCHOLOGY SECTIONS ---
  {
      id: 'sec_psy_mental',
      title: 'Examen Mental',
      fields: [
          { id: 'psy_apariencia', label: 'Porte y Actitud', type: 'TEXTAREA', required: true },
          { id: 'psy_conciencia', label: 'Conciencia', type: 'SELECT', options: ['Alerta', 'Somnoliento', 'Estupor', 'Coma'], required: true },
          { id: 'psy_afecto', label: 'Afecto', type: 'TEXT', required: true },
          { id: 'psy_pensamiento', label: 'Pensamiento', type: 'TEXTAREA', required: true },
          { id: 'psy_juicio', label: 'Juicio y Raciocinio', type: 'TEXTAREA', required: true }
      ]
  }
];

// --- MOCK TEMPLATES ---
export const MOCK_TEMPLATES: RoleTemplate[] = [
  // ... (Existing clinical templates)
  {
    id: 't_general',
    name: 'Consulta Externa General',
    description: 'Historia clínica estándar.',
    active: true,
    allowedRoles: [UserRole.PROFESSIONAL],
    recordType: RecordType.GENERAL,
    sections: [ MOCK_SECTION_LIBRARY[0], MOCK_SECTION_LIBRARY[1], MOCK_SECTION_LIBRARY[2], MOCK_SECTION_LIBRARY[3] ]
  },
  
  // --- LAB TEMPLATES ---
  {
      id: 't_lab_hemo',
      name: 'Resultado Hemograma',
      description: 'Reporte automatizado de cuadro hemático.',
      active: true,
      allowedRoles: [UserRole.BACTERIOLOGIST],
      recordType: RecordType.LAB_RESULT,
      sections: [ MOCK_SECTION_LIBRARY[4] ] // Only Hemogram section
  },
  {
      id: 't_lab_uro',
      name: 'Resultado Uroanálisis',
      description: 'Parcial de orina.',
      active: true,
      allowedRoles: [UserRole.BACTERIOLOGIST],
      recordType: RecordType.LAB_RESULT,
      sections: [ MOCK_SECTION_LIBRARY[5] ] // Only Uro section
  },

  // --- IMAGING TEMPLATES ---
  {
      id: 't_rad_general',
      name: 'Informe Imagenología General',
      description: 'Rayos X, Ecografía básica.',
      active: true,
      allowedRoles: [UserRole.RADIOLOGIST],
      recordType: RecordType.IMAGING_REPORT,
      sections: [ MOCK_SECTION_LIBRARY[6] ] // Only Radiology section
  },

  // --- PSYCHOLOGY TEMPLATE ---
  {
      id: 't_psychology',
      name: 'Consulta Psicológica',
      description: 'Valoración de salud mental.',
      active: true,
      allowedRoles: [UserRole.PSYCHOLOGIST, UserRole.PROFESSIONAL],
      recordType: RecordType.PSYCHOLOGY,
      sections: [ MOCK_SECTION_LIBRARY[0], MOCK_SECTION_LIBRARY[7], MOCK_SECTION_LIBRARY[3] ] // Anamnesis, Examen Mental, Plan
  }
];

// Mock Patients
export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'p1',
    fullName: 'Juan Pérez',
    identification: '123456789',
    birthDate: '1985-04-12',
    gender: 'M',
    phone: '300-555-0101',
    email: 'juan.perez@ejemplo.com',
    insuranceType: 'EPS Sura - Contributivo'
  },
  {
    id: 'p2',
    fullName: 'María González',
    identification: '987654321',
    birthDate: '1952-08-23', 
    gender: 'F',
    phone: '300-555-0102',
    email: 'maria.gonzalez@ejemplo.com',
    insuranceType: 'Sanitas - Subsidiado'
  }
];

// Mock Records
export const MOCK_RECORDS: ClinicalRecord[] = [
  {
    id: 'r1',
    patientId: 'p1',
    professionalId: 'u1',
    professionalName: 'Dra. Elena Foster',
    recordType: RecordType.GENERAL,
    dateCreated: '2023-10-25T09:00:00Z',
    status: RecordStatus.FINALIZED,
    rdaStatus: RDAStatus.SENT_MINSALUD, 
    dateFinalized: '2023-10-25T09:45:00Z',
    chiefComplaint: 'Dolor de cabeza',
    historyOfPresentIllness: '...',
    antecedents: '...',
    dynamicData: {},
    diagnoses: [{ code: '8A80.0', name: 'Migraña sin aura', type: 'PRINCIPAL' }],
    plan: '...',
    prescriptions: [],
    performedProcedures: [],
    attachments: [],
    clarifyingNotes: []
  },
  // MOCK LAB RESULT 1
  {
    id: 'lr1',
    patientId: 'p1',
    professionalId: 'u4',
    professionalName: 'Bact. Marco Lab',
    recordType: RecordType.LAB_RESULT,
    dateCreated: new Date().toISOString(), // Today
    status: RecordStatus.FINALIZED,
    chiefComplaint: 'Hemograma IV [Automatizado]',
    historyOfPresentIllness: '',
    antecedents: '',
    dynamicData: { lab_hgb: '14.5', lab_hct: '42', lab_wbc: '7500', lab_plt: '250000' },
    diagnoses: [],
    plan: '',
    prescriptions: [],
    performedProcedures: [],
    attachments: [],
    clarifyingNotes: []
  },
  // MOCK IMAGING REPORT 1
  {
    id: 'ir1',
    patientId: 'p1',
    professionalId: 'u5',
    professionalName: 'Dr. Rayos X',
    recordType: RecordType.IMAGING_REPORT,
    dateCreated: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    status: RecordStatus.FINALIZED,
    chiefComplaint: 'Radiografía de Torax',
    historyOfPresentIllness: '',
    antecedents: '',
    dynamicData: { rad_findings: 'Silueta cardiaca de tamaño normal. Campos pulmonares limpios.', rad_conclusion: 'Estudio normal.' },
    diagnoses: [],
    plan: '',
    prescriptions: [],
    performedProcedures: [],
    attachments: [],
    clarifyingNotes: []
  }
];

// Mock Appointments
export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'a1',
    patientId: 'p1',
    patientName: 'Juan Pérez',
    professionalId: 'u1',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    reason: 'Control Médico',
    status: 'SCHEDULED'
  }
];

export const MOCK_SERVICES: ServiceItem[] = [
    { code: '890201', name: 'CONSULTA DE PRIMERA VEZ POR MEDICINA GENERAL', price: 45000 },
];

export const MOCK_CIE11 = [
  { code: '8A80.0', name: 'Migraña sin aura' },
  { code: 'BA00', name: 'Hipertensión esencial' },
];

export const MOCK_MEDICATIONS = [ 'Acetaminofén 500mg Tab', 'Ibuprofeno 400mg Tab' ];