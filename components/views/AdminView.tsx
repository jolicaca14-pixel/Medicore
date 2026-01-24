import React, { useState } from 'react';
import { User, UserRole, RoleTemplate, TemplateSection, TemplateField, FieldType, TariffItem, Contract, ContractType, ContractAudit, DisciplinaryAction, PaymentRequest, ClinicalRecord, RecordType, RecordStatus, Patient } from '../../types';
import { MOCK_USERS, MOCK_TEMPLATES, MOCK_SECTION_LIBRARY, MOCK_FIELD_LIBRARY, MOCK_SOAT_TARIFF, SMLDV_2024, MOCK_CONTRACTS, MOCK_SHIFTS, formatCurrency, MOCK_PAYMENT_REQUESTS, MOCK_RECORDS, MOCK_PATIENTS } from '../../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, AreaChart, Area, ComposedChart, PieChart, Pie, Cell, Legend } from 'recharts';
import { 
    Shield, Users, FileText, Settings, Plus, Edit, Trash2, X, Save, 
    Download, CheckCircle, Search, LayoutTemplate, List, AlertCircle, 
    ChevronDown, ChevronRight, Calculator, Type, Hash, Calendar, CheckSquare, AlignLeft, Info,
    Library, Copy, Database, DollarSign, TrendingUp, CreditCard, Briefcase, Clock, File, Lock, AlertTriangle, Paperclip, Activity, Zap, Eye, UploadCloud, Layers, Ban, Printer, Upload, FileJson
} from 'lucide-react';
import { UserForm } from '../UserForm';

interface AdminViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUserSession?: User; // To check access rights
}

// --- ADVANCED CHART DATA GENERATORS ---
const generateFinancialData = (filter: string, isRestricted: boolean) => {
    // Generate Income vs Expense data
    // If restricted (Professional view), income is lower and represents only their production
    const multiplier = isRestricted ? 0.3 : 1; 
    
    const dataPoints = filter === 'YEAR' ? 12 : (filter === 'QUARTER' ? 3 : 7);
    const labels = filter === 'YEAR' ? ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'] :
                   filter === 'QUARTER' ? ['M1', 'M2', 'M3'] : ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
    
    return labels.slice(0, dataPoints).map(label => {
        const income = Math.round((Math.random() * 8000000 + 12000000) * multiplier);
        const expense = Math.round(income * (0.4 + Math.random() * 0.2));
        return {
            name: label,
            income,
            expense,
            profit: income - expense
        };
    });
};

const generateServiceDistribution = () => [
    { name: 'Consulta General', value: 45, color: '#0ea5e9' },
    { name: 'Especialista', value: 25, color: '#6366f1' },
    { name: 'Laboratorio', value: 20, color: '#10b981' },
    { name: 'Procedimientos', value: 10, color: '#f59e0b' },
];

const roleLabels: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'Administrador',
    [UserRole.PROFESSIONAL]: 'Profesional Salud',
    [UserRole.BACTERIOLOGIST]: 'Bacteriólogo (Lab)',
    [UserRole.RADIOLOGIST]: 'Radiólogo (Img)',
    [UserRole.SECRETARY]: 'Secretaria / Admisiones',
    [UserRole.PSYCHOLOGIST]: 'Psicólogo',
    [UserRole.NUTRITIONIST]: 'Nutricionista',
    [UserRole.ACCOUNTANT]: 'Contador',
    [UserRole.TREASURER]: 'Tesorero',
    [UserRole.HR_MANAGER]: 'RRHH',
    [UserRole.CONTRACT_ASSISTANT]: 'Auxiliar Cont.',
    [UserRole.MANAGER]: 'Gerente'
};

export const AdminView: React.FC<AdminViewProps> = ({ activeTab, setActiveTab, currentUserSession }) => {
  const roles = currentUserSession?.roles || [];
  const isAdmin = roles.includes(UserRole.ADMIN);
  const isAccountant = roles.includes(UserRole.ACCOUNTANT);
  const isTreasurer = roles.includes(UserRole.TREASURER);
  const isHR = roles.includes(UserRole.HR_MANAGER);
  const isAssistant = roles.includes(UserRole.CONTRACT_ASSISTANT);
  const isManager = roles.includes(UserRole.MANAGER);

  // --- STATE MANAGEMENT ---
  
  // Users
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});

  // Financial / Tariffs
  const [tariffs, setTariffs] = useState<TariffItem[]>(MOCK_SOAT_TARIFF);
  const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);
  const [currentTariff, setCurrentTariff] = useState<Partial<TariffItem>>({});
  const [finTimeFilter, setFinTimeFilter] = useState('MONTH');
  const [finCatFilter, setFinCatFilter] = useState('ALL');

  // HR / Contracts
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [selectedHRUser, setSelectedHRUser] = useState<User | null>(null);
  const [newContract, setNewContract] = useState<Partial<Contract>>({ type: ContractType.NOMINA, isActive: true, status: 'ACTIVE' });
  const [contractTab, setContractTab] = useState<'GENERAL' | 'AUDIT' | 'DISCIPLINARY' | 'PAYMENTS'>('GENERAL');
  
  // Payments
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(MOCK_PAYMENT_REQUESTS);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentReq, setSelectedPaymentReq] = useState<PaymentRequest | null>(null);
  const [paymentReceiptFile, setPaymentReceiptFile] = useState<string | null>(null); // Mock file path/name

  // Disciplinary
  const [newDisciplinary, setNewDisciplinary] = useState<Partial<DisciplinaryAction>>({ type: 'COMPLAINT', status: 'OPEN' });

  // File Management
  const [fileManagementTab, setFileManagementTab] = useState<'CONTRACTS' | 'PAYMENTS'>('CONTRACTS');

  // Settings / Templates
  const [settingsTab, setSettingsTab] = useState<'TEMPLATES' | 'SECTIONS' | 'FIELDS'>('TEMPLATES');
  const [globalFields, setGlobalFields] = useState<TemplateField[]>(MOCK_FIELD_LIBRARY);
  const [globalSections, setGlobalSections] = useState<TemplateSection[]>(MOCK_SECTION_LIBRARY);
  const [templates, setTemplates] = useState<RoleTemplate[]>(MOCK_TEMPLATES);

  // RIPS STATE
  const [ripsStartDate, setRipsStartDate] = useState(new Date().toISOString().split('T')[0].substring(0, 8) + '01');
  const [ripsEndDate, setRipsEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [generatedRips, setGeneratedRips] = useState<{
      US: any[], AC: any[], AP: any[], AF: any[]
  } | null>(null);

  // --- USER HANDLERS ---
  const handleEditUser = (user: User) => { 
      setCurrentUser({ ...user }); 
  };
  
  const handleAddNewUser = () => { 
      setCurrentUser({ id: `u${Date.now()}`, roles: [UserRole.PROFESSIONAL], status: 'ACTIVE', name: '', username: '' }); 
  };

  const handleSaveUser = (userToSave: Partial<User>) => {
    // Auto-compute Full Name
    const fullName = `${userToSave.firstName} ${userToSave.lastName}`;
    const finalUser = { ...userToSave, name: fullName } as User;

    if (users.some(u => u.id === finalUser.id)) {
        setUsers(prev => prev.map(u => u.id === finalUser.id ? finalUser : u));
    } else {
        setUsers(prev => [...prev, finalUser]);
    }
    setCurrentUser({}); // Reset form
  };

  // --- HR HANDLERS ---
  const handleOpenContracts = (user: User) => {
      setSelectedHRUser(user);
      setIsContractModalOpen(true);
      setNewContract({ type: ContractType.NOMINA, isActive: true, userId: user.id, status: 'ACTIVE', auditTrail: [] });
      setContractTab('GENERAL');
  };

  const handleEditContract = (contract: Contract) => {
      setNewContract({ ...contract });
  };

  const handleSaveContract = () => {
      if(!selectedHRUser) return;
      const isEdit = selectedHRUser.contracts?.some(c => c.id === newContract.id);
      const timestamp = new Date().toISOString();
      const adminName = currentUserSession?.name || "Admin"; 
      
      let updatedContract = { ...newContract } as Contract;

      if (isEdit) {
          const auditEntry: ContractAudit = {
              date: timestamp,
              action: 'UPDATED',
              changedBy: adminName,
              details: 'Edición de contrato por administrador',
              snapshot: JSON.stringify(newContract)
          };
          updatedContract.auditTrail = [...(updatedContract.auditTrail || []), auditEntry];
      } else {
          updatedContract.id = `c${Date.now()}`;
          updatedContract.startDate = updatedContract.startDate || new Date().toISOString().split('T')[0];
          updatedContract.auditTrail = [{ date: timestamp, action: 'CREATED', changedBy: adminName, details: 'Creación Inicial' }];
      }

      if (!updatedContract.fileUrl) {
          updatedContract.fileUrl = `contrato_${updatedContract.type.toLowerCase()}_${Date.now()}.pdf`;
      }

      let updatedContracts = selectedHRUser.contracts || [];
      if (isEdit) {
          updatedContracts = updatedContracts.map(c => c.id === updatedContract.id ? updatedContract : c);
      } else {
          updatedContracts = [...updatedContracts, updatedContract];
      }
      
      const updatedUser = { ...selectedHRUser, contracts: updatedContracts };
      
      // Update Users State Deeply
      setUsers(prev => prev.map(u => u.id === selectedHRUser.id ? updatedUser : u));
      setSelectedHRUser(updatedUser); // Update local ref
      
      setNewContract({ type: ContractType.NOMINA, isActive: true, userId: selectedHRUser.id, status: 'ACTIVE', auditTrail: [] }); // Reset
      alert("Contrato guardado con historial de auditoría.");
  };

  const handleSaveDisciplinary = () => {
      if(!selectedHRUser) return;
      if(!newDisciplinary.title || !newDisciplinary.description) return alert("Complete título y descripción");

      const action: DisciplinaryAction = {
          id: `disc-${Date.now()}`,
          userId: selectedHRUser.id,
          date: new Date().toISOString(),
          documents: [], // Mock docs
          response: '',
          ...newDisciplinary
      } as DisciplinaryAction;

      const updatedUser = { ...selectedHRUser, disciplinaryHistory: [...(selectedHRUser.disciplinaryHistory || []), action] };
      
      // Update Users State Deeply
      setUsers(prev => prev.map(u => u.id === selectedHRUser.id ? updatedUser : u));
      setSelectedHRUser(updatedUser);
      
      setNewDisciplinary({ type: 'COMPLAINT', status: 'OPEN' });
      alert("Caso registrado. El empleado podrá ver esto y responder.");
  };

  const handleOpenPaymentModal = (req: PaymentRequest) => {
      setSelectedPaymentReq(req);
      setPaymentReceiptFile(null);
      setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = () => {
      if(!selectedPaymentReq) return;
      if(!paymentReceiptFile) return alert("Debe cargar el desprendible de pago.");

      setPaymentRequests(prev => prev.map(req => req.id === selectedPaymentReq.id ? { ...req, status: 'PAID', paymentReceiptUrl: paymentReceiptFile } : req));
      setIsPaymentModalOpen(false);
      alert(`Pago registrado exitosamente para ${selectedPaymentReq.userName}.`);
  };

  const handleRejectPayment = (reqId: string) => {
      if(window.confirm("¿Está seguro de RECHAZAR esta cuenta de cobro?")) {
          setPaymentRequests(prev => prev.map(req => req.id === reqId ? { ...req, status: 'REJECTED' } : req));
      }
  };

    // --- FILE MANAGEMENT HANDLERS ---
  const handleUploadFile = () => {
    const fileName = prompt("Ingrese el nombre del archivo (ej. nuevo_contrato.pdf):");
    if (!fileName) return;

    if (fileManagementTab === 'CONTRACTS') {
        setUsers(prevUsers => {
            const newUsers = [...prevUsers];
            if (newUsers.length > 0) {
                const newContract: Contract = {
                    id: `c${Date.now()}`,
                    userId: newUsers[0].id,
                    type: ContractType.OPS,
                    startDate: new Date().toISOString().split('T')[0],
                    isActive: true,
                    status: 'ACTIVE',
                    fileUrl: fileName,
                    auditTrail: [{ date: new Date().toISOString(), action: 'CREATED', changedBy: 'Admin', details: 'Archivo subido' }]
                };
                newUsers[0].contracts = [...(newUsers[0].contracts || []), newContract];
            }
            return newUsers;
        });
        alert(`Contrato "${fileName}" agregado al primer usuario.`);
    } else { // PAYMENTS
        const newPaymentRequest: PaymentRequest = {
            id: `pr${Date.now()}`,
            userId: 'u1',
            userName: 'Elena Rodriguez',
            period: '2024-08',
            amount: Math.floor(Math.random() * 1000000) + 2000000,
            status: 'PAID',
            dateSubmitted: new Date().toISOString(),
            attachments: [],
            paymentReceiptUrl: fileName,
        };
        setPaymentRequests(prev => [...prev, newPaymentRequest]);
        alert(`Soporte de pago "${fileName}" agregado.`);
    }
  };

  const handleDeleteFile = (fileId: string, type: 'CONTRACT' | 'PAYMENT') => {
      if (!window.confirm("¿Está seguro de eliminar este archivo?")) return;

      if (type === 'CONTRACT') {
          setUsers(prevUsers =>
              prevUsers.map(user => ({
                  ...user,
                  contracts: user.contracts?.filter(c => c.id !== fileId)
              }))
          );
      } else { // PAYMENT
          setPaymentRequests(prev => prev.filter(p => p.id !== fileId));
      }
      alert("Archivo eliminado.");
  };

  // --- RIPS GENERATION LOGIC ---
  const generateRIPS = () => {
      // 1. Filter Records by Date and Status
      const filteredRecords = MOCK_RECORDS.filter(r => {
          const d = r.dateCreated.split('T')[0];
          return d >= ripsStartDate && d <= ripsEndDate && r.status === RecordStatus.FINALIZED;
      });

      if (filteredRecords.length === 0) {
          alert("No se encontraron registros finalizados en el rango de fechas seleccionado.");
          setGeneratedRips(null);
          return;
      }

      // 2. Generate US (Usuarios)
      const uniquePatientIds = Array.from(new Set(filteredRecords.map(r => r.patientId)));
      const usFile = uniquePatientIds.map(pid => {
          const p = MOCK_PATIENTS.find(pt => pt.id === pid);
          if (!p) return null;
          return {
              tipo_documento: 'CC', // Mock
              numero_documento: p.identification,
              codigo_admin: 'EPS001',
              tipo_usuario: '1', // Contributivo
              apellido_1: p.fullName.split(' ')[1] || 'Unknown',
              apellido_2: '',
              nombre_1: p.fullName.split(' ')[0],
              nombre_2: '',
              edad: new Date().getFullYear() - new Date(p.birthDate).getFullYear(),
              unidad_medida_edad: '1',
              sexo: p.gender,
              depto: '11', // Bogota
              municipio: '001',
              zona: 'U'
          };
      }).filter(Boolean);

      // 3. Generate AC (Consultas)
      const acFile = filteredRecords
          .filter(r => [RecordType.GENERAL, RecordType.PSYCHOLOGY, RecordType.NUTRITION, RecordType.PYP_CV_RISK, RecordType.PYP_GROWTH_DEV, RecordType.PYP_PREGNANCY].includes(r.recordType))
          .map(r => ({
              numero_factura: `FAC-${r.id}`, // Mock Link
              codigo_prestador: '1100100001',
              tipo_documento: 'CC',
              numero_documento: MOCK_PATIENTS.find(p => p.id === r.patientId)?.identification,
              fecha_consulta: r.dateCreated.split('T')[0].split('-').reverse().join('/'),
              numero_autorizacion: 'AUT-000',
              codigo_consulta: r.recordType === RecordType.PSYCHOLOGY ? '890208' : '890201',
              finalidad: '10', // Tratamiento
              causa_externa: '13', // Enfermedad general
              dx_principal: r.diagnoses?.[0]?.code || 'Z000',
              dx_relacionado_1: r.diagnoses?.[1]?.code || '',
              dx_relacionado_2: '',
              dx_relacionado_3: '',
              tipo_dx_principal: '1', // Impresion diagnostica
              valor_consulta: 45000,
              valor_cuota_moderadora: 4500,
              valor_neto: 40500
          }));

      // 4. Generate AP (Procedimientos) - From 'performedProcedures' or Lab/Imaging Records
      let apFile: any[] = [];
      
      // 4a. Procedures embedded in records
      filteredRecords.forEach(r => {
          if (r.performedProcedures && r.performedProcedures.length > 0) {
              r.performedProcedures.forEach(proc => {
                  apFile.push({
                      numero_factura: `FAC-${r.id}`,
                      codigo_prestador: '1100100001',
                      tipo_documento: 'CC',
                      numero_documento: MOCK_PATIENTS.find(p => p.id === r.patientId)?.identification,
                      fecha_procedimiento: r.dateCreated.split('T')[0].split('-').reverse().join('/'),
                      numero_autorizacion: 'AUT-000',
                      codigo_procedimiento: proc.code,
                      ambito: '1', // Ambulatorio
                      finalidad: '1', // Diagnostico
                      personal_atiende: '1', // Especialista
                      dx_principal: r.diagnoses?.[0]?.code || 'Z000',
                      dx_relacionado: '',
                      complicacion: '',
                      acto_qx: '1', // Unico
                      valor: 25000 // Mock value
                  });
              });
          }
          // 4b. Pure Diagnostic Records (Lab/Img)
          if (r.recordType === RecordType.LAB_RESULT || r.recordType === RecordType.IMAGING_REPORT) {
               // Determine CUPS based on type (Mock logic)
               const cups = r.recordType === RecordType.LAB_RESULT ? '902213' : '871020';
               apFile.push({
                  numero_factura: `FAC-${r.id}`,
                  codigo_prestador: '1100100001',
                  tipo_documento: 'CC',
                  numero_documento: MOCK_PATIENTS.find(p => p.id === r.patientId)?.identification,
                  fecha_procedimiento: r.dateCreated.split('T')[0].split('-').reverse().join('/'),
                  numero_autorizacion: 'AUT-000',
                  codigo_procedimiento: cups,
                  ambito: '1',
                  finalidad: '1',
                  personal_atiende: '4', // Bacteriologo/Otros
                  dx_principal: '',
                  dx_relacionado: '',
                  complicacion: '',
                  acto_qx: '1',
                  valor: 35000
              });
          }
      });

      // 5. Generate AF (Transacciones/Facturas)
      const afFile = filteredRecords.map(r => ({
          codigo_prestador: '1100100001',
          razon_social: 'MEDICORE IPS SAS',
          tipo_id: 'NI',
          numero_id: '900123456',
          numero_factura: `FAC-${r.id}`,
          fecha_expedicion: r.dateCreated.split('T')[0].split('-').reverse().join('/'),
          fecha_inicio: r.dateCreated.split('T')[0].split('-').reverse().join('/'),
          fecha_final: r.dateCreated.split('T')[0].split('-').reverse().join('/'),
          codigo_entidad: 'EPS001',
          nombre_entidad: 'EPS SANITAS',
          numero_contrato: 'CONT-2024',
          plan_beneficios: 'PBS',
          numero_poliza: '',
          valor_copago: 4500,
          valor_comision: 0,
          valor_descuentos: 0,
          valor_neto: 40500
      }));

      setGeneratedRips({ US: usFile, AC: acFile, AP: apFile, AF: afFile });
  };

  const downloadRIPS = () => {
      alert("Descargando paquete .ZIP con archivos TXT/JSON validados...");
  };

  // --- RENDER LOGIC ---

  // 0. ACCESS CONTROL CHECK
  const hasAccess = isAdmin || isManager ||
    (isAccountant && (activeTab === 'financial_mgmt' || activeTab === 'hr_mgmt' || activeTab === 'admin_dashboard')) ||
    (isTreasurer && (activeTab === 'hr_mgmt' || activeTab === 'files_mgmt' || activeTab === 'admin_dashboard')) ||
    (isHR && (activeTab === 'hr_mgmt' || activeTab === 'users' || activeTab === 'admin_dashboard')) ||
    (isAssistant && (activeTab === 'hr_mgmt' || activeTab === 'files_mgmt' || activeTab === 'admin_dashboard'));

  if (!hasAccess) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Ban size={64} className="mb-4 text-red-400"/>
              <h2 className="text-xl font-bold text-slate-700">Acceso Restringido</h2>
              <p className="text-sm">No tiene permisos suficientes para acceder a este módulo.</p>
          </div>
      );
  }

  // 1. DASHBOARD (Dynamic & Actionable)
  if (activeTab === 'admin_dashboard' && hasAccess) {
      const financialData = generateFinancialData('MONTH', false);
      const serviceData = generateServiceDistribution();

      return (
          <div className="space-y-6 animate-in fade-in duration-500">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                      <div>
                          <p className="text-slate-500 text-sm font-bold uppercase">Pacientes Activos</p>
                          <h3 className="text-3xl font-bold text-slate-800">1,204</h3>
                      </div>
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Users size={24}/></div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                      <div>
                          <p className="text-slate-500 text-sm font-bold uppercase">Recaudo Hoy</p>
                          <h3 className="text-3xl font-bold text-green-600">{formatCurrency(4200000)}</h3>
                      </div>
                      <div className="p-3 bg-green-100 text-green-600 rounded-full"><DollarSign size={24}/></div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                      <div>
                          <p className="text-slate-500 text-sm font-bold uppercase">Historias Cerradas</p>
                          <h3 className="text-3xl font-bold text-slate-800">85%</h3>
                      </div>
                      <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><FileText size={24}/></div>
                  </div>
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                      <div>
                          <p className="text-slate-500 text-sm font-bold uppercase">Alertas Sistema</p>
                          <h3 className="text-3xl font-bold text-red-500">3</h3>
                      </div>
                      <div className="p-3 bg-red-100 text-red-600 rounded-full"><AlertTriangle size={24}/></div>
                  </div>
              </div>

              {/* Advanced Dashboard Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                   {/* Main Financial Chart */}
                   <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
                       <h3 className="font-bold text-slate-800 mb-4 text-lg">Balance Financiero: Ingresos vs Egresos</h3>
                       <ResponsiveContainer width="100%" height="100%">
                           <ComposedChart data={financialData} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                               <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                               <CartesianGrid stroke="#f5f5f5" vertical={false} />
                               <XAxis dataKey="name" axisLine={false} tickLine={false} />
                               <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `$${val/1000000}M`} />
                               <Tooltip formatter={(val: number) => formatCurrency(val)} />
                               <Legend />
                               <Bar dataKey="income" name="Ingresos" barSize={20} fill="url(#colorIncome)" radius={[4, 4, 0, 0]} />
                               <Bar dataKey="expense" name="Egresos" barSize={20} fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                               <Line type="monotone" dataKey="profit" name="Margen Neto" stroke="#10b981" strokeWidth={2} dot={false} />
                           </ComposedChart>
                       </ResponsiveContainer>
                   </div>

                   {/* Service Distribution Chart */}
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
                       <h3 className="font-bold text-slate-800 mb-4 text-lg">Distribución de Facturación</h3>
                       <ResponsiveContainer width="100%" height="100%">
                           <PieChart>
                               <Pie
                                data={serviceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                               >
                                   {serviceData.map((entry, index) => (
                                       <Cell key={`cell-${index}`} fill={entry.color} />
                                   ))}
                               </Pie>
                               <Tooltip />
                               <Legend />
                           </PieChart>
                       </ResponsiveContainer>
                   </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden flex flex-wrap gap-4 items-center justify-between">
                   <div className="relative z-10">
                       <h3 className="text-xl font-bold">Acciones Directas</h3>
                       <p className="text-slate-400 text-sm">Accesos rápidos a módulos frecuentes.</p>
                   </div>
                   <div className="flex gap-4 relative z-10 flex-wrap">
                       <button onClick={() => setActiveTab('users')} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-lg flex items-center transition-colors">
                           <Plus size={18} className="mr-2 text-blue-400"/> Crear Usuario
                       </button>
                       <button onClick={() => setActiveTab('reports')} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-lg flex items-center transition-colors">
                           <TrendingUp size={18} className="mr-2 text-green-400"/> Ver Finanzas
                       </button>
                       <button onClick={() => setActiveTab('hr')} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-lg flex items-center transition-colors">
                           <Briefcase size={18} className="mr-2 text-orange-400"/> Contratos
                       </button>
                       <button onClick={() => setActiveTab('files')} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-lg flex items-center transition-colors">
                           <File size={18} className="mr-2 text-yellow-400"/> Archivos
                       </button>
                   </div>
                   <div className="absolute right-0 top-0 opacity-10"><Zap size={150}/></div>
               </div>
          </div>
      );
  }

  // FILE MANAGEMENT MODULE
  if (activeTab === 'files_mgmt' && hasAccess) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Gestión de Archivos</h2>
            <div className="flex space-x-1 bg-white p-1 rounded-lg border border-slate-200 w-fit">
                <button onClick={() => setFileManagementTab('CONTRACTS')} className={`px-4 py-2 rounded-md text-sm font-bold ${fileManagementTab === 'CONTRACTS' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>
                    Contratos
                </button>
                <button onClick={() => setFileManagementTab('PAYMENTS')} className={`px-4 py-2 rounded-md text-sm font-bold ${fileManagementTab === 'PAYMENTS' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>
                    Soportes de Pago
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-800">
                        {fileManagementTab === 'CONTRACTS' ? 'Archivos de Contratos' : 'Archivos de Soportes de Pago'}
                    </h3>
                    <button onClick={handleUploadFile} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center hover:bg-blue-700">
                        <Upload size={16} className="mr-2"/> Subir Archivo
                    </button>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="p-3">Nombre del Archivo</th>
                            <th className="p-3">Usuario</th>
                            <th className="p-3">Fecha de Subida</th>
                            <th className="p-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {(fileManagementTab === 'CONTRACTS'
                            ? users.flatMap(u => u.contracts?.map(c => ({ ...c, userName: u.name, type: 'CONTRACT' })))
                            : paymentRequests.filter(p => p.paymentReceiptUrl).map(p => ({ ...p, fileUrl: p.paymentReceiptUrl, type: 'PAYMENT' })))
                            .map((file: any) => (
                                <tr key={file.id}>
                                    <td className="p-3 font-medium text-slate-700">{file.fileUrl || `contrato_${file.id}.pdf`}</td>
                                    <td className="p-3">{file.userName}</td>
                                    <td className="p-3 text-slate-500">{new Date(file.startDate || file.dateSubmitted).toLocaleDateString()}</td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => alert('Simulando descarga...')} className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><Download size={14}/></button>
                                        <button onClick={() => handleDeleteFile(file.id, file.type)} className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><Trash2 size={14}/></button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
  }
  // HR MODULE
  if (activeTab === 'hr_mgmt' && hasAccess) {
      return (
          <div className="space-y-6">
              {/* MODALS */}
              {isPaymentModalOpen && selectedPaymentReq && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
                          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                              <DollarSign className="mr-2 text-green-600"/> Registrar Pago Honorarios
                          </h3>
                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                      <p className="text-slate-500 font-bold">Profesional:</p>
                                      <p>{selectedPaymentReq.userName}</p>
                                  </div>
                                  <div>
                                      <p className="text-slate-500 font-bold">Periodo:</p>
                                      <p>{selectedPaymentReq.period}</p>
                                  </div>
                                  <div>
                                      <p className="text-slate-500 font-bold">Valor a Pagar:</p>
                                      <p className="text-lg font-bold text-green-700">{formatCurrency(selectedPaymentReq.amount)}</p>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="mb-6">
                              <label className="block text-sm font-bold text-slate-700 mb-2">Cargar Soporte de Pago / Transferencia</label>
                              <div 
                                  className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
                                  onClick={() => setPaymentReceiptFile("comprobante_pago_123.pdf")}
                              >
                                  {paymentReceiptFile ? (
                                      <div className="text-center">
                                          <CheckCircle size={32} className="text-green-500 mx-auto mb-2"/>
                                          <p className="text-sm font-bold text-slate-800">{paymentReceiptFile}</p>
                                          <p className="text-xs text-slate-500">Click para cambiar</p>
                                      </div>
                                  ) : (
                                      <div className="text-center">
                                          <UploadCloud size={32} className="text-slate-400 mx-auto mb-2"/>
                                          <p className="text-sm font-bold text-slate-600">Click para subir archivo</p>
                                          <p className="text-xs text-slate-400">PDF, JPG, PNG</p>
                                      </div>
                                  )}
                              </div>
                          </div>

                          <div className="flex justify-end gap-2">
                              <button onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium text-sm">Cancelar</button>
                              <button onClick={handleConfirmPayment} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700">
                                  Confirmar Pago
                              </button>
                          </div>
                      </div>
                  </div>
              )}

              {isContractModalOpen && selectedHRUser && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 h-[90vh] overflow-y-auto flex flex-col">
                          <div className="flex justify-between items-center mb-6 border-b pb-4">
                              <div>
                                  <h3 className="text-xl font-bold text-slate-800">Gestión Contractual y Disciplinaria</h3>
                                  <p className="text-sm text-slate-500">{selectedHRUser.name} - {selectedHRUser.documentNumber}</p>
                              </div>
                              <button onClick={() => setIsContractModalOpen(false)}><X size={24}/></button>
                          </div>

                          <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg mb-6 w-fit">
                              <button onClick={() => setContractTab('GENERAL')} className={`px-4 py-2 rounded-md text-sm font-bold ${contractTab === 'GENERAL' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>Contrato Vigente</button>
                              <button onClick={() => setContractTab('AUDIT')} className={`px-4 py-2 rounded-md text-sm font-bold ${contractTab === 'AUDIT' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>Auditoría</button>
                              <button onClick={() => setContractTab('DISCIPLINARY')} className={`px-4 py-2 rounded-md text-sm font-bold ${contractTab === 'DISCIPLINARY' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>Procesos Disciplinarios</button>
                          </div>

                          <div className="flex-1 overflow-y-auto pr-2">
                              {contractTab === 'GENERAL' && (
                                  <div className="space-y-6">
                                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                          <h4 className="font-bold text-blue-800 mb-4 flex items-center"><Briefcase className="mr-2"/> Configuración del Contrato</h4>
                                          <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                  <label className="text-xs font-bold text-slate-500">Tipo de Vinculación</label>
                                                  <select className="w-full border p-2 rounded" value={newContract.type} onChange={e => setNewContract({...newContract, type: e.target.value as ContractType})}>
                                                      <option value={ContractType.NOMINA}>Laboral (Nómina)</option>
                                                      <option value={ContractType.OPS}>Prestación de Servicios (OPS)</option>
                                                  </select>
                                              </div>
                                              <div>
                                                  <label className="text-xs font-bold text-slate-500">Estado</label>
                                                  <select className="w-full border p-2 rounded" value={newContract.isActive ? 'ACTIVO' : 'INACTIVO'} onChange={e => setNewContract({...newContract, isActive: e.target.value === 'ACTIVO'})}>
                                                      <option value="ACTIVO">Activo</option>
                                                      <option value="INACTIVO">Terminado / Inactivo</option>
                                                  </select>
                                              </div>
                                              <div>
                                                  <label className="text-xs font-bold text-slate-500">Fecha Inicio</label>
                                                  <input type="date" className="w-full border p-2 rounded" value={newContract.startDate || ''} onChange={e => setNewContract({...newContract, startDate: e.target.value})} />
                                              </div>
                                              <div>
                                                  <label className="text-xs font-bold text-slate-500">Fecha Fin (Opcional)</label>
                                                  <input type="date" className="w-full border p-2 rounded" value={newContract.endDate || ''} onChange={e => setNewContract({...newContract, endDate: e.target.value})} />
                                              </div>
                                              
                                              {newContract.type === ContractType.NOMINA ? (
                                                  <div className="col-span-2">
                                                      <label className="text-xs font-bold text-slate-500">Salario Básico Mensual</label>
                                                      <input type="number" className="w-full border p-2 rounded font-bold" value={newContract.baseSalary || 0} onChange={e => setNewContract({...newContract, baseSalary: parseFloat(e.target.value)})} />
                                                  </div>
                                              ) : (
                                                  <>
                                                      <div>
                                                          <label className="text-xs font-bold text-slate-500">Método de Pago OPS</label>
                                                          <select className="w-full border p-2 rounded" value={newContract.opsPaymentMethod || 'FIXED_MONTHLY'} onChange={e => setNewContract({...newContract, opsPaymentMethod: e.target.value as any})}>
                                                              <option value="FIXED_MONTHLY">Valor Fijo Mensual</option>
                                                              <option value="PER_PROCEDURE">Por Evento / Procedimiento</option>
                                                              <option value="PER_HOUR">Por Hora</option>
                                                          </select>
                                                      </div>
                                                      <div>
                                                          <label className="text-xs font-bold text-slate-500">Valor Honorarios</label>
                                                          <input type="number" className="w-full border p-2 rounded font-bold" value={newContract.opsValue || 0} onChange={e => setNewContract({...newContract, opsValue: parseFloat(e.target.value)})} />
                                                      </div>
                                                  </>
                                              )}
                                          </div>
                                          <div className="mt-4 flex justify-end">
                                              <button onClick={handleSaveContract} className="bg-blue-600 text-white px-4 py-2 rounded font-bold shadow hover:bg-blue-700">
                                                  Guardar Cambios Contractuales
                                              </button>
                                          </div>
                                      </div>

                                      {/* Existing Contracts List */}
                                      <div>
                                          <h4 className="font-bold text-slate-700 mb-2">Historial de Contratos</h4>
                                          <div className="space-y-2">
                                              {selectedHRUser.contracts?.map(c => (
                                                  <div key={c.id} className={`border p-3 rounded flex justify-between items-center ${c.isActive ? 'border-green-200 bg-green-50' : 'bg-slate-50'}`}>
                                                      <div>
                                                          <p className="font-bold text-sm">{c.type === ContractType.NOMINA ? 'Laboral' : 'OPS'} - {c.isActive ? 'ACTIVO' : 'TERMINADO'}</p>
                                                          <p className="text-xs text-slate-500">{c.startDate} - {c.endDate || 'Indefinido'}</p>
                                                      </div>
                                                      <button onClick={() => handleEditContract(c)} className="text-blue-600 text-xs font-bold hover:underline">Editar</button>
                                                  </div>
                                              ))}
                                              {(!selectedHRUser.contracts || selectedHRUser.contracts.length === 0) && <p className="text-slate-400 italic text-sm">Sin contratos registrados.</p>}
                                          </div>
                                      </div>
                                  </div>
                              )}

                              {contractTab === 'AUDIT' && (
                                  <div className="space-y-4">
                                      <h4 className="font-bold text-slate-700 mb-2 flex items-center"><Activity className="mr-2"/> Auditoría de Cambios</h4>
                                      <div className="border-l-2 border-slate-200 pl-4 space-y-6">
                                          {selectedHRUser.contracts?.flatMap(c => c.auditTrail).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((audit, idx) => (
                                              <div key={idx} className="relative">
                                                  <div className="absolute -left-[21px] top-0 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></div>
                                                  <p className="text-sm font-bold text-slate-800">{audit.action}</p>
                                                  <p className="text-xs text-slate-500">{new Date(audit.date).toLocaleString()} por <span className="font-semibold">{audit.changedBy}</span></p>
                                                  <p className="text-sm text-slate-600 mt-1 bg-slate-50 p-2 rounded border">{audit.details}</p>
                                              </div>
                                          ))}
                                          {(!selectedHRUser.contracts || selectedHRUser.contracts.flatMap(c => c.auditTrail).length === 0) && <p className="text-slate-400 italic">No hay registros de auditoría.</p>}
                                      </div>
                                  </div>
                              )}

                              {contractTab === 'DISCIPLINARY' && (
                                  <div className="space-y-6">
                                      <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                          <h4 className="font-bold text-red-800 mb-4 flex items-center"><AlertTriangle className="mr-2"/> Registrar Nuevo Evento</h4>
                                          <div className="space-y-3">
                                              <div>
                                                  <label className="text-xs font-bold text-slate-500">Tipo de Evento</label>
                                                  <select className="w-full border p-2 rounded" value={newDisciplinary.type} onChange={e => setNewDisciplinary({...newDisciplinary, type: e.target.value as any})}>
                                                      <option value="COMPLAINT">Queja / Reclamo</option>
                                                      <option value="REQUEST">Requerimiento / Solicitud</option>
                                                      <option value="SANCTION">Sanción Disciplinaria</option>
                                                  </select>
                                              </div>
                                              <div>
                                                  <label className="text-xs font-bold text-slate-500">Título / Asunto</label>
                                                  <input className="w-full border p-2 rounded" placeholder="Ej. Retraso reiterado..." value={newDisciplinary.title || ''} onChange={e => setNewDisciplinary({...newDisciplinary, title: e.target.value})} />
                                              </div>
                                              <div>
                                                  <label className="text-xs font-bold text-slate-500">Descripción Detallada</label>
                                                  <textarea className="w-full border p-2 rounded" rows={3} value={newDisciplinary.description || ''} onChange={e => setNewDisciplinary({...newDisciplinary, description: e.target.value})} />
                                              </div>
                                              <button onClick={handleSaveDisciplinary} className="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700">Registrar Evento</button>
                                          </div>
                                      </div>

                                      <div>
                                          <h4 className="font-bold text-slate-700 mb-2">Historial Disciplinario</h4>
                                          <div className="space-y-3">
                                              {selectedHRUser.disciplinaryHistory?.map(d => (
                                                  <div key={d.id} className="border p-3 rounded bg-white hover:shadow-sm">
                                                      <div className="flex justify-between items-start">
                                                          <span className={`text-[10px] font-bold px-2 py-1 rounded ${d.type === 'SANCTION' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{d.type}</span>
                                                          <span className="text-xs text-slate-400">{new Date(d.date).toLocaleDateString()}</span>
                                                      </div>
                                                      <h5 className="font-bold text-sm mt-1">{d.title}</h5>
                                                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{d.description}</p>
                                                      <div className="mt-2 text-xs">
                                                          <span className={`font-bold ${d.status === 'OPEN' ? 'text-green-600' : 'text-slate-500'}`}>Estado: {d.status}</span>
                                                          {d.response && <p className="mt-1 bg-slate-50 p-1 rounded italic text-slate-500">"Descargos recibidos"</p>}
                                                      </div>
                                                  </div>
                                              ))}
                                              {(!selectedHRUser.disciplinaryHistory || selectedHRUser.disciplinaryHistory.length === 0) && <p className="text-slate-400 italic text-sm">Hoja de vida limpia.</p>}
                                          </div>
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              )}

              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-slate-800">Talento Humano</h2>
              </div>

              {/* Sub-Tabs */}
              <div className="flex space-x-1 bg-white p-1 rounded-lg border border-slate-200 w-fit mb-6">
                  <button onClick={() => setContractTab('GENERAL')} className={`px-4 py-2 rounded-md text-sm font-bold ${contractTab === 'GENERAL' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>Directorio</button>
                  <button onClick={() => setContractTab('PAYMENTS')} className={`px-4 py-2 rounded-md text-sm font-bold ${contractTab === 'PAYMENTS' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>Cuentas de Cobro</button>
              </div>

              {contractTab === 'GENERAL' && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                      <h3 className="font-bold text-lg text-slate-800 mb-4">Directorio de Personal</h3>
                      <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-slate-500 font-medium">
                              <tr>
                                  <th className="p-3">Funcionario</th>
                                  <th className="p-3">Rol</th>
                                  <th className="p-3">Contrato Actual</th>
                                  <th className="p-3">Alertas</th>
                                  <th className="p-3 text-right">Gestión</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              {users.map(u => {
                                  const activeContract = u.contracts?.find(c => c.isActive);
                                  const openIssues = u.disciplinaryHistory?.filter(d => d.status === 'OPEN').length || 0;
                                  return (
                                      <tr key={u.id} className="hover:bg-slate-50">
                                          <td className="p-3">
                                              <p className="font-bold text-slate-700">{u.name}</p>
                                              <p className="text-xs text-slate-400">{u.documentNumber}</p>
                                          </td>
                                          <td className="p-3 text-xs">{roleLabels[u.roles[0]]}</td>
                                          <td className="p-3">
                                              {activeContract ? (
                                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                                                      {activeContract.type === ContractType.NOMINA ? 'Laboral' : 'OPS'}
                                                  </span>
                                              ) : <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">Sin contrato</span>}
                                          </td>
                                          <td className="p-3">
                                              {openIssues > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold flex w-fit items-center"><AlertTriangle size={12} className="mr-1"/> {openIssues} Proc.</span>}
                                          </td>
                                          <td className="p-3 text-right">
                                              <button onClick={() => handleOpenContracts(u)} className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-xs font-bold border border-blue-200">
                                                  Administrar
                                              </button>
                                          </td>
                                      </tr>
                                  );
                              })}
                          </tbody>
                      </table>
                  </div>
              )}

              {/* PAYMENT REQUESTS / CUENTAS DE COBRO */}
              {contractTab === 'PAYMENTS' && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                      <h3 className="font-bold text-lg text-slate-800 mb-4">Gestión de Cuentas de Cobro (OPS)</h3>
                      <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                              <thead className="bg-slate-50 text-slate-500 font-medium">
                                  <tr>
                                      <th className="p-3">Profesional</th>
                                      <th className="p-3">Periodo</th>
                                      <th className="p-3">Valor</th>
                                      <th className="p-3">Soportes</th>
                                      <th className="p-3">Estado</th>
                                      <th className="p-3 text-right">Acciones</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  {paymentRequests.map(req => (
                                      <tr key={req.id} className="hover:bg-slate-50">
                                          <td className="p-3 font-bold text-slate-700">{req.userName}</td>
                                          <td className="p-3">{req.period}</td>
                                          <td className="p-3 font-mono text-slate-600">{formatCurrency(req.amount)}</td>
                                          <td className="p-3">
                                              <div className="flex gap-1 items-center">
                                                  {req.attachments.map(att => (
                                                      <span key={att.name} className="p-1 bg-blue-50 text-blue-600 rounded border border-blue-200 cursor-pointer" title={att.name}>
                                                          <FileText size={14}/>
                                                      </span>
                                                  ))}
                                                  {req.paymentReceiptUrl && (
                                                      <span className="p-1 bg-green-50 text-green-600 rounded border border-green-200 cursor-pointer ml-2" title="Desprendible de Pago">
                                                          <CheckCircle size={14}/>
                                                      </span>
                                                  )}
                                              </div>
                                          </td>
                                          <td className="p-3">
                                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                  req.status === 'SUBMITTED' ? 'bg-yellow-100 text-yellow-800' :
                                                  req.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                  req.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-gray-100'
                                              }`}>
                                                  {req.status === 'PAID' ? 'PAGADO' : (req.status === 'SUBMITTED' ? 'PENDIENTE' : req.status)}
                                              </span>
                                          </td>
                                          <td className="p-3 text-right">
                                               {req.status === 'SUBMITTED' && (
                                                  <div className="flex justify-end gap-2">
                                                      <button onClick={() => handleOpenPaymentModal(req)} className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded font-bold text-xs">Pagar</button>
                                                      <button onClick={() => handleRejectPayment(req.id)} className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded font-bold text-xs">Rechazar</button>
                                                  </div>
                                              )}
                                          </td>
                                      </tr>
                                  ))}
                                  {paymentRequests.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-slate-400">No hay cuentas pendientes.</td></tr>}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}
          </div>
      );
  }

  // 4. REPORTS TAB - NEW RIPS GENERATION
  if (activeTab === 'financial_mgmt' && hasAccess) {
      return (
          <div className="space-y-8 animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Reportes y Analítica</h2>
              
              {/* RIPS GENERATOR SECTION */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-6">
                      <div>
                          <h3 className="font-bold text-lg text-slate-800 flex items-center">
                              <FileJson className="mr-2 text-purple-600"/> Generación de RIPS
                          </h3>
                          <p className="text-sm text-slate-500">Generación de Archivos Planos (JSON/TXT) para validación en MinSalud.</p>
                      </div>
                      <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-lg">
                          <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">Fecha Inicio</label>
                              <input type="date" className="border rounded px-2 py-1 text-sm bg-white" value={ripsStartDate} onChange={e => setRipsStartDate(e.target.value)} />
                          </div>
                          <div>
                              <label className="block text-[10px] font-bold text-slate-500 uppercase">Fecha Fin</label>
                              <input type="date" className="border rounded px-2 py-1 text-sm bg-white" value={ripsEndDate} onChange={e => setRipsEndDate(e.target.value)} />
                          </div>
                          <button onClick={generateRIPS} className="h-full bg-purple-600 text-white px-4 py-2 rounded font-bold text-sm shadow hover:bg-purple-700 flex items-center">
                              <Zap size={16} className="mr-2"/> Generar
                          </button>
                      </div>
                  </div>

                  {generatedRips ? (
                      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                          <div className="grid grid-cols-4 gap-4">
                              {Object.entries(generatedRips).map(([key, data]) => (
                                  <div key={key} className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-center">
                                      <h4 className="font-bold text-2xl text-slate-800">{data.length}</h4>
                                      <p className="text-xs text-slate-500 font-bold uppercase">Archivo {key}</p>
                                  </div>
                              ))}
                          </div>
                          
                          <div className="border rounded-lg overflow-hidden">
                               <div className="bg-slate-100 px-4 py-2 border-b">
                                  <span className="font-mono text-xs font-bold text-slate-600">Previsualización (Formato JSON Res. 2275/2023)</span>
                              </div>
                              <div className="bg-slate-900 text-green-400 p-4 font-mono text-xs h-64 overflow-y-auto">
                                  {JSON.stringify(generatedRips, null, 2)}
                              </div>
                          </div>
                      </div>
                  ) : (
                      <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                          <FileJson size={48} className="mx-auto text-slate-300 mb-4"/>
                          <p className="text-sm text-slate-500">Seleccione un rango de fechas y haga clic en "Generar" para crear los reportes.</p>
                      </div>
                  )}
              </div>

              {/* FINANCIAL CHARTS (Existing Logic) */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center">
                      <TrendingUp className="mr-2 text-green-600"/> Indicadores Financieros
                  </h3>
                  {/* Reuse existing chart logic */}
                  <div className="h-80">
                       <ResponsiveContainer width="100%" height="100%">
                           <ComposedChart data={generateFinancialData('MONTH', false)}>
                               <CartesianGrid stroke="#f5f5f5" vertical={false} />
                               <XAxis dataKey="name" />
                               <YAxis tickFormatter={(val) => `$${val/1000000}M`} />
                               <Tooltip formatter={(val: number) => formatCurrency(val)} />
                               <Bar dataKey="income" name="Ingresos" barSize={20} fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                               <Line type="monotone" dataKey="profit" name="Margen Neto" stroke="#10b981" strokeWidth={2} dot={false} />
                           </ComposedChart>
                       </ResponsiveContainer>
                  </div>
              </div>
          </div>
      );
  }

  // 2. USERS LIST - Only Admin
  if (activeTab === 'users' && isAdmin) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full animate-in fade-in duration-500">
            {/* User List Column */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                <h3 className="font-bold text-slate-800 mb-6">Directorio de Usuarios</h3>
                <div className="overflow-x-auto flex-1">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100 sticky top-0">
                            <tr>
                                <th className="py-3 px-4">Nombre Completo</th>
                                <th className="py-3 px-4">Roles</th>
                                <th className="py-3 px-4">Info Profesional</th>
                                <th className="py-3 px-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map(u => (
                                <tr key={u.id} className={`hover:bg-blue-50/50 cursor-pointer ${currentUser.id === u.id ? 'bg-blue-50' : ''}`} onClick={() => handleEditUser(u)}>
                                    <td className="py-3 px-4">
                                        <div className="font-bold text-slate-700">{u.name}</div>
                                        <div className="font-mono text-xs text-slate-400">@{u.username}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            {u.roles?.map(r => <span key={r} className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">{roleLabels[r] || r}</span>)}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        {u.roles.some(r => r === UserRole.PROFESSIONAL || r === UserRole.BACTERIOLOGIST || r === UserRole.RADIOLOGIST) ? (
                                            <div className="text-xs">
                                                <p><span className="font-bold">Lic:</span> {u.professionalLicense || 'N/A'}</p>
                                                {u.digitalStampUrl && <span className="text-[9px] text-green-600 bg-green-50 px-1 rounded">Firma OK</span>}
                                            </div>
                                        ) : <span className="text-xs text-slate-400">-</span>}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button onClick={(e) => { e.stopPropagation(); handleEditUser(u); }} className="p-1 text-slate-400 hover:text-blue-600"><Edit size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Form Column */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800">{currentUser.id ? 'Editando Usuario' : 'Nuevo Usuario'}</h3>
                    <button onClick={handleAddNewUser} className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center"><Plus size={14} className="mr-1"/> Agregar Nuevo</button>
                 </div>
                 <UserForm
                    user={currentUser}
                    onSave={handleSaveUser}
                    onCancel={() => setCurrentUser({})}
                    isEmbedded={true}
                 />
            </div>
        </div>
      );
  }

  // 3. SETTINGS TAB - Only Admin
  if (activeTab === 'settings' && isAdmin) {
      return (
          <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-slate-800">Configuración del Sistema</h2>
              </div>
              
              {/* Settings Nav */}
              <div className="flex space-x-1 bg-white p-1 rounded-lg border border-slate-200 w-fit">
                  <button onClick={() => setSettingsTab('TEMPLATES')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${settingsTab === 'TEMPLATES' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}>
                      Plantillas y Roles
                  </button>
                  <button onClick={() => setSettingsTab('SECTIONS')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${settingsTab === 'SECTIONS' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}>
                      Secciones Clínicas
                  </button>
                  <button onClick={() => setSettingsTab('FIELDS')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${settingsTab === 'FIELDS' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}>
                      Campos y Variables
                  </button>
              </div>

              {/* TEMPLATES MANAGEMENT */}
              {settingsTab === 'TEMPLATES' && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-6">
                          <div>
                              <h3 className="font-bold text-lg text-slate-800">Plantillas de Historia Clínica</h3>
                              <p className="text-sm text-slate-500">Define qué ven los profesionales según su rol.</p>
                          </div>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center hover:bg-blue-700">
                              <Plus size={16} className="mr-2"/> Nueva Plantilla
                          </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {templates.map(t => (
                              <div key={t.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow relative group bg-slate-50/50">
                                  <div className="flex justify-between items-start mb-2">
                                      <div className={`p-2 rounded-lg ${t.active ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                                          <LayoutTemplate size={20}/>
                                      </div>
                                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button className="p-1.5 bg-white border rounded hover:text-blue-600"><Edit size={14}/></button>
                                          <button className="p-1.5 bg-white border rounded hover:text-red-600"><Trash2 size={14}/></button>
                                      </div>
                                  </div>
                                  <h4 className="font-bold text-slate-800">{t.name}</h4>
                                  <p className="text-xs text-slate-500 mb-3">{t.description}</p>
                                  
                                  <div className="space-y-2 mb-4">
                                      <div className="text-xs">
                                          <span className="font-bold text-slate-700 block mb-1">Roles Permitidos:</span>
                                          <div className="flex flex-wrap gap-1">
                                              {t.allowedRoles.map(r => <span key={r} className="bg-white border px-1.5 py-0.5 rounded text-[10px] text-slate-600">{roleLabels[r]}</span>)}
                                          </div>
                                      </div>
                                      <div className="text-xs">
                                          <span className="font-bold text-slate-700 block mb-1">Estructura:</span>
                                          <p className="text-slate-500">{t.sections.length} secciones configuradas.</p>
                                      </div>
                                  </div>
                                  
                                  <div className="flex items-center text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded w-fit">
                                      <Database size={12} className="mr-1"/> Tipo Registro: {t.recordType}
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* SECTIONS MANAGEMENT */}
              {settingsTab === 'SECTIONS' && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                      <div className="flex justify-between items-center mb-6">
                          <div>
                              <h3 className="font-bold text-lg text-slate-800">Biblioteca de Secciones</h3>
                              <p className="text-sm text-slate-500">Bloques reutilizables de información clínica.</p>
                          </div>
                          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center hover:bg-slate-800">
                              <Plus size={16} className="mr-2"/> Nueva Sección
                          </button>
                      </div>
                      <div className="space-y-3">
                          {globalSections.map(sec => (
                              <div key={sec.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 group">
                                  <div className="flex items-center">
                                      <Layers size={20} className="text-slate-400 mr-4"/>
                                      <div>
                                          <h4 className="font-bold text-slate-700 text-sm">{sec.title}</h4>
                                          <p className="text-xs text-slate-500">ID: <span className="font-mono">{sec.id}</span> • {sec.fields.length} campos</p>
                                      </div>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                      <div className="flex -space-x-2">
                                          {sec.fields.slice(0, 4).map(f => (
                                              <div key={f.id} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-600" title={f.label}>
                                                  {f.type.slice(0, 1)}
                                              </div>
                                          ))}
                                          {sec.fields.length > 4 && <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] text-slate-500">+{sec.fields.length - 4}</div>}
                                      </div>
                                      <button className="p-2 text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"><Edit size={16}/></button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              )}

              {/* FIELDS MANAGEMENT */}
              {settingsTab === 'FIELDS' && (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                       <div className="flex justify-between items-center mb-6">
                          <div>
                              <h3 className="font-bold text-lg text-slate-800">Campos Globales y Variables</h3>
                              <p className="text-sm text-slate-500">Definición de tipos de datos, unidades y cálculos automáticos.</p>
                          </div>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center hover:bg-green-700">
                              <Plus size={16} className="mr-2"/> Nuevo Campo
                          </button>
                      </div>
                      <div className="overflow-x-auto">
                          <table className="w-full text-sm text-left">
                              <thead className="bg-slate-50 text-slate-500 font-medium">
                                  <tr>
                                      <th className="p-3">ID Variable</th>
                                      <th className="p-3">Etiqueta (Label)</th>
                                      <th className="p-3">Tipo Dato</th>
                                      <th className="p-3">Unidad</th>
                                      <th className="p-3">Configuración</th>
                                      <th className="p-3 text-right">Acción</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  {globalFields.map(field => (
                                      <tr key={field.id} className="hover:bg-slate-50">
                                          <td className="p-3 font-mono text-xs text-slate-600">{field.id}</td>
                                          <td className="p-3 font-bold text-slate-700">{field.label}</td>
                                          <td className="p-3">
                                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                                  field.type === 'CALCULATED' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                                                  field.type === 'NUMBER' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                                                  'bg-slate-100 text-slate-600 border-slate-200'
                                              }`}>
                                                  {field.type}
                                              </span>
                                          </td>
                                          <td className="p-3 text-slate-500">{field.unit || '-'}</td>
                                          <td className="p-3">
                                              {field.formula ? (
                                                  <div className="flex items-center text-xs text-purple-600" title={field.formula}>
                                                      <Calculator size={12} className="mr-1"/> Fórmula Activa
                                                  </div>
                                              ) : field.required ? (
                                                  <span className="text-xs text-red-500 font-bold">* Obligatorio</span>
                                              ) : <span className="text-xs text-slate-400">Opcional</span>}
                                          </td>
                                          <td className="p-3 text-right">
                                              <button className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><Edit size={14}/></button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}
          </div>
      );
  }

  // Fallback for other tabs not yet implemented in full details (like HR/Reports placeholders)
  return null;
};