import React, { useState } from 'react';
import { User, Patient, RecordStatus, UserRole, ClinicalRecord, RecordType, RoleTemplate } from '../../types';
import { useToast } from '../Toast';
import { MOCK_PATIENTS, MOCK_TEMPLATES, MOCK_RECORDS, MOCK_SECTION_LIBRARY } from '../../constants';
import { TestTube, CheckCircle, Upload, Search, Filter, Clock, Printer, Image, FileText, ChevronRight, Save, Lock, AlertCircle, X } from 'lucide-react';

interface DiagnosticViewProps {
  user: User;
  onLogout: () => void;
}

// Mock Order Interface for the queue
interface Order {
    id: string;
    patientId: string;
    patientName: string;
    examName: string;
    date: string;
    priority: 'HIGH' | 'NORMAL';
    status: 'PENDING' | 'COMPLETED';
    type: 'LAB' | 'IMAGING';
}

export const DiagnosticView: React.FC<DiagnosticViewProps> = ({ user, onLogout }) => {
  const { showToast } = useToast();
  const isLab = user.roles.includes(UserRole.BACTERIOLOGIST);
  const isRad = user.roles.includes(UserRole.RADIOLOGIST);

  const [activeTab, setActiveTab] = useState<'PENDING' | 'HISTORY'>('PENDING');
  
  // Mock Diagnostic Orders
  const [orders, setOrders] = useState<Order[]>([
      { id: 'ord-1', patientId: 'p1', patientName: 'Juan Pérez', examName: 'Hemograma IV [Automatizado]', date: '2023-10-25', priority: 'HIGH', status: 'PENDING', type: 'LAB' },
      { id: 'ord-2', patientId: 'p2', patientName: 'María González', examName: 'Uroanálisis con Sedimento', date: '2023-10-25', priority: 'NORMAL', status: 'PENDING', type: 'LAB' },
      { id: 'ord-3', patientId: 'p2', patientName: 'María González', examName: 'Radiografía de Torax', date: '2023-10-25', priority: 'NORMAL', status: 'PENDING', type: 'IMAGING' },
  ]);

  // Form State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dynamicData, setDynamicData] = useState<Record<string, any>>({});
  const [completedRecords, setCompletedRecords] = useState<ClinicalRecord[]>([]);

  // Filter orders based on user role
  const myOrders = orders.filter(o => 
      (isLab && o.type === 'LAB') || (isRad && o.type === 'IMAGING')
  );

  const getTemplateForExam = (examName: string): RoleTemplate | undefined => {
      // Simple string matching to find the right template
      if (examName.includes('Hemograma')) return MOCK_TEMPLATES.find(t => t.id === 't_lab_hemo');
      if (examName.includes('Uroanálisis')) return MOCK_TEMPLATES.find(t => t.id === 't_lab_uro');
      if (examName.includes('Radiografía') || examName.includes('Ecografía')) return MOCK_TEMPLATES.find(t => t.id === 't_rad_general');
      return undefined;
  };

  const handleSelectOrder = (order: Order) => {
      setSelectedOrder(order);
      setDynamicData({}); // Reset form
  };

  const handleSaveResult = () => {
      if (!selectedOrder) return;
      
      const template = getTemplateForExam(selectedOrder.examName);
      if(!template) return showToast("No hay plantilla configurada para este examen.", "error");

      // Create a "Clinical Record" for this result
      const newRecord: ClinicalRecord = {
          id: `res-${Date.now()}`,
          patientId: selectedOrder.patientId,
          professionalId: user.id,
          professionalName: user.name,
          recordType: template.recordType,
          dateCreated: new Date().toISOString(),
          dateFinalized: new Date().toISOString(),
          status: RecordStatus.FINALIZED,
          chiefComplaint: selectedOrder.examName, // Use chief complaint field to store Exam Name
          historyOfPresentIllness: '',
          antecedents: '',
          dynamicData: dynamicData,
          diagnoses: [], // Lab results usually don't have CIE-11
          plan: '',
          prescriptions: [],
          performedProcedures: [],
          attachments: [], // Images would go here technically or in dynamicData
          clarifyingNotes: []
      };

      setCompletedRecords([...completedRecords, newRecord]);
      
      // Update Order Status
      setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, status: 'COMPLETED' } : o));
      setSelectedOrder(null);
      showToast("Resultado guardado correctamente.", "success");
  };

  // --- RANGE PARSER HELPER ---
  const checkRange = (value: string, placeholder: string) => {
    if (!value || !placeholder) return { isOut: false, label: '' };

    // Try to find numbers in placeholder like "80-100" or "4.5-5.9"
    const rangeMatch = placeholder.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/);
    if (rangeMatch) {
      const min = parseFloat(rangeMatch[1]);
      const max = parseFloat(rangeMatch[2]);
      const val = parseFloat(value);
      if (!isNaN(val)) {
        if (val < min) return { isOut: true, label: 'Bajo' };
        if (val > max) return { isOut: true, label: 'Alto' };
      }
    }
    return { isOut: false, label: '' };
  };

  // --- RENDER FIELD ---
  const renderField = (field: any) => {
      const val = dynamicData[field.id] || '';
      const rangeStatus = field.type === 'NUMBER' ? checkRange(val, field.placeholder || '') : { isOut: false, label: '' };

      return (
          <div key={field.id} className="col-span-1">
              <label htmlFor={field.id} className="block text-xs font-bold text-slate-500 mb-1 flex justify-between">
                  <span>{field.label} {field.unit && <span className="text-slate-400">({field.unit})</span>}</span>
                  {field.placeholder && <span className="text-[10px] text-slate-400 font-normal">Ref: {field.placeholder}</span>}
              </label>
              
              {field.type === 'TEXTAREA' ? (
                  <textarea className="w-full p-2 border rounded text-sm" rows={3} value={val} onChange={e => setDynamicData({...dynamicData, [field.id]: e.target.value})} />
              ) : field.type === 'SELECT' ? (
                  <select className="w-full p-2 border rounded text-sm" value={val} onChange={e => setDynamicData({...dynamicData, [field.id]: e.target.value})}>
                      <option value="">-</option>
                      {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
              ) : field.type === 'FILE' ? (
                  <div className="border-2 border-dashed border-slate-300 rounded p-4 text-center cursor-pointer hover:bg-slate-50">
                      <Upload size={20} className="mx-auto text-slate-400 mb-2"/>
                      <p className="text-xs text-slate-500">Click para cargar imágenes (DICOM/JPG)</p>
                  </div>
              ) : (
                  <div className="relative">
                    <input
                        id={field.id}
                        type={field.type === 'NUMBER' ? 'number' : 'text'}
                        className={`w-full p-2 border rounded text-sm transition-colors ${
                            rangeStatus.isOut ? 'bg-red-50 border-red-300 text-red-900 font-bold' : 'focus:ring-2 focus:ring-blue-500'
                        }`}
                        value={val}
                        placeholder={field.placeholder}
                        onChange={e => setDynamicData({...dynamicData, [field.id]: e.target.value})}
                    />
                    {rangeStatus.isOut && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-red-600 uppercase">
                            {rangeStatus.label}
                        </span>
                    )}
                  </div>
              )}
          </div>
      );
  };

  // --- PRINT VIEW ---
  const handlePrintDate = (patientId: string, date: string) => {
      showToast(`Generando PDF consolidado de resultados para el paciente ${patientId} con fecha ${date}...`, "info");
  };

  // --- RENDER FORM ---
  if (selectedOrder) {
      const template = getTemplateForExam(selectedOrder.examName);

      return (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 h-full flex flex-col">
              <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                  <div>
                      <h3 className="font-bold text-slate-800 text-lg">{selectedOrder.examName}</h3>
                      <p className="text-sm text-slate-500">{selectedOrder.patientName} | {selectedOrder.date}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-200 rounded-full"><X size={20}/></button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                  {!template ? (
                      <div className="text-center text-red-500 p-8">Error: No se encontró plantilla para este examen.</div>
                  ) : (
                      <div className="max-w-3xl mx-auto space-y-6">
                          {template.sections.map(sec => (
                              <div key={sec.id} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                  <h4 className="font-bold text-slate-700 mb-4 border-b pb-2">{sec.title}</h4>
                                  <div className="grid grid-cols-2 gap-6">
                                      {sec.fields.map(f => renderField(f))}
                                  </div>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
              <div className="p-4 border-t bg-slate-50 flex justify-end space-x-3">
                  <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 text-slate-600 font-bold">Cancelar</button>
                  <button onClick={handleSaveResult} className="px-6 py-2 bg-blue-600 text-white rounded font-bold flex items-center shadow-lg hover:bg-blue-700">
                      <Save size={18} className="mr-2"/> Guardar y Finalizar
                  </button>
              </div>
          </div>
      );
  }

  // --- DASHBOARD ---
  return (
    <div className="p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">{isLab ? 'Laboratorio Clínico' : 'Imagenología y Radiología'}</h2>
                <p className="text-slate-500">Gestión de órdenes y carga de resultados</p>
            </div>
            <div className="flex space-x-4">
                <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 flex items-center">
                    <div className="bg-orange-100 p-2 rounded-full mr-3"><Clock size={20} className="text-orange-600"/></div>
                    <div>
                        <p className="text-xs text-slate-500 font-bold">Pendientes</p>
                        <p className="text-xl font-bold text-slate-800">{myOrders.filter(o => o.status === 'PENDING').length}</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
            <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                <div className="flex space-x-2">
                    <button onClick={() => setActiveTab('PENDING')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'PENDING' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>Pendientes</button>
                    <button onClick={() => setActiveTab('HISTORY')} className={`px-4 py-2 rounded-lg text-sm font-bold ${activeTab === 'HISTORY' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>Historial (Por Fecha)</button>
                </div>
            </div>

            {activeTab === 'PENDING' ? (
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b">
                        <tr>
                            <th className="p-4">Paciente</th>
                            <th className="p-4">Examen / Procedimiento</th>
                            <th className="p-4">Fecha Solicitud</th>
                            <th className="p-4">Prioridad</th>
                            <th className="p-4 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {myOrders.filter(o => o.status === 'PENDING').map(order => (
                            <tr key={order.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => handleSelectOrder(order)}>
                                <td className="p-4 font-bold text-slate-700">{order.patientName}</td>
                                <td className="p-4">{order.examName}</td>
                                <td className="p-4">{order.date}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${order.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                                        {order.priority === 'HIGH' ? 'URGENTE' : 'NORMAL'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center ml-auto">
                                        <Upload size={14} className="mr-2"/> Cargar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {myOrders.filter(o => o.status === 'PENDING').length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-400 italic">No hay órdenes pendientes.</td></tr>
                        )}
                    </tbody>
                </table>
            ) : (
                <div className="p-6">
                    {/* GROUPED HISTORY VIEW */}
                    {completedRecords.length === 0 ? (
                        <p className="text-center text-slate-400 italic">No hay resultados guardados en esta sesión.</p>
                    ) : (
                        <div className="space-y-4">
                            {/* Mock Grouping Logic */}
                            {Array.from(new Set(completedRecords.map(r => `${r.patientId}|${r.dateCreated.split('T')[0]}`))).map(groupKey => {
                                const [patId, date] = groupKey.split('|');
                                const recordsInGroup = completedRecords.filter(r => r.patientId === patId && r.dateCreated.startsWith(date));
                                const patientName = MOCK_PATIENTS.find(p => p.id === patId)?.fullName || 'Desconocido';

                                return (
                                    <div key={groupKey} className="border rounded-xl p-4 flex justify-between items-center hover:bg-slate-50">
                                        <div>
                                            <h4 className="font-bold text-slate-800">{patientName}</h4>
                                            <p className="text-sm text-slate-500 flex items-center"><Clock size={14} className="mr-1"/> {date}</p>
                                            <div className="mt-2 flex gap-2">
                                                {recordsInGroup.map(r => (
                                                    <span key={r.id} className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded border border-blue-200">
                                                        {r.chiefComplaint} {/* Stored Exam Name here */}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <button onClick={() => handlePrintDate(patientName, date)} className="flex items-center px-4 py-2 border rounded hover:bg-white text-slate-600 font-bold text-sm">
                                            <Printer size={16} className="mr-2"/> Imprimir Resultados Fecha
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};