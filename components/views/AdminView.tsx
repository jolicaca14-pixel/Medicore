import React, { useState } from 'react';
import { User, UserRole, RoleTemplate, TemplateSection, TemplateField, FieldType, TariffItem, Contract, ContractType, ContractAudit, DisciplinaryAction, PaymentRequest } from '../../types';
import { MOCK_USERS, MOCK_TEMPLATES, MOCK_SECTION_LIBRARY, MOCK_FIELD_LIBRARY, MOCK_SOAT_TARIFF, SMLDV_2024, MOCK_CONTRACTS, MOCK_SHIFTS, formatCurrency, MOCK_PAYMENT_REQUESTS } from '../../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, AreaChart, Area, ComposedChart, PieChart, Pie, Cell, Legend } from 'recharts';
import { 
    Shield, Users, FileText, Settings, Plus, Edit, Trash2, X, Save, 
    Download, CheckCircle, Search, LayoutTemplate, List, AlertCircle, 
    ChevronDown, ChevronRight, Calculator, Type, Hash, Calendar, CheckSquare, AlignLeft, Info,
    Library, Copy, Database, DollarSign, TrendingUp, CreditCard, Briefcase, Clock, File, Lock, AlertTriangle, Paperclip, Activity, Zap, Eye, UploadCloud, Layers, Ban, Printer, Upload
} from 'lucide-react';

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
    [UserRole.PSYCHOLOGIST]: 'Psicólogo'
};

export const AdminView: React.FC<AdminViewProps> = ({ activeTab, setActiveTab, currentUserSession }) => {
  const isAdmin = currentUserSession?.roles.includes(UserRole.ADMIN);

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

  // Settings / Templates
  const [settingsTab, setSettingsTab] = useState<'TEMPLATES' | 'SECTIONS' | 'FIELDS'>('TEMPLATES');
  const [globalFields, setGlobalFields] = useState<TemplateField[]>(MOCK_FIELD_LIBRARY);
  const [globalSections, setGlobalSections] = useState<TemplateSection[]>(MOCK_SECTION_LIBRARY);
  const [templates, setTemplates] = useState<RoleTemplate[]>(MOCK_TEMPLATES);

  // --- USER HANDLERS ---
  const handleEditUser = (user: User) => { 
      // Create a shallow copy to prevent reference issues during edit
      setCurrentUser({ ...user }); 
      setIsUserModalOpen(true); 
  };
  
  const handleAddNewUser = () => { 
      setCurrentUser({ id: `u${Date.now()}`, roles: [UserRole.PROFESSIONAL], status: 'ACTIVE', name: '', username: '' }); 
      setIsUserModalOpen(true); 
  };

  const handleSaveUser = () => {
    if (!currentUser.firstName || !currentUser.lastName || !currentUser.username || !currentUser.documentNumber) { alert("Complete nombres, apellidos, usuario y documento."); return; }
    
    // Validate Roles
    if (!currentUser.roles || currentUser.roles.length === 0) {
        alert("El usuario debe tener al menos un rol asignado.");
        return;
    }

    // Role Specific Validations
    if (currentUser.roles.some(r => r === UserRole.PROFESSIONAL || r === UserRole.BACTERIOLOGIST || r === UserRole.RADIOLOGIST)) {
        if (!currentUser.professionalLicense) {
            alert("Para roles asistenciales, el Registro Médico/Profesional es obligatorio.");
            return;
        }
    }

    // Auto-compute Full Name
    const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
    const userToSave = { ...currentUser, name: fullName } as User;

    // Use map to return a new array reference
    if (users.some(u => u.id === userToSave.id)) { 
        setUsers(prev => prev.map(u => u.id === userToSave.id ? userToSave : u)); 
    } else { 
        setUsers(prev => [...prev, userToSave]); 
    }
    setIsUserModalOpen(false);
  };

  const toggleUserRole = (role: UserRole) => {
    const currentRoles = currentUser.roles || [];
    const newRoles = currentRoles.includes(role) ? currentRoles.filter(r => r !== role) : [...currentRoles, role];
    setCurrentUser({ ...currentUser, roles: newRoles });
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

  // --- RENDER LOGIC ---

  // 0. ACCESS CONTROL CHECK
  if ((activeTab === 'users' || activeTab === 'settings' || activeTab === 'hr') && !isAdmin) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Ban size={64} className="mb-4 text-red-400"/>
              <h2 className="text-xl font-bold text-slate-700">Acceso Restringido</h2>
              <p className="text-sm">Se requieren permisos de ADMINISTRADOR para acceder a este módulo.</p>
          </div>
      );
  }

  // 1. DASHBOARD (Dynamic & Actionable) - Only for Admins
  if (activeTab === 'dashboard' && isAdmin) {
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
                   </div>
                   <div className="absolute right-0 top-0 opacity-10"><Zap size={150}/></div>
               </div>
          </div>
      );
  }

  // HR MODULE - ADMIN VIEW
  if (activeTab === 'hr' && isAdmin) {
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
                                              {req.status === 'SUBMITTED' ? (
                                                  <div className="flex justify-end gap-2">
                                                      <button onClick={() => alert("Descargando PDF...")} className="p-2 text-slate-500 hover:bg-slate-200 rounded" title="Ver Cuenta de Cobro"><Printer size={16}/></button>
                                                      <button onClick={() => handleOpenPaymentModal(req)} className="p-2 bg-green-100 text-green-600 hover:bg-green-200 rounded font-bold text-xs">Pagar</button>
                                                      <button onClick={() => handleRejectPayment(req.id)} className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded font-bold text-xs">Rechazar</button>
                                                  </div>
                                              ) : (
                                                  <div className="flex justify-end gap-2">
                                                      <button onClick={() => alert("Descargando PDF...")} className="p-2 text-slate-500 hover:bg-slate-200 rounded" title="Ver Documento"><FileText size={16}/></button>
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

  // 2. USERS LIST - Only Admin
  if (activeTab === 'users' && isAdmin) {
      const showProfessionalFields = currentUser.roles?.some(r => r === UserRole.PROFESSIONAL || r === UserRole.BACTERIOLOGIST || r === UserRole.RADIOLOGIST);

      return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {isUserModalOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-bold mb-4">{users.some(u => u.id === currentUser.id) ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="text-xs font-bold text-slate-500">Número de Documento (Cédula) <span className="text-red-500">*</span></label>
                        <input className="w-full p-2 border rounded" placeholder="CC/DNI" value={currentUser.documentNumber || ''} onChange={e => setCurrentUser({...currentUser, documentNumber: e.target.value})} />
                        <p className="text-[10px] text-slate-400 mt-1">Este será la contraseña inicial del usuario.</p>
                    </div>
                    {/* ... (Existing Name/Username fields) ... */}
                    <div className="col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-slate-500">Nombres <span className="text-red-500">*</span></label>
                        <input className="w-full p-2 border rounded" value={currentUser.firstName || ''} onChange={e => setCurrentUser({...currentUser, firstName: e.target.value})} />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-slate-500">Apellidos <span className="text-red-500">*</span></label>
                        <input className="w-full p-2 border rounded" value={currentUser.lastName || ''} onChange={e => setCurrentUser({...currentUser, lastName: e.target.value})} />
                    </div>
                    
                    <div className="col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-slate-500">Usuario (Login) <span className="text-red-500">*</span></label>
                        <input className="w-full p-2 border rounded" value={currentUser.username || ''} onChange={e => setCurrentUser({...currentUser, username: e.target.value})} />
                    </div>
                     <div className="col-span-2 md:col-span-1">
                        <label className="text-xs font-bold text-slate-500">Fecha Nacimiento</label>
                        <input type="date" className="w-full p-2 border rounded" value={currentUser.birthDate || ''} onChange={e => setCurrentUser({...currentUser, birthDate: e.target.value})} />
                    </div>

                    <div className="col-span-2 border-t pt-4">
                        <label className="block text-sm font-semibold mb-3">Roles y Permisos</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Object.values(UserRole).map(role => (
                                <label key={role} className={`flex items-center space-x-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${currentUser.roles?.includes(role) ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}>
                                    <input type="checkbox" checked={currentUser.roles?.includes(role) || false} onChange={() => toggleUserRole(role)} className="hidden" />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold">{roleLabels[role]}</span>
                                        <span className="text-[9px] opacity-75">{role}</span>
                                    </div>
                                    {currentUser.roles?.includes(role) && <CheckCircle size={14} className="ml-auto text-blue-600"/>}
                                </label>
                            ))}
                        </div>
                    </div>

                    {showProfessionalFields && (
                        <div className="col-span-2 border-t pt-4 mt-2 bg-slate-50 p-4 rounded-lg border border-slate-200 animate-in slide-in-from-top-2">
                            <h4 className="font-bold text-sm text-slate-800 mb-2 flex items-center">
                                <Shield size={16} className="mr-2 text-blue-600"/> 
                                Credenciales Asistenciales
                            </h4>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <div>
                                    <label className="text-xs font-bold text-slate-500">Registro Médico / Licencia <span className="text-red-500">*</span></label>
                                    <input className="w-full p-2 border rounded text-sm" placeholder="Ej. MED-12345" value={currentUser.professionalLicense || ''} onChange={e => setCurrentUser({...currentUser, professionalLicense: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500">Especialidad</label>
                                    <input className="w-full p-2 border rounded text-sm" placeholder="Ej. Medicina General" value={currentUser.specialty || ''} onChange={e => setCurrentUser({...currentUser, specialty: e.target.value})} />
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-xs font-bold text-slate-500 mb-1 block">Firma Digital (Imagen) <span className="text-red-500">*</span></label>
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-slate-50 transition-colors relative group">
                                    {currentUser.digitalStampUrl ? (
                                        <>
                                            <div className="text-center">
                                                <p className="text-green-600 font-bold text-sm flex items-center"><CheckCircle size={14} className="mr-1"/> Firma Cargada</p>
                                                <p className="text-xs text-slate-400 mt-1 truncate max-w-xs">{currentUser.digitalStampUrl}</p>
                                            </div>
                                            <button className="absolute top-2 right-2 p-1 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); setCurrentUser({...currentUser, digitalStampUrl: ''}) }}>
                                                <Trash2 size={14}/>
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center" onClick={() => setCurrentUser({...currentUser, digitalStampUrl: 'firma_simulada.png'})}>
                                            <UploadCloud size={32} className="text-slate-300 mb-2 mx-auto"/>
                                            <p className="text-xs font-bold text-slate-500">Click para cargar firma</p>
                                            <p className="text-[10px] text-slate-400">PNG, JPG (Fondo transparente recomendado)</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 text-slate-600">Cancelar</button>
                    <button onClick={handleSaveUser} className="px-4 py-2 bg-slate-900 text-white rounded">Guardar</button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">Directorio de Usuarios</h3>
                <button onClick={handleAddNewUser} className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center"><Plus size={14} className="mr-1"/> Agregar</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="py-3 px-4">Documento</th>
                                <th className="py-3 px-4">Nombre Completo</th>
                                <th className="py-3 px-4">Roles</th>
                                <th className="py-3 px-4">Info Profesional</th>
                                <th className="py-3 px-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50">
                                    <td className="py-3 px-4">
                                        <div className="font-bold text-slate-700">{u.documentNumber}</div>
                                        <div className="font-mono text-xs text-slate-400">@{u.username}</div>
                                    </td>
                                    <td className="py-3 px-4 font-bold text-slate-700">{u.name}</td>
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
                                        <button onClick={() => handleEditUser(u)} className="p-1 text-slate-400 hover:text-blue-600"><Edit size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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