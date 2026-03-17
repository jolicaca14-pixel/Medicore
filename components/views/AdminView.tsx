import React, { useState } from 'react';
import { User, UserRole, RoleTemplate, TemplateSection, TemplateField, TariffItem, Contract, ContractType, ContractAudit, DisciplinaryAction, PaymentRequest, ClinicalRecord, RecordType, RecordStatus, Patient } from '../../types';
import { MOCK_USERS, MOCK_TEMPLATES, MOCK_SECTION_LIBRARY, MOCK_FIELD_LIBRARY, MOCK_SOAT_TARIFF, MOCK_CONTRACTS, formatCurrency, MOCK_PAYMENT_REQUESTS, MOCK_RECORDS, MOCK_PATIENTS } from '../../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend, ComposedChart, Line } from 'recharts';
import { 
    Users, FileText, Settings, Plus, Edit, Trash2, X, Save,
    Download, CheckCircle, Search, LayoutTemplate, AlertCircle,
    Calculator, Database, DollarSign, TrendingUp, Briefcase, File, AlertTriangle, Activity, Zap, Eye, UploadCloud, Layers, Ban, Printer, Upload, FileJson,
    Loader2, HelpCircle
} from 'lucide-react';
import { UserForm } from '../UserForm';
import { hasAdministrativeAccess, maskIdentification } from '../../utils/security';
import { useToast } from '../ToastProvider';

interface AdminViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUserSession?: User;
}

const generateFinancialData = (filter: string) => {
    const labels = filter === 'YEAR' ? ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'] : ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'];
    return labels.map(label => {
        const income = Math.round(Math.random() * 8000000 + 12000000);
        const expense = Math.round(income * (0.4 + Math.random() * 0.2));
        return { name: label, income, expense, profit: income - expense };
    });
};

const serviceDistribution = [
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
    [UserRole.MANAGER]: 'Gerente'
};

export const AdminView: React.FC<AdminViewProps> = ({ activeTab, setActiveTab, currentUserSession }) => {
  const isAdmin = currentUserSession ? hasAdministrativeAccess(currentUserSession.roles) : false;
  const { showToast } = useToast();

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});

  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, title: string, message: string, onConfirm: () => void } | null>(null);

  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [selectedHRUser, setSelectedHRUser] = useState<User | null>(null);
  const [newContract, setNewContract] = useState<Partial<Contract>>({ type: ContractType.NOMINA, isActive: true, status: 'ACTIVE' });
  const [contractTab, setContractTab] = useState<'GENERAL' | 'PAYMENTS'>('GENERAL');
  
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(MOCK_PAYMENT_REQUESTS);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentReq, setSelectedPaymentReq] = useState<PaymentRequest | null>(null);
  const [paymentReceiptFile, setPaymentReceiptFile] = useState<string | null>(null);

  const [fileManagementTab, setFileManagementTab] = useState<'CONTRACTS' | 'PAYMENTS'>('CONTRACTS');
  const [isFileUploadModalOpen, setIsFileUploadModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileSearchTerm, setFileSearchTerm] = useState('');
  const [selectedUserIdForUpload, setSelectedUserIdForUpload] = useState<string | undefined>(MOCK_USERS[0]?.id);

  const [settingsTab, setSettingsTab] = useState<'TEMPLATES' | 'SECTIONS' | 'FIELDS'>('TEMPLATES');
  const [templates, setTemplates] = useState<RoleTemplate[]>(MOCK_TEMPLATES);
  const [globalFields, setGlobalFields] = useState<TemplateField[]>(MOCK_FIELD_LIBRARY);
  const [globalSections, setGlobalSections] = useState<TemplateSection[]>(MOCK_SECTION_LIBRARY);
  const [editingTemplate, setEditingTemplate] = useState<RoleTemplate | null>(null);
  const [editingSection, setEditingSection] = useState<TemplateSection | null>(null);
  const [editingField, setEditingField] = useState<TemplateField | null>(null);

  const [ripsStartDate, setRipsStartDate] = useState(new Date().toISOString().split('T')[0].substring(0, 8) + '01');
  const [ripsEndDate, setRipsEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [generatedRips, setGeneratedRips] = useState<any | null>(null);

  if (!isAdmin) {
      return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Ban size={64} className="mb-4 text-red-400"/>
              <h2 className="text-xl font-bold text-slate-700">Acceso Restringido</h2>
              <p className="text-sm">Se requieren permisos de ADMINISTRADOR para acceder a este módulo.</p>
          </div>
      );
  }

  // --- HANDLERS ---
  const handleEditUser = (user: User) => { setCurrentUser({ ...user }); };
  const handleAddNewUser = () => { setCurrentUser({ id: `u${Date.now()}`, roles: [UserRole.PROFESSIONAL], status: 'ACTIVE', name: '', username: '' }); };
  const handleSaveUser = (userToSave: Partial<User>) => {
    const fullName = `${userToSave.firstName} ${userToSave.lastName}`;
    const finalUser = { ...userToSave, name: fullName } as User;
    setUsers(prev => prev.some(u => u.id === finalUser.id) ? prev.map(u => u.id === finalUser.id ? finalUser : u) : [...prev, finalUser]);
    setCurrentUser({});
    showToast("Usuario guardado con éxito", "success");
  };

  const handleOpenContracts = (user: User) => {
      setSelectedHRUser(user);
      setIsContractModalOpen(true);
      setNewContract({ type: ContractType.NOMINA, isActive: true, userId: user.id, status: 'ACTIVE', auditTrail: [] });
      setContractTab('GENERAL');
  };

  const handleSaveContract = () => {
      if(!selectedHRUser) return;
      const isEdit = selectedHRUser.contracts?.some(c => c.id === newContract.id);
      const adminName = currentUserSession?.name || "Admin"; 
      let updatedContract = { ...newContract } as Contract;
      if (isEdit) {
          updatedContract.auditTrail = [...(updatedContract.auditTrail || []), { date: new Date().toISOString(), action: 'UPDATED', changedBy: adminName, details: 'Edición de contrato' }];
      } else {
          updatedContract.id = `c${Date.now()}`;
          updatedContract.startDate = updatedContract.startDate || new Date().toISOString().split('T')[0];
          updatedContract.auditTrail = [{ date: new Date().toISOString(), action: 'CREATED', changedBy: adminName, details: 'Creación Inicial' }];
      }
      if (!updatedContract.fileUrl) updatedContract.fileUrl = `contrato_${updatedContract.type.toLowerCase()}_${Date.now()}.pdf`;
      let updatedContracts = selectedHRUser.contracts || [];
      updatedContracts = isEdit ? updatedContracts.map(c => c.id === updatedContract.id ? updatedContract : c) : [...updatedContracts, updatedContract];
      const updatedUser = { ...selectedHRUser, contracts: updatedContracts };
      setUsers(prev => prev.map(u => u.id === selectedHRUser.id ? updatedUser : u));
      setSelectedHRUser(updatedUser);
      showToast("Contrato guardado", "success");
  };

  const handleConfirmUpload = () => {
    if (!newFileName) return showToast("Nombre de archivo requerido", "error");
    setUploadProgress(10);
    const interval = setInterval(() => {
        setUploadProgress(p => {
            if (p >= 100) {
                clearInterval(interval);
                if (fileManagementTab === 'CONTRACTS') {
                    setUsers(prev => prev.map(u => u.id === selectedUserIdForUpload ? { ...u, contracts: [...(u.contracts || []), { id: `c${Date.now()}`, userId: u.id, type: ContractType.OPS, startDate: new Date().toISOString().split('T')[0], isActive: true, status: 'ACTIVE', fileUrl: newFileName, auditTrail: [] }] } : u));
                } else {
                    const u = users.find(x => x.id === selectedUserIdForUpload);
                    if (u) setPaymentRequests(prev => [...prev, { id: `pr${Date.now()}`, userId: u.id, userName: u.name, contractId: 'c1', period: '2024-08', amount: 2500000, status: 'PAID', dateSubmitted: new Date().toISOString(), attachments: [], paymentReceiptUrl: newFileName }]);
                }
                showToast("Archivo subido correctamente", "success");
                setIsFileUploadModalOpen(false);
                setUploadProgress(0);
                setNewFileName('');
                return 100;
            }
            return p + 20;
        });
    }, 100);
  };

  const generateRIPS = () => {
      const filtered = MOCK_RECORDS.filter(r => {
          const d = r.dateCreated.split('T')[0];
          return d >= ripsStartDate && d <= ripsEndDate && r.status === RecordStatus.FINALIZED;
      });
      if (filtered.length === 0) return showToast("No se encontraron registros finalizados.", "info");
      
      const usFile = filtered.map(r => {
          const p = MOCK_PATIENTS.find(pt => pt.id === r.patientId);
          return p ? { tipo_documento: 'CC', numero_documento: p.identification, nombre: p.fullName } : null;
      }).filter(Boolean);

      setGeneratedRips({ US: usFile, AC: filtered.length, AP: 2, AF: 2 });
      showToast("RIPS generados con éxito", "success");
  };

  const downloadRIPS = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(generatedRips));
      const a = document.createElement('a');
      a.setAttribute("href", dataStr);
      a.setAttribute("download", `RIPS_${ripsStartDate}_${ripsEndDate}.json`);
      a.click();
  };

  // --- RENDER FUNCTIONS ---
  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div><p className="text-slate-500 text-xs font-bold uppercase">Pacientes Activos</p><h3 className="text-3xl font-bold text-slate-800">1,204</h3></div>
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Users size={24}/></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div><p className="text-slate-500 text-xs font-bold uppercase">Recaudo Hoy</p><h3 className="text-3xl font-bold text-green-600">{formatCurrency(4200000)}</h3></div>
                <div className="p-3 bg-green-100 text-green-600 rounded-full"><DollarSign size={24}/></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div><p className="text-slate-500 text-xs font-bold uppercase">Historias</p><h3 className="text-3xl font-bold text-slate-800">85%</h3></div>
                <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><FileText size={24}/></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                <div><p className="text-slate-500 text-xs font-bold uppercase">Alertas</p><h3 className="text-3xl font-bold text-red-500">3</h3></div>
                <div className="p-3 bg-red-100 text-red-600 rounded-full"><AlertTriangle size={24}/></div>
            </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border h-96">
                <h3 className="font-bold text-slate-800 mb-4">Balance Financiero</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={generateFinancialData('MONTH')}>
                        <CartesianGrid stroke="#f5f5f5" vertical={false}/><XAxis dataKey="name"/><YAxis/><Tooltip/>
                        <Bar dataKey="income" fill="#0ea5e9" radius={[4,4,0,0]}/>
                        <Line dataKey="profit" stroke="#10b981" strokeWidth={2} dot={false}/>
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 rounded-xl border h-96">
                <h3 className="font-bold text-slate-800 mb-4">Distribución</h3>
                <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={serviceDistribution} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80}>{serviceDistribution.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer>
            </div>
        </div>
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg flex flex-wrap gap-4 items-center justify-between relative overflow-hidden">
            <div className="relative z-10"><h3 className="text-xl font-bold">Acciones Directas</h3><p className="text-slate-400 text-sm">Accesos rápidos a módulos frecuentes.</p></div>
            <div className="flex gap-4 relative z-10">
                <button onClick={() => setActiveTab('users')} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-lg flex items-center transition-colors"><Plus size={18} className="mr-2 text-blue-400"/> Crear Usuario</button>
                <button onClick={() => setActiveTab('reports')} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-lg flex items-center transition-colors"><TrendingUp size={18} className="mr-2 text-green-400"/> Ver Finanzas</button>
                <button onClick={() => setActiveTab('files')} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-lg flex items-center transition-colors"><File size={18} className="mr-2 text-yellow-400"/> Gestión Archivos</button>
            </div>
            <div className="absolute right-0 top-0 opacity-10"><Zap size={150}/></div>
        </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div><h2 className="text-2xl font-bold text-slate-800">Espacio de Creación de Usuarios</h2><p className="text-slate-500">Gestione el acceso y roles del personal de la clínica.</p></div>
                <button onClick={handleAddNewUser} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold flex items-center shadow-lg hover:bg-blue-700 transition-all"><Plus size={20} className="mr-2"/> Crear Nuevo Usuario</button>
            </div>
            <div className="max-w-4xl mx-auto bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <UserForm user={currentUser} onSave={handleSaveUser} onCancel={() => setCurrentUser({})} isEmbedded />
            </div>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col">
            <div className="flex justify-between items-center mb-8"><h3 className="text-xl font-bold text-slate-800">Directorio de Usuarios</h3><div className="relative w-96"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input type="text" placeholder="Buscar por nombre, usuario o documento..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl outline-none text-sm" value={userSearchTerm} onChange={e => setUserSearchTerm(e.target.value)}/></div></div>
            <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-sm text-left"><thead className="bg-slate-50 text-slate-500 font-bold border-b"><tr><th className="py-4 px-6">Usuario</th><th className="py-4 px-6">Documento</th><th className="py-4 px-6">Roles</th><th className="py-4 px-6 text-right">Acciones</th></tr></thead>
                <tbody className="divide-y divide-slate-50">
                    {users.filter(u => u.name.toLowerCase().includes(userSearchTerm.toLowerCase())).map(u => (
                        <tr key={u.id} className="hover:bg-blue-50/40 transition-colors">
                            <td className="py-4 px-6"><div className="font-bold text-slate-800">{u.name}</div><div className="text-xs text-slate-400 font-mono">@{u.username}</div></td>
                            <td className="py-4 px-6 font-mono text-slate-600">{maskIdentification(u.documentNumber)}</td>
                            <td className="py-4 px-6"><div className="flex flex-wrap gap-1">{u.roles.map(r => <span key={r} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">{roleLabels[r] || r}</span>)}</div></td>
                            <td className="py-4 px-6 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleEditUser(u)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Edit size={18}/></button><button onClick={() => setConfirmModal({ isOpen: true, title: 'Eliminar Usuario', message: `¿Está seguro de eliminar a ${u.name}? Esta acción no se puede deshacer.`, onConfirm: () => { setUsers(users.filter(x => x.id !== u.id)); setConfirmModal(null); showToast("Usuario eliminado", "info"); } })} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={18}/></button></div></td>
                        </tr>
                    ))}
                </tbody></table>
            </div>
        </div>
    </div>
  );

  const renderFiles = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-800">Gestión de Archivos</h2>
        <div className="flex space-x-1 bg-white p-1 rounded-lg border border-slate-200 w-fit">
            <button onClick={() => setFileManagementTab('CONTRACTS')} className={`px-4 py-2 rounded-md text-sm font-bold ${fileManagementTab === 'CONTRACTS' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>Contratos</button>
            <button onClick={() => setFileManagementTab('PAYMENTS')} className={`px-4 py-2 rounded-md text-sm font-bold ${fileManagementTab === 'PAYMENTS' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>Soportes de Pago</button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
                <div><h3 className="font-bold text-lg text-slate-800">{fileManagementTab === 'CONTRACTS' ? 'Archivos de Contratos' : 'Archivos de Soportes de Pago'}</h3>
                <div className="relative mt-2"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input type="text" placeholder="Buscar..." className="pl-10 pr-4 py-2 border rounded-lg text-sm" value={fileSearchTerm} onChange={e => setFileSearchTerm(e.target.value)}/></div></div>
                <button onClick={() => setIsFileUploadModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center hover:bg-blue-700"><Upload size={16} className="mr-2"/> Subir Archivo</button>
            </div>
            <table className="w-full text-sm text-left"><thead className="bg-slate-50 text-slate-500 font-medium"><tr><th className="p-3">Nombre del Archivo</th><th className="p-3">Usuario</th><th className="p-3 text-right">Acciones</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
                {(fileManagementTab === 'CONTRACTS' ? users.flatMap(u => u.contracts?.map(c => ({ ...c, userName: u.name, type: 'CONTRACT' }))) : paymentRequests.filter(p => p.paymentReceiptUrl).map(p => ({ ...p, fileUrl: p.paymentReceiptUrl, type: 'PAYMENT' })))
                ?.filter((f: any) => f.fileUrl?.toLowerCase().includes(fileSearchTerm.toLowerCase()) || f.userName?.toLowerCase().includes(fileSearchTerm.toLowerCase()))
                .map((f: any) => (
                    <tr key={f.id}><td className="p-3 font-medium text-slate-700">{f.fileUrl}</td><td className="p-3">{f.userName}</td><td className="p-3 text-right"><button onClick={() => setConfirmModal({ isOpen: true, title: 'Eliminar Archivo', message: `¿Seguro que desea eliminar el archivo ${f.fileUrl}?`, onConfirm: () => { if (f.type === 'CONTRACT') { setUsers(prev => prev.map(u => ({ ...u, contracts: u.contracts?.filter(c => c.id !== f.id) }))); } else { setPaymentRequests(prev => prev.filter(p => p.id !== f.id)); } setConfirmModal(null); showToast("Archivo eliminado", "info"); } })} className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><Trash2 size={14}/></button></td></tr>
                ))}
            </tbody></table>
        </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-800">Gestión Financiera</h2>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-6">
                <div><h3 className="font-bold text-lg text-slate-800 flex items-center"><FileJson className="mr-2 text-purple-600"/> Generación de RIPS</h3><p className="text-sm text-slate-500">Archivos Planos para validación ante el Ministerio.</p></div>
                <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-lg">
                    <input type="date" className="border rounded px-2 py-1 text-sm bg-white" value={ripsStartDate} onChange={e => setRipsStartDate(e.target.value)} />
                    <input type="date" className="border rounded px-2 py-1 text-sm bg-white" value={ripsEndDate} onChange={e => setRipsEndDate(e.target.value)} />
                    <button onClick={generateRIPS} className="bg-purple-600 text-white px-4 py-2 rounded font-bold text-sm shadow hover:bg-purple-700 flex items-center"><Zap size={16} className="mr-2"/> Generar</button>
                    {generatedRips && <button onClick={downloadRIPS} className="bg-green-600 text-white px-4 py-2 rounded font-bold text-sm shadow hover:bg-green-700 flex items-center ml-2"><Download size={16} className="mr-2"/> Descargar</button>}
                </div>
            </div>
            {generatedRips && (
                <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4">
                        {['US', 'AC', 'AP', 'AF'].map(k => <div key={k} className="bg-slate-50 p-4 rounded-lg border text-center"><h4 className="font-bold text-2xl">{k === 'US' ? generatedRips.US.length : (k === 'AC' ? generatedRips.AC : 2)}</h4><p className="text-xs text-slate-500 font-bold">ARCHIVO {k}</p></div>)}
                    </div>
                    <div className="bg-slate-900 text-green-400 p-4 font-mono text-xs h-64 overflow-y-auto rounded-lg">{JSON.stringify(generatedRips, null, 2)}</div>
                </div>
            )}
        </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-800">Plantillas y Roles</h2>
        <div className="flex space-x-1 bg-white p-1 rounded-lg border border-slate-200 w-fit">
            <button onClick={() => setSettingsTab('TEMPLATES')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${settingsTab === 'TEMPLATES' ? 'bg-slate-900 text-white shadow' : 'text-slate-500'}`}>Plantillas</button>
            <button onClick={() => setSettingsTab('SECTIONS')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${settingsTab === 'SECTIONS' ? 'bg-slate-900 text-white shadow' : 'text-slate-500'}`}>Secciones</button>
            <button onClick={() => setSettingsTab('FIELDS')} className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${settingsTab === 'FIELDS' ? 'bg-slate-900 text-white shadow' : 'text-slate-500'}`}>Campos</button>
        </div>
        {settingsTab === 'TEMPLATES' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map(t => (
                    <div key={t.id} className="border border-slate-200 rounded-xl p-5 bg-white group hover:shadow-md transition-shadow relative">
                        <div className="flex justify-between items-start mb-2"><div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><LayoutTemplate size={20}/></div><div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => setEditingTemplate(t)} className="p-1.5 bg-white border rounded hover:text-blue-600"><Edit size={14}/></button><button onClick={() => setConfirmModal({ isOpen: true, title: 'Eliminar Plantilla', message: `¿Seguro que desea eliminar la plantilla ${t.name}?`, onConfirm: () => { setTemplates(templates.filter(x => x.id !== t.id)); setConfirmModal(null); showToast("Plantilla eliminada", "info"); } })} className="p-1.5 bg-white border rounded hover:text-red-600"><Trash2 size={14}/></button></div></div>
                        <h4 className="font-bold text-slate-800">{t.name}</h4><p className="text-xs text-slate-500">{t.description}</p>
                    </div>
                ))}
                <button onClick={() => setEditingTemplate({ id: `tpl-${Date.now()}`, name: '', description: '', active: true, allowedRoles: [UserRole.PROFESSIONAL], sections: [], recordType: RecordType.GENERAL })} className="border-2 border-dashed border-slate-300 rounded-xl p-5 text-slate-400 hover:border-slate-400 hover:text-slate-600 flex items-center justify-center font-bold transition-colors"><Plus size={20} className="mr-2"/> Nueva Plantilla</button>
            </div>
        )}
        {settingsTab === 'SECTIONS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {globalSections.map(s => (
                    <div key={s.id} className="border border-slate-200 rounded-xl p-4 bg-white group hover:shadow-md transition-shadow relative">
                        <div className="flex justify-between items-start mb-2"><div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Layers size={18}/></div><div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => setEditingSection(s)} className="p-1 bg-white border rounded hover:text-blue-600"><Edit size={12}/></button><button onClick={() => setConfirmModal({ isOpen: true, title: 'Eliminar Sección', message: `¿Seguro que desea eliminar la sección ${s.title}?`, onConfirm: () => { setGlobalSections(globalSections.filter(x => x.id !== s.id)); setConfirmModal(null); showToast("Sección eliminada", "info"); } })} className="p-1 bg-white border rounded hover:text-red-600"><Trash2 size={12}/></button></div></div>
                        <h4 className="font-bold text-sm text-slate-800">{s.title}</h4><p className="text-[10px] text-slate-400">{s.fields.length} Campos</p>
                    </div>
                ))}
                <button onClick={() => setEditingSection({ id: `sec-${Date.now()}`, title: '', fields: [] })} className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-slate-400 hover:border-slate-400 hover:text-slate-600 flex items-center justify-center font-bold transition-colors text-sm"><Plus size={16} className="mr-1"/> Nueva Sección</button>
            </div>
        )}
        {settingsTab === 'FIELDS' && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {globalFields.map(f => (
                    <div key={f.id} className="border border-slate-200 rounded-xl p-3 bg-white group hover:shadow-md transition-shadow relative">
                        <div className="flex justify-between items-start mb-1"><span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-500 uppercase">{f.type}</span><div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => setEditingField(f)} className="text-blue-600 hover:bg-blue-50 p-0.5 rounded"><Edit size={12}/></button><button onClick={() => setConfirmModal({ isOpen: true, title: 'Eliminar Campo', message: `¿Seguro que desea eliminar el campo ${f.label}?`, onConfirm: () => { setGlobalFields(globalFields.filter(x => x.id !== f.id)); setConfirmModal(null); showToast("Campo eliminado", "info"); } })} className="text-red-600 hover:bg-red-50 p-0.5 rounded"><Trash2 size={12}/></button></div></div>
                        <h4 className="font-bold text-[11px] text-slate-800 truncate">{f.label}</h4>
                    </div>
                ))}
                <button onClick={() => setEditingField({ id: `fld-${Date.now()}`, label: '', type: 'TEXT' })} className="border-2 border-dashed border-slate-300 rounded-xl p-3 text-slate-400 hover:border-slate-400 hover:text-slate-600 flex items-center justify-center font-bold transition-colors text-xs"><Plus size={14} className="mr-1"/> Nuevo Campo</button>
            </div>
        )}
    </div>
  );

  const renderHR = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold text-slate-800">Talento Humano</h2>
        <div className="flex space-x-1 bg-white p-1 rounded-lg border border-slate-200 w-fit mb-6">
            <button onClick={() => setContractTab('GENERAL')} className={`px-4 py-2 rounded-md text-sm font-bold ${contractTab === 'GENERAL' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>Directorio</button>
            <button onClick={() => setContractTab('PAYMENTS')} className={`px-4 py-2 rounded-md text-sm font-bold ${contractTab === 'PAYMENTS' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>Cuentas de Cobro</button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <table className="w-full text-sm text-left"><thead className="bg-slate-50 text-slate-500 font-medium"><tr><th className="p-3">Funcionario</th><th className="p-3">Estado</th><th className="p-3 text-right">Gestión</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50">
                        <td className="p-3"><p className="font-bold text-slate-700">{u.name}</p><p className="text-xs text-slate-400">{u.documentNumber}</p></td>
                        <td className="p-3"><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">ACTIVO</span></td>
                        <td className="p-3 text-right"><button onClick={() => handleOpenContracts(u)} className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-xs font-bold border border-blue-200">Administrar</button></td>
                    </tr>
                ))}
            </tbody></table>
        </div>
    </div>
  );

  return (
    <div className="h-full">
      {confirmModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in duration-200">
                <div className="flex items-center text-orange-600 mb-4"><HelpCircle size={32} className="mr-2"/><h3 className="text-lg font-bold">{confirmModal.title}</h3></div>
                <p className="text-sm text-slate-600 mb-6">{confirmModal.message}</p>
                <div className="flex justify-end gap-3"><button onClick={() => setConfirmModal(null)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg transition-colors">Cancelar</button><button onClick={confirmModal.onConfirm} className="px-5 py-2 bg-red-600 text-white rounded-lg font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-all">Confirmar</button></div>
            </div>
        </div>
      )}
      {editingTemplate && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold mb-4">Editar Plantilla</h3>
              <div className="space-y-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Nombre</label><input className="w-full border p-2 rounded" value={editingTemplate.name} onChange={e => setEditingTemplate({...editingTemplate, name: e.target.value})} /></div>
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Descripción</label><textarea className="w-full border p-2 rounded" value={editingTemplate.description} onChange={e => setEditingTemplate({...editingTemplate, description: e.target.value})} /></div>
              </div>
              <div className="flex justify-end gap-2 mt-6"><button onClick={() => setEditingTemplate(null)} className="px-4 py-2 text-slate-600 font-bold">Cancelar</button><button onClick={() => { setTemplates(prev => prev.some(t => t.id === editingTemplate.id) ? prev.map(t => t.id === editingTemplate.id ? editingTemplate : t) : [...prev, editingTemplate]); setEditingTemplate(null); showToast("Plantilla actualizada", "success"); }} className="px-4 py-2 bg-slate-900 text-white rounded font-bold">Guardar</button></div>
            </div>
          </div>
      )}

      {editingSection && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold mb-4">Editar Sección</h3>
              <div className="space-y-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Título</label><input className="w-full border p-2 rounded" value={editingSection.title} onChange={e => setEditingSection({...editingSection, title: e.target.value})} /></div>
              </div>
              <div className="flex justify-end gap-2 mt-6"><button onClick={() => setEditingSection(null)} className="px-4 py-2 text-slate-600 font-bold">Cancelar</button><button onClick={() => { setGlobalSections(prev => prev.some(s => s.id === editingSection.id) ? prev.map(s => s.id === editingSection.id ? editingSection : s) : [...prev, editingSection]); setEditingSection(null); showToast("Sección actualizada", "success"); }} className="px-4 py-2 bg-slate-900 text-white rounded font-bold">Guardar</button></div>
            </div>
          </div>
      )}

      {editingField && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold mb-4">Editar Campo</h3>
              <div className="space-y-4">
                <div><label className="block text-xs font-bold text-slate-500 mb-1">Etiqueta</label><input className="w-full border p-2 rounded" value={editingField.label} onChange={e => setEditingField({...editingField, label: e.target.value})} /></div>
              </div>
              <div className="flex justify-end gap-2 mt-6"><button onClick={() => setEditingField(null)} className="px-4 py-2 text-slate-600 font-bold">Cancelar</button><button onClick={() => { setGlobalFields(prev => prev.some(f => f.id === editingField.id) ? prev.map(f => f.id === editingField.id ? editingField : f) : [...prev, editingField]); setEditingField(null); showToast("Campo actualizado", "success"); }} className="px-4 py-2 bg-slate-900 text-white rounded font-bold">Guardar</button></div>
            </div>
          </div>
      )}

      {isContractModalOpen && selectedHRUser && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-slate-800">Contratos: {selectedHRUser.name}</h3>
                  <button onClick={() => setIsContractModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              
              <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h4 className="font-bold text-blue-800 mb-3 text-sm uppercase">Nuevo Contrato</h4>
                      <div className="grid grid-cols-2 gap-4">
                          <div><label className="block text-xs font-bold text-slate-500 mb-1">Tipo</label><select className="w-full border p-2 rounded text-sm" value={newContract.type} onChange={e => setNewContract({...newContract, type: e.target.value as ContractType})}><option value={ContractType.NOMINA}>Nómina</option><option value={ContractType.OPS}>OPS / Prestación de Servicios</option></select></div>
                          <div><label className="block text-xs font-bold text-slate-500 mb-1">Salario / Valor</label><input type="number" className="w-full border p-2 rounded text-sm" value={newContract.salary} onChange={e => setNewContract({...newContract, salary: Number(e.target.value)})} /></div>
                      </div>
                      <button onClick={handleSaveContract} className="mt-4 w-full bg-blue-600 text-white py-2 rounded font-bold text-sm shadow hover:bg-blue-700 transition-colors">Vincular Contrato</button>
                  </div>

                  <div>
                      <h4 className="font-bold text-slate-800 mb-3 text-sm uppercase">Historial de Contratos</h4>
                      <div className="space-y-3">
                          {selectedHRUser.contracts?.map(c => (
                              <div key={c.id} className="border p-3 rounded-lg flex justify-between items-center bg-slate-50">
                                  <div>
                                      <p className="font-bold text-slate-700 text-sm">{c.type === ContractType.NOMINA ? 'Contrato Nómina' : 'Contrato OPS'}</p>
                                      <p className="text-xs text-slate-500">Iniciado: {c.startDate} | {formatCurrency(c.salary || 0)}</p>
                                  </div>
                                  <div className="flex gap-2">
                                      <button onClick={() => window.open('/mock-contract.pdf')} className="p-2 text-slate-600 hover:bg-white rounded border border-transparent hover:border-slate-200" title="Descargar"><Download size={16}/></button>
                                      <button
                                        onClick={() => setConfirmModal({
                                            isOpen: true,
                                            title: 'Eliminar Contrato',
                                            message: `¿Está seguro de eliminar este contrato de ${selectedHRUser.name}?`,
                                            onConfirm: () => {
                                                const updatedContracts = selectedHRUser.contracts?.filter(x => x.id !== c.id) || [];
                                                const updatedUser = { ...selectedHRUser, contracts: updatedContracts };
                                                setUsers(prev => prev.map(u => u.id === selectedHRUser.id ? updatedUser : u));
                                                setSelectedHRUser(updatedUser);
                                                setConfirmModal(null);
                                                showToast("Contrato eliminado", "info");
                                            }
                                        })}
                                        className="p-2 text-red-600 hover:bg-white rounded border border-transparent hover:border-red-100"
                                        title="Eliminar"
                                      >
                                          <Trash2 size={16}/>
                                      </button>
                                  </div>
                              </div>
                          ))}
                          {(!selectedHRUser.contracts || selectedHRUser.contracts.length === 0) && <p className="text-center py-4 text-slate-400 text-sm italic">No hay contratos registrados.</p>}
                      </div>
                  </div>
              </div>
            </div>
          </div>
      )}

      {isPaymentModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold mb-4">Cargar Comprobante de Pago</h3>
              <p className="text-sm text-slate-500 mb-4">Seleccione el archivo del comprobante para la cuenta de cobro de {selectedPaymentReq?.userName}.</p>
              <input type="file" className="w-full border p-4 rounded-lg bg-slate-50" onChange={(e) => setPaymentReceiptFile(e.target.files?.[0]?.name || null)} />
              <div className="flex justify-end gap-2 mt-6"><button onClick={() => setIsPaymentModalOpen(false)} className="px-4 py-2 text-slate-600 font-bold">Cancelar</button><button onClick={() => { if(selectedPaymentReq && paymentReceiptFile) { setPaymentRequests(prev => prev.map(r => r.id === selectedPaymentReq.id ? {...r, status: 'PAID', paymentReceiptUrl: paymentReceiptFile} : r)); setIsPaymentModalOpen(false); showToast("Pago registrado exitosamente", "success"); } }} className="px-4 py-2 bg-green-600 text-white rounded font-bold" disabled={!paymentReceiptFile}>Registrar Pago</button></div>
            </div>
          </div>
      )}

      {isFileUploadModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><UploadCloud className="mr-2 text-blue-600"/> Subir Nuevo Archivo</h3>
                <div className="space-y-4">
                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Asociar a Usuario</label><select value={selectedUserIdForUpload} onChange={e => setSelectedUserIdForUpload(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white">{users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select></div>
                    <div><label className="block text-sm font-bold text-slate-700 mb-1">Nombre del Archivo</label><input type="text" value={newFileName} onChange={e => setNewFileName(e.target.value)} placeholder="Ej: contrato_firmado.pdf" className="w-full px-4 py-2 border border-slate-300 rounded-lg" disabled={uploadProgress > 0}/></div>
                    {uploadProgress > 0 && <div className="space-y-2"><p className="text-sm font-bold text-slate-600">Cargando...</p><div className="w-full bg-slate-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${uploadProgress}%` }}></div></div></div>}
                </div>
                <div className="flex justify-end gap-2 mt-6"><button onClick={() => setIsFileUploadModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium text-sm" disabled={uploadProgress > 0}>Cancelar</button><button onClick={handleConfirmUpload} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700" disabled={uploadProgress > 0}>{uploadProgress > 0 ? <Loader2 className="animate-spin" size={18}/> : 'Confirmar Subida'}</button></div>
            </div>
        </div>
      )}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in duration-200">
                <div className="flex items-center text-orange-600 mb-4"><HelpCircle size={32} className="mr-2"/><h3 className="text-lg font-bold">{confirmModal.title}</h3></div>
                <p className="text-sm text-slate-600 mb-6">{confirmModal.message}</p>
                <div className="flex justify-end gap-3"><button onClick={() => setConfirmModal(null)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg transition-colors">Cancelar</button><button onClick={confirmModal.onConfirm} className="px-5 py-2 bg-red-600 text-white rounded-lg font-bold shadow-lg shadow-red-100 hover:bg-red-700 transition-all">Confirmar</button></div>
            </div>
        </div>
      )}
      {(activeTab === 'dashboard' || activeTab === 'admin_dashboard') && renderDashboard()}
      {(activeTab === 'users' || activeTab === 'admin_users') && renderUsers()}
      {(activeTab === 'files' || activeTab === 'admin_files') && renderFiles()}
      {(activeTab === 'hr' || activeTab === 'admin_hr') && renderHR()}
      {(activeTab === 'reports' || activeTab === 'admin_reports') && renderReports()}
      {(activeTab === 'settings' || activeTab === 'admin_settings') && renderSettings()}
    </div>
  );
};
