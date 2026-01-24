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
  },
  {
    id: 'u7',
    documentNumber: '12345678',
    name: 'Dr. Gregory House',
    firstName: 'Gregory',
    lastName: 'House',
    username: 'doc_house',
    roles: [UserRole.PROFESSIONAL],
    professionalLicense: 'MED-HOUSE-1',
    specialty: 'Diagnóstico / Nefrología',
    digitalStampUrl: 'https://via.placeholder.com/150x80?text=Firma+House',
    contracts: [],
    status: 'ACTIVE'
  },
  {
    id: 'u8',
    documentNumber: '87654321',
    name: 'Lic. Pedro Psi',
    firstName: 'Pedro',
    lastName: 'Psicólogo',
    username: 'pedro_psi',
    roles: [UserRole.PSYCHOLOGIST, UserRole.PROFESSIONAL],
    professionalLicense: 'PSI-99881',
    specialty: 'Psicología Cognitiva',
    digitalStampUrl: 'https://via.placeholder.com/150x80?text=Firma+Pedro',
    contracts: [],
    status: 'ACTIVE'
  },
  {
    id: 'u9',
    documentNumber: '13572468',
    name: 'Nutr. Carla Dieta',
    firstName: 'Carla',
    lastName: 'Dieta',
    username: 'carla_nutri',
    roles: [UserRole.NUTRITIONIST, UserRole.PROFESSIONAL],
    professionalLicense: 'NUT-44332',
    specialty: 'Nutrición Clínica',
    digitalStampUrl: 'https://via.placeholder.com/150x80?text=Firma+Carla',
    contracts: [],
    status: 'ACTIVE'
  },
  {
    id: 'u10',
    documentNumber: '24681357',
    name: 'Sandra Secretaria',
    firstName: 'Sandra',
    lastName: 'Secretaria',
    username: 'sandra_sec',
    roles: [UserRole.SECRETARY],
    contracts: [],
    status: 'ACTIVE'
  },
  {
    id: 'u11',
    documentNumber: '11224455',
    name: 'Contador',
    firstName: 'Roberto',
    lastName: 'Contador',
    username: 'contador_demo',
    roles: [UserRole.ACCOUNTANT],
    contracts: [],
    status: 'ACTIVE'
  },
  {
    id: 'u12',
    documentNumber: '55442211',
    name: 'Gerente',
    firstName: 'Victoria',
    lastName: 'Gerente',
    username: 'gerente_demo',
    roles: [UserRole.MANAGER, UserRole.ADMIN],
    contracts: [],
    status: 'ACTIVE'
  }
];

// --- FINANCIAL / TARIFFS (Updated with Specific Lab CUPS) ---
export const MOCK_SOAT_TARIFF: TariffItem[] = [
    { code: '890201', name: 'CONSULTA DE PRIMERA VEZ POR MEDICINA GENERAL', soatFactor: 1.00 },
    { code: '890301', name: 'CONSULTA DE CONTROL POR MEDICINA GENERAL', soatFactor: 0.89 },
    { code: '890208', name: 'CONSULTA DE PRIMERA VEZ POR PSICOLOGIA', soatFactor: 0.95 },
    { code: '902213', name: 'HEMOGRAMA IV [AUTOMATIZADO]', soatFactor: 0.65 }, 
    { code: '907106', name: 'UROANALISIS CON SEDIMENTO Y DENSIDAD', soatFactor: 0.40 },
    { code: '903825', name: 'PERFIL LIPIDICO (COLESTEROL, HDL, LDL, TRIGLICERIDOS)', soatFactor: 1.80 },
    { code: '903841', name: 'GLUCOSA EN SUERO (BASAL)', soatFactor: 0.35 },
    { code: '903842', name: 'GLUCOSA POST PRANDIAL', soatFactor: 0.35 },
    { code: '903839', name: 'HEMOGLOBINA GLICOSILADA A1C', soatFactor: 0.90 },
    { code: '871020', name: 'RADIOGRAFIA DE TORAX', soatFactor: 1.10 },
    { code: '881234', name: 'ECOGRAFIA DE ABDOMEN TOTAL', soatFactor: 2.10 },
];

// --- GLOBAL FIELD LIBRARY ---
export const MOCK_FIELD_LIBRARY: TemplateField[] = [
    // BASIC
    { id: 'global_weight', label: 'Peso', type: 'NUMBER', unit: 'kg', required: true, isGlobal: true },
    { id: 'global_height', label: 'Talla', type: 'NUMBER', unit: 'm', required: true, isGlobal: true },
    { id: 'global_bmi', label: 'IMC', type: 'CALCULATED', unit: 'kg/m²', formula: 'global_weight / (global_height * global_height)', required: false, isGlobal: true },
    { id: 'global_sys_bp', label: 'Tensión Sistólica', type: 'NUMBER', unit: 'mmHg', required: true, isGlobal: true },
    { id: 'global_dia_bp', label: 'Tensión Diastólica', type: 'NUMBER', unit: 'mmHg', required: true, isGlobal: true },
    { id: 'global_temp', label: 'Temperatura', type: 'NUMBER', unit: '°C', required: true, isGlobal: true },
    // RCV SPECIFIC
    { id: 'global_creatinine', label: 'Creatinina Sérica', type: 'NUMBER', unit: 'mg/dL', required: false, isGlobal: true },
    { id: 'global_chol_total', label: 'Colesterol Total', type: 'NUMBER', unit: 'mg/dL', required: false, isGlobal: true },
    { id: 'global_chol_hdl', label: 'Colesterol HDL', type: 'NUMBER', unit: 'mg/dL', required: false, isGlobal: true },
    { id: 'global_smoker', label: 'Fumador Activo', type: 'SELECT', options: ['NO', 'SI'], required: true, isGlobal: true },
    { id: 'global_barthel', label: 'Puntaje Barthel (0-100)', type: 'NUMBER', required: false, isGlobal: true },
    // OBSTETRIC
    { id: 'obs_gestational_age', label: 'Edad Gestacional', type: 'NUMBER', unit: 'semanas', required: true, isGlobal: true },
    { id: 'obs_fhr', label: 'Frec. Cardíaca Fetal', type: 'NUMBER', unit: 'lpm', required: true, isGlobal: true },
    { id: 'obs_uterine_height', label: 'Altura Uterina', type: 'NUMBER', unit: 'cm', required: true, isGlobal: true },
    // VISUAL
    { id: 'vis_av_od', label: 'Agudeza Visual O.D.', type: 'TEXT', required: true, isGlobal: true, placeholder: 'Ej. 20/20' },
    { id: 'vis_av_oi', label: 'Agudeza Visual O.I.', type: 'TEXT', required: true, isGlobal: true, placeholder: 'Ej. 20/20' },
];

// --- GLOBAL SECTION LIBRARY ---
export const MOCK_SECTION_LIBRARY: TemplateSection[] = [
  // 0. ANAMNESIS
  {
    id: 'sec_anamnesis',
    title: 'Anamnesis General',
    fields: [
      { id: 'f_mc', label: 'Motivo de Consulta', type: 'TEXTAREA', required: true },
      { id: 'f_ea', label: 'Enfermedad Actual', type: 'TEXTAREA', required: true }
    ]
  },
  // 1. ANTECEDENTES
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
  // 2. VITALS
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
  // 3. DX & PLAN
  {
    id: 'sec_diagnosis_plan',
    title: 'Diagnóstico y Plan',
    fields: [
      { id: 'd_analisis', label: 'Análisis Clínico', type: 'TEXTAREA', required: true },
      { id: 'd_plan', label: 'Plan de Manejo / Recomendaciones', type: 'TEXTAREA', required: true },
      { id: 'd_rx_header', label: 'Módulo de Prescripción', type: 'HEADER', required: false }
    ]
  },
  // --- DETAILED LAB SECTIONS (UPDATED) ---
  // 4. HEMOGRAM FULL
  {
      id: 'sec_lab_hemo_full',
      title: 'Hemograma Completo (CUPS 902213)',
      fields: [
          // RED SERIES
          { id: 'hem_header_red', label: 'Serie Roja (Eritrocitaria)', type: 'HEADER', required: false },
          { id: 'hem_rbc', label: 'Glóbulos Rojos', type: 'NUMBER', unit: 'M/uL', required: true, placeholder: 'M: 4.5-5.9 | F: 4.1-5.1' },
          { id: 'hem_hb', label: 'Hemoglobina (Hb)', type: 'NUMBER', unit: 'g/dL', required: true, placeholder: 'M: 14-18 | F: 12-16' },
          { id: 'hem_hto', label: 'Hematocrito (Hto)', type: 'NUMBER', unit: '%', required: true, placeholder: 'M: 42-50 | F: 36-47' },
          { id: 'hem_vcm', label: 'VCM', type: 'NUMBER', unit: 'fL', required: true, placeholder: '80-100' },
          { id: 'hem_hcm', label: 'HCM', type: 'NUMBER', unit: 'pg', required: true, placeholder: '27-34' },
          { id: 'hem_chcm', label: 'CHCM', type: 'NUMBER', unit: 'g/dL', required: true, placeholder: '32-36' },
          { id: 'hem_rdw', label: 'RDW', type: 'NUMBER', unit: '%', required: true, placeholder: '11-14.5' },
          
          // WHITE SERIES
          { id: 'hem_header_white', label: 'Serie Blanca (Leucocitaria)', type: 'HEADER', required: false },
          { id: 'hem_wbc', label: 'Leucocitos Totales', type: 'NUMBER', unit: '/mm3', required: true, placeholder: '4,500 - 11,000' },
          { id: 'hem_neu_p', label: 'Neutrófilos %', type: 'NUMBER', unit: '%', required: true, placeholder: '55-70%' },
          { id: 'hem_lin_p', label: 'Linfocitos %', type: 'NUMBER', unit: '%', required: true, placeholder: '20-40%' },
          { id: 'hem_mon_p', label: 'Monocitos %', type: 'NUMBER', unit: '%', required: true, placeholder: '2-8%' },
          { id: 'hem_eos_p', label: 'Eosinófilos %', type: 'NUMBER', unit: '%', required: true, placeholder: '1-4%' },
          { id: 'hem_bas_p', label: 'Basófilos %', type: 'NUMBER', unit: '%', required: true, placeholder: '0-1%' },
          
          // PLATELETS
          { id: 'hem_header_plt', label: 'Serie Plaquetaria', type: 'HEADER', required: false },
          { id: 'hem_plt', label: 'Recuento Plaquetas', type: 'NUMBER', unit: '/uL', required: true, placeholder: '150k - 450k' },
          { id: 'hem_vpm', label: 'VPM', type: 'NUMBER', unit: 'fL', required: false, placeholder: '7-11' }
      ]
  },
  // 5. UROANALYSIS FULL
  {
      id: 'sec_lab_uro_full',
      title: 'Uroanálisis Completo (CUPS 907106)',
      fields: [
          // PHYSICAL
          { id: 'uro_color', label: 'Color', type: 'TEXT', required: true, placeholder: 'Amarillo/Ámbar' },
          { id: 'uro_aspect', label: 'Aspecto', type: 'SELECT', options: ['Transparente', 'Ligeramente Turbio', 'Turbio'], required: true },
          { id: 'uro_dens', label: 'Densidad', type: 'NUMBER', required: true, placeholder: '1.005 - 1.030' },
          { id: 'uro_ph', label: 'pH', type: 'NUMBER', required: true, placeholder: '4.6 - 8.0' },
          
          // CHEMICAL (STRIP)
          { id: 'uro_header_chem', label: 'Examen Químico (Tira)', type: 'HEADER', required: false },
          { id: 'uro_gluc', label: 'Glucosa', type: 'SELECT', options: ['Negativo', 'Positivo (+)'], required: true },
          { id: 'uro_prot', label: 'Proteínas', type: 'SELECT', options: ['Negativo', 'Trazas', 'Positivo'], required: true },
          { id: 'uro_ket', label: 'Cetonas', type: 'SELECT', options: ['Negativo', 'Positivo'], required: true },
          { id: 'uro_blood', label: 'Sangre/Hb', type: 'SELECT', options: ['Negativo', 'Positivo'], required: true },
          { id: 'uro_nit', label: 'Nitritos', type: 'SELECT', options: ['Negativo', 'Positivo'], required: true },
          { id: 'uro_leu', label: 'Esterasa Leucocitaria', type: 'SELECT', options: ['Negativo', 'Positivo'], required: true },

          // SEDIMENT
          { id: 'uro_header_micro', label: 'Sedimento Microscópico', type: 'HEADER', required: false },
          { id: 'uro_sed_epi', label: 'Células Epiteliales', type: 'TEXT', required: true, placeholder: 'Escasas' },
          { id: 'uro_sed_leu', label: 'Leucocitos x Campo', type: 'TEXT', required: true, placeholder: '0-5' },
          { id: 'uro_sed_rbc', label: 'Hematíes x Campo', type: 'TEXT', required: true, placeholder: '0-3' },
          { id: 'uro_sed_bac', label: 'Bacterias', type: 'SELECT', options: ['Ausentes', 'Escasas', 'Moderadas', 'Abundantes'], required: true },
          { id: 'uro_sed_obs', label: 'Otros (Cristales/Cilindros)', type: 'TEXTAREA', required: false }
      ]
  },
  // 6. LIPID PROFILE
  {
      id: 'sec_lab_lipid',
      title: 'Perfil Lipídico Detallado (CUPS 903825)',
      fields: [
          MOCK_FIELD_LIBRARY[7], // Cholesterol Total
          MOCK_FIELD_LIBRARY[8], // HDL
          { id: 'lip_ldl', label: 'Colesterol LDL (Malo)', type: 'NUMBER', unit: 'mg/dL', required: true, placeholder: '< 100 óptimo' },
          { id: 'lip_trig', label: 'Triglicéridos', type: 'NUMBER', unit: 'mg/dL', required: true, placeholder: '< 150' },
          
          // CALCULATED
          { id: 'lip_vldl', label: 'VLDL (Calc)', type: 'CALCULATED', unit: 'mg/dL', required: false, formula: 'lip_trig / 5' },
          { id: 'lip_nohdl', label: 'Colesterol No-HDL (Calc)', type: 'CALCULATED', unit: 'mg/dL', required: false, formula: 'global_chol_total - global_chol_hdl' }
      ]
  },
  // 7. GLUCOSE METABOLISM
  {
      id: 'sec_lab_glucose',
      title: 'Metabolismo de la Glucosa (ADA/OMS)',
      fields: [
          { id: 'glu_fasting', label: 'Glucosa Ayunas (Basal)', type: 'NUMBER', unit: 'mg/dL', required: false, placeholder: '70-99 Normal' },
          { id: 'glu_post', label: 'Glucosa Postprandial (2h)', type: 'NUMBER', unit: 'mg/dL', required: false, placeholder: '< 140 Normal' },
          { id: 'glu_hba1c', label: 'Hemoglobina Glicosilada (HbA1c)', type: 'NUMBER', unit: '%', required: false, placeholder: '< 5.7% Normal' },
          { id: 'glu_dx_sugg', label: 'Interpretación Sugerida', type: 'INFO', required: false, placeholder: 'Pre-Diabetes: 5.7-6.4% | Diabetes: >= 6.5%' }
      ]
  },
  // 8. RAD REPORT
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
  // 9. PSY EXAM
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
  },
  // 10. NUTRITION
  {
      id: 'sec_nutrition_recall',
      title: 'Valoración Nutricional',
      fields: [
          MOCK_FIELD_LIBRARY[0], // Weight
          MOCK_FIELD_LIBRARY[1], // Height
          MOCK_FIELD_LIBRARY[2], // BMI
          { id: 'nut_abdominal', label: 'Perímetro Abdominal', type: 'NUMBER', unit: 'cm', required: true },
          { id: 'nut_anamnesis', label: 'Anamnesis Alimentaria (Recordatorio 24h)', type: 'TEXTAREA', required: true },
          { id: 'nut_dx', label: 'Diagnóstico Nutricional', type: 'TEXTAREA', required: true }
      ]
  },
  // 11. PROCEDURES
  {
      id: 'sec_proc_details',
      title: 'Nota de Procedimiento',
      fields: [
          { id: 'proc_name', label: 'Nombre del Procedimiento', type: 'TEXT', required: true },
          { id: 'proc_anesthesia', label: 'Tipo de Anestesia', type: 'SELECT', options: ['Local', 'General', 'Sedación', 'Ninguna'], required: true },
          { id: 'proc_description', label: 'Descripción Técnica / Hallazgos', type: 'TEXTAREA', required: true },
          { id: 'proc_complications', label: 'Complicaciones', type: 'TEXTAREA', required: false, defaultValue: 'No se presentaron.' }
      ]
  },
  // 12. PYP Crecimiento
  {
      id: 'sec_pyp_growth',
      title: 'Crecimiento y Desarrollo (<10 Años)',
      fields: [
          MOCK_FIELD_LIBRARY[0], // Weight
          MOCK_FIELD_LIBRARY[1], // Height
          { id: 'pyp_pc', label: 'Perímetro Cefálico', type: 'NUMBER', unit: 'cm', required: false },
          { id: 'pyp_milestones', label: 'Hitos del Desarrollo', type: 'TEXTAREA', required: true, placeholder: 'Motor grueso, fino, lenguaje, personal-social...' },
          { id: 'pyp_vaccination', label: 'Esquema Vacunación', type: 'SELECT', options: ['Completo para la edad', 'Incompleto', 'Sin carnet'], required: true },
          { id: 'pyp_deworming', label: 'Desparasitación Reciente', type: 'SELECT', options: ['SI', 'NO'], required: true }
      ]
  },
  // 13. PYP Joven
  {
      id: 'sec_pyp_young',
      title: 'Desarrollo del Joven (10-29 Años)',
      fields: [
          { id: 'pyp_tanner', label: 'Estadio de Tanner', type: 'SELECT', options: ['I', 'II', 'III', 'IV', 'V'], required: true },
          { id: 'pyp_sexual_health', label: 'Salud Sexual y Reproductiva', type: 'TEXTAREA', required: true },
          { id: 'pyp_risks', label: 'Riesgos (SPA, Violencia, Mental)', type: 'TEXTAREA', required: true }
      ]
  },
  // 14. PYP Prenatal
  {
      id: 'sec_pyp_prenatal',
      title: 'Control Prenatal',
      fields: [
          MOCK_FIELD_LIBRARY[12], // Edad Gestacional
          MOCK_FIELD_LIBRARY[14], // Altura Uterina
          MOCK_FIELD_LIBRARY[13], // FHR
          { id: 'pyp_fetal_mov', label: 'Movimientos Fetales', type: 'SELECT', options: ['Presentes', 'Ausentes', 'Disminuidos'], required: true },
          { id: 'pyp_alarm_signs', label: 'Signos de Alarma', type: 'TEXTAREA', required: true, defaultValue: 'Negativos.' },
          { id: 'pyp_prenatal_labs', label: 'Revisión Paraclínicos', type: 'TEXTAREA', required: false }
      ]
  },
  // 15. PYP CV Risk
  {
      id: 'sec_pyp_cv_risk',
      title: 'Riesgo Cardiovascular (RCV)',
      fields: [
          MOCK_FIELD_LIBRARY[3], // Sys
          MOCK_FIELD_LIBRARY[4], // Dia
          MOCK_FIELD_LIBRARY[9], // Smoker
          MOCK_FIELD_LIBRARY[0], // Weight
          MOCK_FIELD_LIBRARY[7], // Total Chol
          MOCK_FIELD_LIBRARY[8], // HDL
          MOCK_FIELD_LIBRARY[6], // Creatinine
          // Calculated Fields
          { id: 'calc_tfg', label: 'TFG Estimada (Cockcroft-Gault)', type: 'CALCULATED', unit: 'mL/min', required: false },
          { id: 'calc_framingham', label: 'Riesgo Framingham (10 años)', type: 'CALCULATED', unit: '%', required: false },
          // Barthel (Logic in View to make required if first time)
          MOCK_FIELD_LIBRARY[10], // Barthel
          { id: 'pyp_cv_goals', label: 'Metas Terapéuticas', type: 'TEXTAREA', required: true }
      ]
  },
  // 16. PYP Visual
  {
      id: 'sec_pyp_visual',
      title: 'Salud Visual',
      fields: [
          MOCK_FIELD_LIBRARY[15], // OD
          MOCK_FIELD_LIBRARY[16], // OI
          { id: 'vis_structures', label: 'Examen Externo / Estructuras', type: 'TEXTAREA', required: true },
          { id: 'vis_dx', label: 'Diagnóstico Visual', type: 'TEXT', required: true }
      ]
  },
  // 17. PYP Family Planning
  {
      id: 'sec_pyp_family_planning',
      title: 'Planificación Familiar',
      fields: [
          { id: 'fp_current_method', label: 'Método Actual', type: 'TEXT', required: true },
          { id: 'fp_side_effects', label: 'Efectos Secundarios', type: 'TEXT', required: false },
          { id: 'fp_counseling', label: 'Asesoría Brindada', type: 'TEXTAREA', required: true, defaultValue: 'Se brinda asesoría sobre derechos sexuales y reproductivos y canasta de métodos disponibles.' },
          { id: 'fp_method_chosen', label: 'Método Elegido / Renovado', type: 'TEXT', required: true }
      ]
  },
  // 18. PYP Cancer
  {
      id: 'sec_pyp_cancer',
      title: 'Detección Cáncer (Cuello Uterino/Seno)',
      fields: [
          { id: 'ca_cytology_date', label: 'Fecha Última Citología', type: 'DATE', required: false },
          { id: 'ca_cytology_result', label: 'Resultado Citología', type: 'TEXT', required: false },
          { id: 'ca_breast_exam', label: 'Examen Clínico de Mama', type: 'TEXTAREA', required: true, placeholder: 'Inspección y palpación...' },
          { id: 'ca_mammo_date', label: 'Fecha Mamografía (>50 años)', type: 'DATE', required: false }
      ]
  },
  // 19. PYP Newborn
  {
      id: 'sec_pyp_newborn',
      title: 'Recién Nacido (< 1 Mes)',
      fields: [
          MOCK_FIELD_LIBRARY[0], // Weight
          MOCK_FIELD_LIBRARY[1], // Height (Length)
          { id: 'nb_reflexes', label: 'Reflejos Primitivos', type: 'TEXTAREA', required: true },
          { id: 'nb_umbilical', label: 'Muñón Umbilical', type: 'TEXT', required: true },
          { id: 'nb_lactation', label: 'Lactancia Materna', type: 'SELECT', options: ['Exclusiva', 'Mixta', 'Fórmula'], required: true }
      ]
  },
  // 20. PYP Puerperium
  {
      id: 'sec_pyp_puerperium',
      title: 'Atención Puerperio (Post-Parto)',
      fields: [
          MOCK_FIELD_LIBRARY[3], // Sys
          MOCK_FIELD_LIBRARY[4], // Dia
          { id: 'pp_uterus', label: 'Involución Uterina', type: 'TEXT', required: true },
          { id: 'pp_lochia', label: 'Loquios (Características)', type: 'TEXT', required: true },
          { id: 'pp_episiotomy', label: 'Herida Qx / Episiotomía', type: 'TEXT', required: true },
          { id: 'pp_mastitis', label: 'Signos de Mastitis', type: 'SELECT', options: ['NO', 'SI'], required: true }
      ]
  }
];

// --- MOCK TEMPLATES ---
export const MOCK_TEMPLATES: RoleTemplate[] = [
  // 1. GENERAL
  {
    id: 't_general',
    name: 'Historia Medicina General',
    description: 'Consulta morbilidad externa.',
    active: true,
    allowedRoles: [UserRole.PROFESSIONAL],
    recordType: RecordType.GENERAL,
    sections: [ MOCK_SECTION_LIBRARY[0], MOCK_SECTION_LIBRARY[1], MOCK_SECTION_LIBRARY[2], MOCK_SECTION_LIBRARY[3] ]
  },
  // 2. NUTRITION
  {
      id: 't_nutrition',
      name: 'Historia Nutrición',
      description: 'Valoración antropométrica y dietaria.',
      active: true,
      allowedRoles: [UserRole.NUTRITIONIST, UserRole.PROFESSIONAL],
      recordType: RecordType.NUTRITION,
      sections: [ MOCK_SECTION_LIBRARY[0], MOCK_SECTION_LIBRARY[10], MOCK_SECTION_LIBRARY[3] ]
  },
  // 3. PSYCHOLOGY
  {
      id: 't_psychology',
      name: 'Consulta Psicológica',
      description: 'Valoración de salud mental.',
      active: true,
      allowedRoles: [UserRole.PSYCHOLOGIST, UserRole.PROFESSIONAL],
      recordType: RecordType.PSYCHOLOGY,
      sections: [ MOCK_SECTION_LIBRARY[0], MOCK_SECTION_LIBRARY[9], MOCK_SECTION_LIBRARY[3] ]
  },
  // 4. PROCEDURES
  {
      id: 't_procedure',
      name: 'Nota de Procedimiento',
      description: 'Registro de procedimientos menores.',
      active: true,
      allowedRoles: [UserRole.PROFESSIONAL],
      recordType: RecordType.PROCEDURE,
      sections: [ MOCK_SECTION_LIBRARY[11] ]
  },
  // --- PYP TEMPLATES ---
  {
      id: 't_pyp_growth',
      name: 'PyP Crecimiento y Desarrollo',
      description: 'Menores de 10 años.',
      active: true,
      allowedRoles: [UserRole.PROFESSIONAL],
      recordType: RecordType.PYP_GROWTH_DEV,
      sections: [ MOCK_SECTION_LIBRARY[0], MOCK_SECTION_LIBRARY[12], MOCK_SECTION_LIBRARY[3] ]
  },
  {
      id: 't_pyp_young',
      name: 'PyP Joven (10-29 años)',
      description: 'Detección temprana alteraciones joven.',
      active: true,
      allowedRoles: [UserRole.PROFESSIONAL],
      recordType: RecordType.PYP_YOUNG,
      sections: [ MOCK_SECTION_LIBRARY[0], MOCK_SECTION_LIBRARY[2], MOCK_SECTION_LIBRARY[13], MOCK_SECTION_LIBRARY[3] ]
  },
  {
      id: 't_pyp_prenatal',
      name: 'PyP Control Prenatal',
      description: 'Seguimiento gestantes.',
      active: true,
      allowedRoles: [UserRole.PROFESSIONAL],
      recordType: RecordType.PYP_PREGNANCY,
      sections: [ MOCK_SECTION_LIBRARY[0], MOCK_SECTION_LIBRARY[2], MOCK_SECTION_LIBRARY[14], MOCK_SECTION_LIBRARY[3] ]
  },
  {
      id: 't_pyp_cv_risk',
      name: 'PyP Riesgo Cardiovascular',
      description: 'Hipertensión y Diabetes. Calculadoras auto.',
      active: true,
      allowedRoles: [UserRole.PROFESSIONAL],
      recordType: RecordType.PYP_CV_RISK,
      sections: [ MOCK_SECTION_LIBRARY[0], MOCK_SECTION_LIBRARY[1], MOCK_SECTION_LIBRARY[15] ]
  },
  {
      id: 't_pyp_visual',
      name: 'PyP Agudeza Visual',
      description: 'Tamizaje salud visual.',
      active: true,
      allowedRoles: [UserRole.PROFESSIONAL],
      recordType: RecordType.PYP_VISUAL,
      sections: [ MOCK_SECTION_LIBRARY[16], MOCK_SECTION_LIBRARY[3] ]
  },
  {
      id: 't_pyp_cancer',
      name: 'PyP Detección Cáncer',
      description: 'Cuello Uterino y Seno.',
      active: true,
      allowedRoles: [UserRole.PROFESSIONAL],
      recordType: RecordType.PYP_CANCER,
      sections: [ MOCK_SECTION_LIBRARY[18], MOCK_SECTION_LIBRARY[3] ]
  },
  {
      id: 't_pyp_family_planning',
      name: 'PyP Planificación Familiar',
      description: 'Hombres y Mujeres.',
      active: true,
      allowedRoles: [UserRole.PROFESSIONAL],
      recordType: RecordType.PYP_FAMILY_PLANNING,
      sections: [ MOCK_SECTION_LIBRARY[0], MOCK_SECTION_LIBRARY[17], MOCK_SECTION_LIBRARY[3] ]
  },
  {
      id: 't_pyp_newborn',
      name: 'PyP Recién Nacido',
      description: 'Atención primeros días.',
      active: true,
      allowedRoles: [UserRole.PROFESSIONAL],
      recordType: RecordType.PYP_NEWBORN,
      sections: [ MOCK_SECTION_LIBRARY[0], MOCK_SECTION_LIBRARY[19], MOCK_SECTION_LIBRARY[3] ]
  },
  {
      id: 't_pyp_puerperium',
      name: 'PyP Puerperio',
      description: 'Control post-parto.',
      active: true,
      allowedRoles: [UserRole.PROFESSIONAL],
      recordType: RecordType.PYP_PUERPERIUM,
      sections: [ MOCK_SECTION_LIBRARY[0], MOCK_SECTION_LIBRARY[20], MOCK_SECTION_LIBRARY[3] ]
  },
  // --- DIAGNOSTIC (NEW LAB TEMPLATES) ---
  {
      id: 't_lab_hemo',
      name: 'Hemograma Completo',
      description: 'Cuadro hemático automatizado (CUPS 902213)',
      active: true,
      allowedRoles: [UserRole.BACTERIOLOGIST],
      recordType: RecordType.LAB_RESULT,
      sections: [ MOCK_SECTION_LIBRARY[4] ] // Use the NEW Detailed Hemo Section
  },
  {
      id: 't_lab_uro',
      name: 'Uroanálisis Completo',
      description: 'Físico, Químico y Sedimento (CUPS 907106)',
      active: true,
      allowedRoles: [UserRole.BACTERIOLOGIST],
      recordType: RecordType.LAB_RESULT,
      sections: [ MOCK_SECTION_LIBRARY[5] ] // Use the NEW Detailed Uro Section
  },
  {
      id: 't_lab_lipid',
      name: 'Perfil Lipídico',
      description: 'Panel de Colesterol y Triglicéridos (CUPS 903825)',
      active: true,
      allowedRoles: [UserRole.BACTERIOLOGIST],
      recordType: RecordType.LAB_RESULT,
      sections: [ MOCK_SECTION_LIBRARY[6] ] // Detailed Lipid Section
  },
  {
      id: 't_lab_glucose',
      name: 'Perfil Metabólico / Glucosa',
      description: 'Glucosa y HbA1c (ADA/OMS)',
      active: true,
      allowedRoles: [UserRole.BACTERIOLOGIST],
      recordType: RecordType.LAB_RESULT,
      sections: [ MOCK_SECTION_LIBRARY[7] ] // Detailed Glucose Section
  },
  {
      id: 't_rad_general',
      name: 'Informe Imagenología General',
      description: 'Rayos X, Ecografía básica.',
      active: true,
      allowedRoles: [UserRole.RADIOLOGIST],
      recordType: RecordType.IMAGING_REPORT,
      sections: [ MOCK_SECTION_LIBRARY[8] ]
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
    insuranceType: 'EPS Sura - Contributivo',
    allergies: 'Penicilina, AINES'
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