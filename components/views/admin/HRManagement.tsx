import React, { useState } from 'react';
import { User, Contract, ContractType, ContractAudit, DisciplinaryAction, PaymentRequest } from '../../../types';
import { MOCK_USERS, MOCK_PAYMENT_REQUESTS, formatCurrency, roleLabels } from '../../../constants';
import { DollarSign, CheckCircle, UploadCloud, Briefcase, Activity, AlertTriangle, X, Printer, FileText, AlertTriangle as AlertTriangleIcon } from 'lucide-react';

interface HRManagementProps {
    currentUserSession?: User;
}

export const HRManagement: React.FC<HRManagementProps> = ({ currentUserSession }) => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [isContractModalOpen, setIsContractModalOpen] = useState(false);
    const [selectedHRUser, setSelectedHRUser] = useState<User | null>(null);
    const [newContract, setNewContract] = useState<Partial<Contract>>({ type: ContractType.NOMINA, isActive: true, status: 'ACTIVE' });
    const [contractTab, setContractTab] = useState<'GENERAL' | 'AUDIT' | 'DISCIPLINARY' | 'PAYMENTS'>('GENERAL');
    const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(MOCK_PAYMENT_REQUESTS);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedPaymentReq, setSelectedPaymentReq] = useState<PaymentRequest | null>(null);
    const [paymentReceiptFile, setPaymentReceiptFile] = useState<string | null>(null);
    const [newDisciplinary, setNewDisciplinary] = useState<Partial<DisciplinaryAction>>({ type: 'COMPLAINT', status: 'OPEN' });

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
        if (!selectedHRUser) return;
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

        setUsers(prev => prev.map(u => u.id === selectedHRUser.id ? updatedUser : u));
        setSelectedHRUser(updatedUser);

        setNewContract({ type: ContractType.NOMINA, isActive: true, userId: selectedHRUser.id, status: 'ACTIVE', auditTrail: [] });
        alert("Contrato guardado con historial de auditoría.");
    };

    const handleSaveDisciplinary = () => {
        if (!selectedHRUser) return;
        if (!newDisciplinary.title || !newDisciplinary.description) return alert("Complete título y descripción");

        const action: DisciplinaryAction = {
            id: `disc-${Date.now()}`,
            userId: selectedHRUser.id,
            date: new Date().toISOString(),
            documents: [],
            response: '',
            ...newDisciplinary
        } as DisciplinaryAction;

        const updatedUser = { ...selectedHRUser, disciplinaryHistory: [...(selectedHRUser.disciplinaryHistory || []), action] };

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
        if (!selectedPaymentReq) return;
        if (!paymentReceiptFile) return alert("Debe cargar el desprendible de pago.");

        setPaymentRequests(prev => prev.map(req => req.id === selectedPaymentReq.id ? { ...req, status: 'PAID', paymentReceiptUrl: paymentReceiptFile } : req));
        setIsPaymentModalOpen(false);
        alert(`Pago registrado exitosamente para ${selectedPaymentReq.userName}.`);
    };

    const handleRejectPayment = (reqId: string) => {
        if (window.confirm("¿Está seguro de RECHAZAR esta cuenta de cobro?")) {
            setPaymentRequests(prev => prev.map(req => req.id === reqId ? { ...req, status: 'REJECTED' } : req));
        }
    };

    return (
        <div className="space-y-6">
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
                                            {openIssues > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-bold flex w-fit items-center"><AlertTriangleIcon size={12} className="mr-1"/> {openIssues} Proc.</span>}
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
};
