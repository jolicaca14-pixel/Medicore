import React, { useState, useEffect, useMemo } from 'react';
import { User, Patient, ClinicalRecord, RecordStatus, RecordType, ClarifyingNote, PrescriptionItem, ProcedureItem, ContractType, RoleTemplate, RDAStatus, DiagnosisItem, TemplateField, DisciplinaryAction, PaymentRequest } from '../../types';
import { generateClinicalSummary, suggestICDCodes } from '../../services/geminiService';
import { Plus, Search, FileText, Save, Lock, Bot, Clock, AlertCircle, FilePlus, ChevronRight, Activity, Calculator, Pill, Trash2, Printer, X, Mail, Stethoscope, DollarSign, FileCheck, AlertTriangle, ShieldCheck, Database, Send, ListPlus, Syringe, TestTube, Image, ChevronDown, Layout, ArrowLeftCircle, ArrowRightCircle, History, TrendingUp, Calendar, Briefcase, FileSignature, AlertOctagon, Upload, Paperclip } from 'lucide-react';
import { MOCK_PATIENTS, MOCK_RECORDS, MOCK_CIE11, MOCK_MEDICATIONS, MOCK_SOAT_TARIFF, MOCK_SHIFTS, MOCK_TEMPLATES, MOCK_SECTION_LIBRARY, MOCK_APPOINTMENTS, formatCurrency, MOCK_PAYMENT_REQUESTS } from '../../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ProfessionalViewProps {
  user: User;
  onLogout: () => void;
  activeTab?: string;
}

export const ProfessionalView: React.FC<ProfessionalViewProps> = ({ user, activeTab = 'dashboard' }) => {
  const [patients] = useState<Patient[]>(MOCK_PATIENTS);
  const [records, setRecords] = useState<ClinicalRecord[]>(MOCK_RECORDS);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  
  // UI Modes
  const [viewMode, setViewMode] = useState<'LIST' | 'CREATE' | 'VIEW'>('LIST');
  const [showRDAModal, setShowRDAModal] = useState(false);
  const [activeFormTab, setActiveFormTab] = useState<string>(''); 

  // Form State
  const [currentRecord, setCurrentRecord] = useState<Partial<ClinicalRecord>>({});
  const [selectedTemplate, setSelectedTemplate] = useState<RoleTemplate | null>(null);
  const [dynamicData, setDynamicData] = useState<Record<string, any>>({});
  
  // Security Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authAction, setAuthAction] = useState<'FINALIZE' | 'SIGN_NOTE'>('FINALIZE');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // RCV Logic State
  const [isFirstTimeRCV, setIsFirstTimeRCV] = useState(false);
  
  // Interoperability State
  const [isSendingRDA, setIsSendingRDA] = useState(false);

  // --- HR / TALENT MODULE STATES ---
  const [hrUser, setHrUser] = useState<User>(user); // Local state to update user with descargo
  const [showDescargosModal, setShowDescargosModal] = useState(false);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [descargoText, setDescargoText] = useState('');
  
  // Payment Request (Cuenta de Cobro) States
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(MOCK_PAYMENT_REQUESTS);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [newPayment, setNewPayment] = useState<{ period: string, amount: number, files: string[] }>({ period: '', amount: 0, files: [] });

  // --- SUB-MODULES STATES ---
  const [procSearch, setProcSearch] = useState('');
  const [diagSearch, setDiagSearch] = useState('');
  
  // Custom Procedure State
  const [showCustomProcInput, setShowCustomProcInput] = useState(false);
  const [customProcName, setCustomProcName] = useState('');
  
  // Prescription Form
  const [newRx, setNewRx] = useState<Partial<PrescriptionItem>>({
    medicationName: '', dose: '', frequency: '', route: 'Oral', duration: '', totalQuantity: 1, observations: ''
  });
  
  // History Loaders
  const [showMedHistory, setShowMedHistory] = useState(false);
  const [showProcHistory, setShowProcHistory] = useState(false);

  // Expand State for Result Widget
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null);

  // Set default tab when template/patient changes
  useEffect(() => {
    if (selectedTemplate?.sections?.length) {
        setActiveFormTab(selectedTemplate.sections[0].id);
    }
  }, [selectedTemplate, selectedPatient, viewMode]);

  // Handle Tab Change from Sidebar (e.g. My Production or HR)
  useEffect(() => {
    if (activeTab === 'reports' || activeTab === 'hr') {
        setViewMode('LIST'); // Reset any patient view
        setSelectedPatient(null);
    }
  }, [activeTab]);

  // HR HELPERS
  const handleOpenDescargos = (actionId: string) => {
      const action = hrUser.disciplinaryHistory?.find(a => a.id === actionId);
      if (action) {
          setSelectedActionId(actionId);
          setDescargoText(action.response || '');
          setShowDescargosModal(true);
      }
  };

  const handleSaveDescargos = () => {
      if (!selectedActionId) return;
      
      // Update the disciplinary action with the response
      const updatedHistory = hrUser.disciplinaryHistory?.map(action => 
          action.id === selectedActionId 
          ? { ...action, response: descargoText } 
          : action
      );

      const updatedUser = { ...hrUser, disciplinaryHistory: updatedHistory };
      setHrUser(updatedUser); // Update local view state
      
      // In a real app, this would call an API.
      alert("Sus descargos han sido registrados correctamente en el sistema de Talento Humano.");
      setShowDescargosModal(false);
  };

  // PAYMENT REQUEST HELPERS
  const handleOpenPaymentModal = () => {
      const activeContract = hrUser.contracts?.find(c => c.isActive && c.type === ContractType.OPS);
      if (!activeContract) return alert("Solo disponible para contratos OPS Activos.");
      
      setNewPayment({
          period: new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
          amount: activeContract.opsValue || 0,
          files: []
      });
      setShowPaymentModal(true);
  };

  const handleGeneratePaymentRequest = () => {
      const activeContract = hrUser.contracts?.find(c => c.isActive && c.type === ContractType.OPS);
      if (!activeContract) return;

      const request: PaymentRequest = {
          id: `pay-${Date.now()}`,
          userId: user.id,
          userName: user.name,
          contractId: activeContract.id,
          period: newPayment.period,
          amount: newPayment.amount,
          dateSubmitted: new Date().toISOString(),
          status: 'SUBMITTED',
          attachments: [
              { name: 'Seguridad_Social.pdf', type: 'SOCIAL_SECURITY' },
              { name: 'Informe_Actividades.pdf', type: 'ACTIVITY_REPORT' }
          ]
      };

      setPaymentRequests([request, ...paymentRequests]);
      setShowPaymentModal(false);
      
      // Generate PDF logic (Mock)
      const pdfWindow = window.open('', '_blank');
      if(pdfWindow) {
          pdfWindow.document.write(`
              <html>
              <head><title>Cuenta de Cobro</title></head>
              <body style="font-family: sans-serif; padding: 40px;">
                  <h1 style="text-align: center;">CUENTA DE COBRO</h1>
                  <p><strong>De:</strong> ${user.name}</p>
                  <p><strong>CC:</strong> ${user.documentNumber}</p>
                  <hr/>
                  <p><strong>Periodo:</strong> ${newPayment.period}</p>
                  <p><strong>Valor a Pagar:</strong> ${formatCurrency(newPayment.amount)}</p>
                  <p><strong>Concepto:</strong> Honorarios profesionales según contrato OPS.</p>
                  <br/><br/>
                  <p>Declaro bajo la gravedad de juramento que he realizado los aportes a seguridad social correspondientes.</p>
                  <br/><br/>
                  <p>__________________________</p>
                  <p>Firma Digital</p>
              </body>
              </html>
          `);
          pdfWindow.document.close();
      }

      alert("Cuenta de cobro generada y notificada a Administración.");
  };

  // --- AUTOMATIC CALCULATORS (TFG, FRAMINGHAM, BMI, TAM) ---
  useEffect(() => {
      if (viewMode !== 'CREATE' || !selectedPatient) return;

      const newData = { ...dynamicData };
      let changed = false;

      // 1. BMI (IMC)
      const w = parseFloat(newData['global_weight']);
      const h = parseFloat(newData['global_height']);
      if (w && h) {
          const bmi = (w / (h * h)).toFixed(2);
          if (newData['global_bmi'] !== bmi) { newData['global_bmi'] = bmi; changed = true; }
      }

      // 2. TAM (Mean Arterial Pressure)
      const sys = parseFloat(newData['global_sys_bp']);
      const dia = parseFloat(newData['global_dia_bp']);
      if (sys && dia) {
          const tam = Math.round((2 * dia + sys) / 3).toString();
          if (newData['v_tam'] !== tam) { newData['v_tam'] = tam; changed = true; }
      }

      // 3. TFG (Cockcroft-Gault)
      // (140 - Age) * Weight / (72 * Creatinine) (* 0.85 if female)
      const creat = parseFloat(newData['global_creatinine']);
      if (w && creat) {
          const age = new Date().getFullYear() - new Date(selectedPatient.birthDate).getFullYear();
          let tfg = ((140 - age) * w) / (72 * creat);
          if (selectedPatient.gender === 'F') tfg *= 0.85;
          const tfgStr = tfg.toFixed(1);
          if (newData['calc_tfg'] !== tfgStr) { newData['calc_tfg'] = tfgStr; changed = true; }
      }

      // 4. FRAMINGHAM RISK (Simplified Mock Logic for Demo)
      // Uses: Age, Gender, Smoker, SBP, Total Chol, HDL
      const chol = parseFloat(newData['global_chol_total']);
      const hdl = parseFloat(newData['global_chol_hdl']);
      const smoker = newData['global_smoker'];
      
      if (chol && hdl && sys && smoker) {
          const age = new Date().getFullYear() - new Date(selectedPatient.birthDate).getFullYear();
          // Simplified Scoring (Not clinically accurate, for demo visualization only)
          let points = 0;
          if(age > 40) points += 2; if(age > 60) points += 3;
          if(selectedPatient.gender === 'M') points += 1;
          if(smoker === 'SI') points += 2;
          if(sys > 140) points += 2;
          if(chol > 240) points += 2;
          if(hdl < 40) points += 1;
          
          const risk = points * 1.5; // Mock percentage
          const riskStr = risk > 30 ? '>30' : risk.toFixed(1);
          if (newData['calc_framingham'] !== riskStr) { newData['calc_framingham'] = riskStr; changed = true; }
      }

      if (changed) setDynamicData(newData);

  }, [dynamicData, selectedPatient, viewMode]);

  // --- HELPERS FOR HISTORY ---
  // Bolt ⚡: Memoize top medications to prevent re-calculation on every render.
  // This is a good optimization because the list of records can grow, and this calculation
  // could become expensive. The dependency array [records, user.id] ensures it only
  // re-runs when the underlying data changes.
  const topMedications = useMemo(() => {
      // Aggregate from all records of this professional
      const allMeds = records
          .filter(r => r.professionalId === user.id)
          .flatMap(r => r.prescriptions || [])
          .map(p => p.medicationName);
      
      const freqMap = new Map<string, number>();
      allMeds.forEach(m => freqMap.set(m, (freqMap.get(m) || 0) + 1));
      
      // Return top 5 unique
      return Array.from(freqMap.entries())
          .sort((a,b) => b[1] - a[1])
          .slice(0, 5)
          .map(e => e[0]);
  }, [records, user.id]);

  // Bolt ⚡: Memoize top procedures for the same reason as top medications.
  // It avoids redundant, potentially expensive calculations on each render cycle.
  const topProcedures = useMemo(() => {
       const allProcs = records
          .filter(r => r.professionalId === user.id)
          .flatMap(r => r.performedProcedures || [])
          .map(p => ({ code: p.code, name: p.name }));
       
       const uniqueProcs: {code: string, name: string}[] = [];
       const seen = new Set();
       allProcs.forEach(p => {
           if(!seen.has(p.code)) {
               seen.add(p.code);
               uniqueProcs.push(p);
           }
       });
       return uniqueProcs.slice(0, 5);
  }, [records, user.id]);

  const handleCreateRecord = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewMode('CREATE');
    
    // Check previous records for RCV History
    const prevRCV = records.some(r => r.patientId === patient.id && r.recordType === RecordType.PYP_CV_RISK && r.status === RecordStatus.FINALIZED);
    setIsFirstTimeRCV(!prevRCV); // If no previous record, it is first time

    // Filter templates based on user role
    const allowedTemplates = MOCK_TEMPLATES.filter(t => t.allowedRoles.some(r => user.roles.includes(r)));
    const template = allowedTemplates[0] || MOCK_TEMPLATES[0];
    
    setSelectedTemplate(template);

    // Persist Antecedents
    const lastRecord = records.filter(r => r.patientId === patient.id && r.recordType === RecordType.GENERAL).sort((a,b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())[0];
    const inheritedAntecedents = lastRecord ? lastRecord.antecedents : '';

    setCurrentRecord({
      id: `r${Date.now()}`,
      patientId: patient.id,
      professionalId: user.id,
      professionalName: user.name,
      recordType: template.recordType, // Use template type
      dateCreated: new Date().toISOString(),
      status: RecordStatus.DRAFT,
      rdaStatus: RDAStatus.PENDING,
      chiefComplaint: '',
      historyOfPresentIllness: '',
      antecedents: inheritedAntecedents,
      prescriptions: [],
      performedProcedures: [],
      diagnoses: [], 
      plan: ''
    });
    setDynamicData({});
  };
  
  const changeTemplate = (templateId: string) => {
      const tpl = MOCK_TEMPLATES.find(t => t.id === templateId);
      if (tpl) {
          setSelectedTemplate(tpl);
          setCurrentRecord(prev => ({ ...prev, recordType: tpl.recordType }));
          setDynamicData({}); 
      }
  };

  const handleSaveDraft = () => {
    if (!currentRecord.id) return;
    const recordToSave = { ...currentRecord, dynamicData } as ClinicalRecord;
    setRecords(prev => {
      const existing = prev.findIndex(r => r.id === currentRecord.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = recordToSave;
        return updated;
      }
      return [...prev, recordToSave];
    });
    alert("Borrador guardado exitosamente.");
  };
  
  const generateRDA = (record: ClinicalRecord) => {
      const rda = {
          header: {
              documentId: `RDA-${record.id}`,
              standard: "Res 1888 de 2025 - MinSalud Colombia",
              creationDate: new Date().toISOString(),
              version: "1.0"
          },
          patient: {
              id: selectedPatient?.identification,
              name: selectedPatient?.fullName,
              gender: selectedPatient?.gender
          },
          encounter: {
              id: record.id,
              date: record.dateCreated,
              professional: {
                  name: user.name,
                  license: user.professionalLicense
              },
              institution: "MediCore IPS"
          },
          clinicalContent: {
              diagnoses: record.diagnoses?.map(d => ({ code: d.code, description: d.name, type: d.type })),
              chiefComplaint: record.chiefComplaint,
              plan: record.plan,
              procedures: record.performedProcedures?.map(p => ({ code: p.code, name: p.name })),
              medications: record.prescriptions?.map(m => ({ name: m.medicationName, dose: m.dose }))
          }
      };
      return JSON.stringify(rda, null, 2);
  };

  const initiateAuth = (action: 'FINALIZE' | 'SIGN_NOTE') => {
    if (action === 'FINALIZE') {
        if ((!currentRecord.diagnoses || currentRecord.diagnoses.length === 0) && selectedTemplate?.recordType !== RecordType.PROCEDURE) {
            alert("Es obligatorio seleccionar al menos un diagnóstico CIE-11.");
            setActiveFormTab('orders_tab');
            return;
        }
        // VALIDATE BARTHEL IF REQUIRED
        if (isFirstTimeRCV && selectedTemplate?.recordType === RecordType.PYP_CV_RISK) {
            if(!dynamicData['global_barthel']) {
                alert("La Escala de Barthel es obligatoria para el ingreso al programa de RCV.");
                return;
            }
        }
    }
    setAuthAction(action); setPasswordInput(''); setAuthError(''); setShowAuthModal(true);
  };

  const confirmAuth = async () => {
    if (passwordInput === 'password' || passwordInput === user.documentNumber) { 
       if (authAction === 'FINALIZE') {
           setIsSendingRDA(true); 
           setShowAuthModal(false);

           const fullRecord = { ...currentRecord, dynamicData } as ClinicalRecord;
           const rdaPayload = generateRDA(fullRecord);
           
           setTimeout(() => {
               const finalizedRecord = { 
                   ...fullRecord, 
                   status: RecordStatus.FINALIZED, 
                   dateFinalized: new Date().toISOString(), 
                   emailSent: true,
                   rdaStatus: RDAStatus.SENT_MINSALUD, 
                   rdaPayload: rdaPayload
               } as ClinicalRecord;
               
               setRecords(prev => { 
                   const idx = prev.findIndex(r=>r.id===finalizedRecord.id); 
                   if(idx>=0) { const upd=[...prev]; upd[idx]=finalizedRecord; return upd; } 
                   return [...prev, finalizedRecord]; 
               });
               
               setIsSendingRDA(false);
               setViewMode('LIST');
               setSelectedPatient(null);
               alert(`Historia finalizada y Resumen Digital de Atención (RDA) enviado a Plataforma de Interoperabilidad.`);
           }, 2500); 
       } else {
         setShowAuthModal(false);
       }
    } else {
      setAuthError('Contraseña inválida.');
    }
  };
  
  const handleAddDiagnosis = (code: string, name: string) => {
      if (currentRecord.diagnoses?.some(d => d.code === code)) return;
      const type = (currentRecord.diagnoses?.length || 0) === 0 ? 'PRINCIPAL' : 'RELATED';
      const newDiag: DiagnosisItem = { code, name, type };
      setCurrentRecord(prev => ({ ...prev, diagnoses: [...(prev.diagnoses || []), newDiag] }));
      setDiagSearch('');
  };
  const handleRemoveDiagnosis = (code: string) => {
      setCurrentRecord(prev => ({ ...prev, diagnoses: prev.diagnoses?.filter(d => d.code !== code) }));
  };

  const handleAddPrescription = () => {
      if(!newRx.medicationName || !newRx.dose) return;
      const item: PrescriptionItem = {
          id: `rx-${Date.now()}`,
          medicationName: newRx.medicationName,
          dose: newRx.dose || '',
          frequency: newRx.frequency || '',
          route: newRx.route || 'Oral',
          duration: newRx.duration || '',
          totalQuantity: newRx.totalQuantity || 1,
          observations: newRx.observations || ''
      };
      setCurrentRecord(prev => ({ ...prev, prescriptions: [...(prev.prescriptions || []), item] }));
      setNewRx({ medicationName: '', dose: '', frequency: '', route: 'Oral', duration: '', totalQuantity: 1, observations: '' });
  };
  const handleRemovePrescription = (id: string) => {
      setCurrentRecord(prev => ({ ...prev, prescriptions: prev.prescriptions?.filter(p => p.id !== id) }));
  };

  const handleAddProcedure = (code: string, name: string) => {
      const newProc: ProcedureItem = { id: `pp-${Date.now()}`, code, name, amount: 1 };
      setCurrentRecord(prev => ({ ...prev, performedProcedures: [...(prev.performedProcedures || []), newProc] }));
      setProcSearch('');
      setShowCustomProcInput(false);
      setCustomProcName('');
  };
  const handleRemoveProcedure = (id: string) => {
      setCurrentRecord(prev => ({ ...prev, performedProcedures: prev.performedProcedures?.filter(p => p.id !== id) }));
  };

  const handleImportResult = (result: ClinicalRecord) => {
      let importText = `\n[RESULTADO EXTERNO - ${result.chiefComplaint} - ${new Date(result.dateCreated).toLocaleDateString()}]\n`;
      Object.entries(result.dynamicData).forEach(([key, val]) => {
           const label = MOCK_SECTION_LIBRARY.flatMap(s => s.fields).find(f => f.id === key)?.label || key;
           importText += `- ${label}: ${val}\n`;
      });
      const currentAnalysis = dynamicData['d_analisis'] || '';
      const newAnalysis = currentAnalysis + importText;
      setDynamicData({ ...dynamicData, d_analisis: newAnalysis });
      alert(`✅ Datos de ${result.chiefComplaint} importados correctamente al campo 'Análisis Clínico'.`);
  };

  const renderField = (field: any, isReadOnly: boolean) => {
      if (field.type === 'HEADER') return <h4 className="text-sm font-bold text-slate-700 mt-4 border-b pb-1 col-span-2">{field.label}</h4>;
      if (field.type === 'INFO') return <div className="col-span-2 bg-blue-50 p-2 rounded text-xs text-blue-800 mb-2">{field.label}</div>;

      const val = dynamicData[field.id] || '';
      const isBarthel = field.id === 'global_barthel';
      // RCV Logic: Barthel mandatory only on first time
      const isMandatory = field.required || (isBarthel && isFirstTimeRCV);
      const showBarthelAlert = isBarthel && isFirstTimeRCV && !val;

      return (
          <div key={field.id} className={`${field.type === 'TEXTAREA' ? 'col-span-2' : 'col-span-1'}`}>
              <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center">
                  {field.label} {field.unit && <span className="ml-1 text-slate-400">({field.unit})</span>}
                  {isMandatory && <span className="text-red-500 ml-1">*</span>}
                  {showBarthelAlert && <AlertTriangle size={12} className="text-orange-500 ml-2 animate-pulse" />}
              </label>
              
              {field.type === 'TEXTAREA' ? (
                  <textarea disabled={isReadOnly} className="w-full p-2 border rounded text-sm bg-slate-50 focus:bg-white" rows={2} value={val} onChange={e => setDynamicData({...dynamicData, [field.id]: e.target.value})} />
              ) : field.type === 'SELECT' ? (
                  <select disabled={isReadOnly} className="w-full p-2 border rounded text-sm bg-slate-50 focus:bg-white" value={val} onChange={e => setDynamicData({...dynamicData, [field.id]: e.target.value})}>
                      <option value="">-</option>
                      {field.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
              ) : field.type === 'CALCULATED' ? (
                  <div className="relative">
                      <input disabled className="w-full p-2 border rounded text-sm bg-purple-50 text-purple-800 font-bold border-purple-100" value={val} placeholder="Calculando..."/>
                      <Calculator size={14} className="absolute right-2 top-2.5 text-purple-400"/>
                  </div>
              ) : (
                  <input 
                    disabled={isReadOnly} 
                    type={field.type === 'NUMBER' ? 'number' : 'text'} 
                    className={`w-full p-2 border rounded text-sm bg-slate-50 focus:bg-white ${showBarthelAlert ? 'border-orange-500 ring-1 ring-orange-200' : ''}`}
                    value={val} 
                    onChange={e => setDynamicData({...dynamicData, [field.id]: e.target.value})} 
                    placeholder={field.placeholder}
                  />
              )}
              {showBarthelAlert && <span className="text-[10px] text-orange-600 font-bold block mt-1">Campo obligatorio para ingreso al programa.</span>}
          </div>
      );
  };
  
  const RecentResultsWidget = () => {
      const results = records.filter(r => 
          r.patientId === selectedPatient?.id && 
          (r.recordType === RecordType.LAB_RESULT || r.recordType === RecordType.IMAGING_REPORT)
      ).sort((a,b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());

      if (results.length === 0) return (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
              <h4 className="font-bold text-slate-500 text-sm mb-2 flex items-center">
                  <TestTube size={16} className="mr-2"/> Apoyo Diagnóstico
              </h4>
              <p className="text-xs text-slate-400 italic">No hay resultados recientes para este paciente.</p>
          </div>
      );

      const renderResultDetails = (record: ClinicalRecord) => {
          return (
              <div className="mt-2 bg-white p-2 rounded border text-xs grid grid-cols-1 gap-2">
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                      {Object.entries(record.dynamicData).map(([key, val]) => {
                          const label = MOCK_SECTION_LIBRARY.flatMap(s => s.fields).find(f => f.id === key)?.label || key;
                          return (
                              <div key={key}>
                                  <span className="font-bold text-slate-500">{label}:</span> <span className="text-slate-800">{val}</span>
                              </div>
                          );
                      })}
                  </div>
                  {!viewMode.includes('VIEW') && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleImportResult(record); }}
                        className="mt-2 w-full bg-blue-100 text-blue-700 py-1 rounded font-bold hover:bg-blue-200 flex justify-center items-center transition-colors"
                    >
                        <ArrowLeftCircle size={14} className="mr-1"/> Incorporar a Historia
                    </button>
                  )}
              </div>
          );
      };

      return (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 shadow-sm">
              <h4 className="font-bold text-blue-800 text-sm mb-3 flex items-center">
                  <TestTube size={16} className="mr-2"/> Resultados Recientes
                  <span className="ml-auto text-[10px] bg-blue-200 text-blue-800 px-2 rounded-full">{results.length}</span>
              </h4>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                  {results.map(r => (
                      <div key={r.id} className="border border-blue-100 bg-white rounded-lg p-2 shadow-sm">
                          <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedResultId(expandedResultId === r.id ? null : r.id)}>
                              <div className="flex items-center overflow-hidden">
                                  {r.recordType === RecordType.LAB_RESULT ? <TestTube size={14} className="text-purple-500 mr-2 flex-shrink-0"/> : <Image size={14} className="text-orange-500 mr-2 flex-shrink-0"/>}
                                  <div className="truncate">
                                      <p className="font-bold text-xs text-slate-700 truncate">{r.chiefComplaint}</p> 
                                      <p className="text-[10px] text-slate-500">{new Date(r.dateCreated).toLocaleDateString()} ({new Date(r.dateCreated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})})</p>
                                  </div>
                              </div>
                              <ChevronDown size={14} className={`text-slate-400 transition-transform flex-shrink-0 ${expandedResultId === r.id ? 'rotate-180' : ''}`}/>
                          </div>
                          {expandedResultId === r.id && renderResultDetails(r)}
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  const RDAViewerModal = () => (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-800 flex items-center">
                      <ShieldCheck className="mr-2 text-green-600"/> Resumen Digital de Atención (RDA)
                  </h3>
                  <button onClick={() => setShowRDAModal(false)}><X size={20}/></button>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4 text-xs text-blue-800">
                  <span className="font-bold block mb-1">Cumplimiento Resolución 1888 de 2025:</span>
                  Este documento JSON estandarizado es la representación técnica enviada a la Plataforma de Interoperabilidad del Ministerio de Salud. Garantiza la continuidad asistencial y el intercambio seguro de datos.
              </div>
              <div className="flex-1 overflow-y-auto bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-xs">
                  <pre>{currentRecord.rdaPayload || 'No hay datos de RDA disponibles.'}</pre>
              </div>
              <div className="mt-4 flex justify-end">
                   <button onClick={() => setShowRDAModal(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded font-bold text-sm">Cerrar</button>
              </div>
          </div>
      </div>
  );

  // --- HR & TALENT MODULE ---
  if (activeTab === 'hr') {
      const activeContract = hrUser.contracts?.find(c => c.isActive);
      const auditTrail = activeContract?.auditTrail || [];
      const disciplinary = hrUser.disciplinaryHistory || [];
      const myPaymentRequests = paymentRequests.filter(p => p.userId === user.id);

      return (
          <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 space-y-8">
              
              {/* MODAL CUENTA DE COBRO */}
              {showPaymentModal && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
                          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                              <DollarSign className="mr-2 text-green-600"/> Generar Cuenta de Cobro
                          </h3>
                          <div className="space-y-4">
                              <div>
                                  <label className="text-xs font-bold text-slate-500">Periodo a Cobrar</label>
                                  <input 
                                      className="w-full border p-2 rounded text-sm font-bold" 
                                      value={newPayment.period} 
                                      onChange={e => setNewPayment({...newPayment, period: e.target.value})}
                                  />
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-slate-500">Valor Honorarios</label>
                                  <input 
                                      type="number"
                                      className="w-full border p-2 rounded text-sm font-bold text-green-700" 
                                      value={newPayment.amount} 
                                      onChange={e => setNewPayment({...newPayment, amount: parseFloat(e.target.value)})}
                                  />
                              </div>
                              
                              <div className="border-t pt-4">
                                  <p className="text-xs font-bold text-slate-700 mb-2">Cargar Soportes (PDF)</p>
                                  <div className="space-y-2">
                                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-dashed border-slate-300">
                                          <div className="flex items-center">
                                              <FileText size={16} className="text-slate-400 mr-2"/>
                                              <span className="text-xs text-slate-600">Planilla Seguridad Social</span>
                                          </div>
                                          <button className="text-xs bg-white border px-2 py-1 rounded hover:bg-slate-100">Seleccionar...</button>
                                      </div>
                                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded border border-dashed border-slate-300">
                                          <div className="flex items-center">
                                              <FileText size={16} className="text-slate-400 mr-2"/>
                                              <span className="text-xs text-slate-600">Informe de Actividades</span>
                                          </div>
                                          <button className="text-xs bg-white border px-2 py-1 rounded hover:bg-slate-100">Seleccionar...</button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="flex justify-end gap-2 mt-6">
                              <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2 text-slate-600 font-medium text-sm">Cancelar</button>
                              <button onClick={handleGeneratePaymentRequest} className="px-4 py-2 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700 flex items-center">
                                  <Printer size={16} className="mr-2"/> Generar PDF y Enviar
                              </button>
                          </div>
                      </div>
                  </div>
              )}

              {/* MODAL PARA DESCARGOS */}
              {showDescargosModal && (
                  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
                          <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center">
                              <FileSignature className="mr-2 text-blue-600"/> Presentar Descargos
                          </h3>
                          <p className="text-xs text-slate-500 mb-4">
                              Escriba su explicación o justificación detallada respecto al requerimiento seleccionado. Esta información quedará registrada en su hoja de vida y visible para administración.
                          </p>
                          <textarea 
                              className="w-full p-3 border rounded-lg text-sm h-40 focus:ring-2 focus:ring-blue-500 outline-none"
                              placeholder="Escriba aquí sus descargos..."
                              value={descargoText}
                              onChange={e => setDescargoText(e.target.value)}
                          />
                          <div className="flex justify-end gap-2 mt-4">
                              <button onClick={() => setShowDescargosModal(false)} className="px-4 py-2 text-slate-600 font-medium text-sm">Cancelar</button>
                              <button onClick={handleSaveDescargos} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700">
                                  Guardar y Enviar
                              </button>
                          </div>
                      </div>
                  </div>
              )}

              <div className="flex justify-between items-center border-b pb-4">
                  <div>
                      <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                          <Briefcase className="mr-3 text-purple-600"/> Mi Contrato y Gestión Humana
                      </h2>
                      <p className="text-slate-500 mt-1">Visualización de vinculación laboral y procesos disciplinarios.</p>
                  </div>
                  {/* GENERATE PAYMENT BUTTON FOR OPS */}
                  {activeContract?.type === ContractType.OPS && (
                      <button onClick={handleOpenPaymentModal} className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center shadow-lg hover:bg-green-700 transition-transform hover:-translate-y-0.5">
                          <DollarSign size={16} className="mr-2"/> Generar Cuenta de Cobro
                      </button>
                  )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Contract Details */}
                  <div className="lg:col-span-1 space-y-6">
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                          <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">Vinculación Actual</h3>
                          {activeContract ? (
                              <div className="space-y-4">
                                  <div className="flex justify-between items-center bg-purple-50 p-3 rounded-lg border border-purple-100">
                                      <span className="text-xs font-bold text-purple-700">Estado</span>
                                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">ACTIVO</span>
                                  </div>
                                  <div>
                                      <p className="text-xs text-slate-400">Tipo de Contrato</p>
                                      <p className="font-medium text-slate-800">{activeContract.type === 'NOMINA' ? 'Laboral (Nómina)' : 'Prestación de Servicios'}</p>
                                  </div>
                                  <div>
                                      <p className="text-xs text-slate-400">Honorarios / Salario</p>
                                      <p className="font-bold text-xl text-slate-800">
                                          {activeContract.type === 'NOMINA' 
                                              ? formatCurrency(activeContract.baseSalary || 0) 
                                              : (activeContract.opsPaymentMethod === 'FIXED_MONTHLY' ? formatCurrency(activeContract.opsValue || 0) : 'Variable por Producción')
                                          }
                                      </p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                      <div>
                                          <p className="text-xs text-slate-400">Fecha Inicio</p>
                                          <p className="font-medium text-sm">{activeContract.startDate}</p>
                                      </div>
                                      <div>
                                          <p className="text-xs text-slate-400">Fecha Fin</p>
                                          <p className="font-medium text-sm">{activeContract.endDate || 'Indefinido'}</p>
                                      </div>
                                  </div>
                                  <button className="w-full mt-4 text-xs text-blue-600 font-bold border border-blue-200 rounded py-2 hover:bg-blue-50">
                                      Descargar Copia PDF
                                  </button>
                              </div>
                          ) : (
                              <div className="text-center p-6 text-slate-400 italic text-sm">No hay contrato activo registrado.</div>
                          )}
                      </div>

                      {/* Payment History for OPS */}
                      {activeContract?.type === ContractType.OPS && (
                          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                              <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">Historial de Pagos</h3>
                              <div className="space-y-3">
                                  {myPaymentRequests.map(req => (
                                      <div key={req.id} className="flex justify-between items-center p-3 bg-slate-50 rounded border">
                                          <div>
                                              <p className="text-xs font-bold text-slate-800">{req.period}</p>
                                              <p className="text-[10px] text-slate-500">{new Date(req.dateSubmitted).toLocaleDateString()}</p>
                                          </div>
                                          <span className={`text-[10px] font-bold px-2 py-1 rounded ${req.status === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                              {req.status === 'PAID' ? 'PAGADO' : 'EN TRÁMITE'}
                                          </span>
                                      </div>
                                  ))}
                                  {myPaymentRequests.length === 0 && <p className="text-xs text-slate-400 italic text-center">Sin cobros generados.</p>}
                              </div>
                          </div>
                      )}

                      {/* Audit Trail */}
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                          <h3 className="font-bold text-slate-700 mb-4 text-sm uppercase tracking-wide">Auditoría Contractual</h3>
                          <div className="space-y-4 max-h-60 overflow-y-auto pr-2 relative">
                              <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-slate-100"></div>
                              {auditTrail.map((audit, idx) => (
                                  <div key={idx} className="relative pl-6">
                                      <div className="absolute left-0 top-1.5 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></div>
                                      <p className="text-xs font-bold text-slate-700">{audit.action}</p>
                                      <p className="text-[10px] text-slate-500">{new Date(audit.date).toLocaleDateString()}</p>
                                      <p className="text-xs text-slate-600 mt-1 italic">"{audit.details}"</p>
                                      <p className="text-[10px] text-slate-400 mt-0.5">Por: {audit.changedBy}</p>
                                  </div>
                              ))}
                              {auditTrail.length === 0 && <p className="text-xs text-slate-400 italic pl-6">Sin historial de cambios.</p>}
                          </div>
                      </div>
                  </div>

                  {/* Right Column: Disciplinary Actions */}
                  <div className="lg:col-span-2">
                      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                          <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
                              <h3 className="font-bold text-slate-700 flex items-center">
                                  <AlertOctagon className="mr-2 text-orange-500"/> Historial Disciplinario
                              </h3>
                              <span className="text-xs bg-white border px-2 py-1 rounded text-slate-500">
                                  {disciplinary.length} Registros
                              </span>
                          </div>
                          
                          {disciplinary.length === 0 ? (
                              <div className="p-12 text-center flex flex-col items-center justify-center">
                                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                                      <ShieldCheck size={32} className="text-green-500"/>
                                  </div>
                                  <h4 className="font-bold text-slate-800">Hoja de Vida Limpia</h4>
                                  <p className="text-sm text-slate-500 mt-2">No presenta sanciones, quejas ni requerimientos activos.</p>
                              </div>
                          ) : (
                              <div className="divide-y divide-slate-100">
                                  {disciplinary.map(action => (
                                      <div key={action.id} className="p-6 hover:bg-slate-50 transition-colors">
                                          <div className="flex justify-between items-start mb-3">
                                              <div>
                                                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${
                                                      action.type === 'SANCTION' ? 'bg-red-100 text-red-700' : 
                                                      action.type === 'COMPLAINT' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                                                  }`}>
                                                      {action.type === 'SANCTION' ? 'Sanción' : action.type === 'COMPLAINT' ? 'Queja' : 'Requerimiento'}
                                                  </span>
                                                  <h4 className="font-bold text-slate-800 mt-2 text-lg">{action.title}</h4>
                                                  <p className="text-xs text-slate-500">{new Date(action.date).toLocaleDateString()}</p>
                                              </div>
                                              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                                                  action.status === 'OPEN' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                                              }`}>
                                                  {action.status === 'OPEN' ? 'ABIERTO' : 'RESUELTO'}
                                              </span>
                                          </div>
                                          
                                          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-700 mb-4">
                                              <p className="font-semibold text-xs text-slate-500 uppercase mb-1">Descripción del Evento:</p>
                                              {action.description}
                                          </div>

                                          {/* SECCIÓN DE DESCARGOS */}
                                          {action.response ? (
                                              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm">
                                                  <p className="font-bold text-xs text-blue-700 uppercase mb-1 flex items-center">
                                                      <FileSignature size={12} className="mr-1"/> Sus Descargos / Respuesta:
                                                  </p>
                                                  <p className="text-slate-700 italic">"{action.response}"</p>
                                              </div>
                                          ) : (
                                              action.status === 'OPEN' && (
                                                  <div className="flex justify-end">
                                                      <button 
                                                          onClick={() => handleOpenDescargos(action.id)}
                                                          className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 flex items-center shadow-lg transform transition hover:-translate-y-0.5"
                                                      >
                                                          <FileSignature size={16} className="mr-2"/> Redactar Descargos
                                                      </button>
                                                  </div>
                                              )
                                          )}
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  // --- FINANCIAL DASHBOARD COMPONENT ---
  if (activeTab === 'reports') {
      const myRecords = records.filter(r => r.professionalId === user.id && r.status === RecordStatus.FINALIZED);
      const totalProduction = myRecords.reduce((acc, curr) => {
          // Estimate production based on procedures or default consult value
          const procsVal = curr.performedProcedures?.reduce((sum, p) => sum + 45000, 0) || 0; // Approx val per proc if no price
          return acc + 45000 + procsVal; // Base consult + procs
      }, 0);

      const chartData = [
          { name: 'Lun', val: Math.random() * 500000 },
          { name: 'Mar', val: Math.random() * 500000 },
          { name: 'Mié', val: Math.random() * 500000 },
          { name: 'Jue', val: Math.random() * 500000 },
          { name: 'Vie', val: Math.random() * 500000 },
      ];

      return (
          <div className="p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2">
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                  <TrendingUp className="mr-3 text-green-600"/> Mi Producción & Finanzas
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                      <p className="text-sm font-bold text-slate-500 uppercase">Pacientes Atendidos</p>
                      <h3 className="text-3xl font-bold text-slate-800 mt-2">{myRecords.length}</h3>
                  </div>
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                      <p className="text-sm font-bold text-slate-500 uppercase">Producción Estimada (Mes)</p>
                      <h3 className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(totalProduction)}</h3>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                      <p className="text-sm font-bold text-slate-500 uppercase">Eficiencia</p>
                      <h3 className="text-3xl font-bold text-blue-600 mt-2">98%</h3>
                  </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-80">
                  <h4 className="font-bold text-slate-700 mb-4">Tendencia Semanal</h4>
                   <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={chartData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} />
                           <XAxis dataKey="name" />
                           <YAxis tickFormatter={(val) => `$${val/1000}k`}/>
                           <Tooltip formatter={(val: number) => formatCurrency(val)} />
                           <Bar dataKey="val" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                       </BarChart>
                   </ResponsiveContainer>
              </div>
          </div>
      );
  }

  // --- MAIN PROFESSIONAL WORKSPACE ---
  if ((viewMode === 'CREATE' || viewMode === 'VIEW') && selectedPatient) {
    const isReadOnly = viewMode === 'VIEW';
    const allowedTemplates = MOCK_TEMPLATES.filter(t => t.allowedRoles.some(r => user.roles.includes(r)));
    
    return (
      <div className="flex flex-col h-[calc(100vh-100px)] relative">
         {isSendingRDA && (
             <div className="absolute inset-0 bg-white/90 z-40 flex flex-col items-center justify-center">
                 <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
                 <h3 className="text-xl font-bold text-slate-800">Finalizando Historia Clínica</h3>
                 <p className="text-slate-500 mt-2">Generando RDA (Res. 1888/2025)...</p>
                 <p className="text-blue-600 font-medium text-sm mt-1 animate-pulse">Enviando a Plataforma de Interoperabilidad...</p>
             </div>
         )}
         
         {showRDAModal && <RDAViewerModal />}
         {showAuthModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-xl">
                    <h3 className="text-lg font-bold mb-4">Confirmar Identidad</h3>
                    <input type="password" value={passwordInput} onChange={e=>setPasswordInput(e.target.value)} className="border p-2 w-full mb-4" placeholder="Contraseña o Documento"/>
                    {authError && <p className="text-red-500 text-xs mb-2">{authError}</p>}
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setShowAuthModal(false)} className="px-3 py-1 text-slate-500">Cancelar</button>
                        <button onClick={confirmAuth} className="bg-blue-600 text-white px-4 py-2 rounded">Confirmar</button>
                    </div>
                </div>
            </div>
         )}
         
         {/* HEADER ACTIONS */}
         <div className="flex items-center justify-between mb-4 pb-4 border-b">
            <div className="flex items-center">
                <button onClick={() => { setViewMode('LIST'); setSelectedPatient(null); }} className="mr-4 p-2 hover:bg-slate-100 rounded-full"><ChevronRight className="rotate-180" size={20}/></button>
                <div>
                    <h2 className="text-xl font-bold text-slate-800">{selectedPatient.fullName}</h2>
                    <p className="text-xs text-slate-500">{selectedPatient.insuranceType} | {new Date().getFullYear() - new Date(selectedPatient.birthDate).getFullYear()} años</p>
                </div>
            </div>
            {!isReadOnly ? (
                <div className="flex items-center space-x-3">
                    <select 
                        className="p-2 border rounded text-sm bg-white font-bold text-slate-700"
                        value={selectedTemplate?.id}
                        onChange={(e) => changeTemplate(e.target.value)}
                    >
                        {allowedTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                    <button onClick={handleSaveDraft} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-50">Guardar</button>
                    <button onClick={() => initiateAuth('FINALIZE')} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 flex items-center">
                        <Lock size={14} className="mr-2"/> Finalizar & RDA
                    </button>
                </div>
            ) : (
                <div className="flex items-center space-x-3">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-xs font-bold ${currentRecord.rdaStatus === RDAStatus.SENT_MINSALUD ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                        {currentRecord.rdaStatus === RDAStatus.SENT_MINSALUD ? <ShieldCheck size={14}/> : <Clock size={14}/>}
                        <span>{currentRecord.rdaStatus === RDAStatus.SENT_MINSALUD ? 'RDA Enviado (Res. 1888)' : 'RDA Pendiente'}</span>
                    </div>
                    {currentRecord.rdaPayload && (
                        <button onClick={() => setShowRDAModal(true)} className="flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium">
                            <Database size={14} className="mr-1"/> Ver JSON
                        </button>
                    )}
                </div>
            )}
         </div>

         <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-1 lg:grid-cols-4 gap-6 pb-20">
             
             <div className="lg:col-span-3">
                 <div className="flex border-b border-slate-200 mb-6 overflow-x-auto scrollbar-hide bg-white sticky top-0 z-10">
                     {selectedTemplate?.sections.map(s => (
                         <button
                           key={s.id}
                           onClick={() => setActiveFormTab(s.id)}
                           className={`px-5 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeFormTab === s.id ? 'border-blue-600 text-blue-700 bg-blue-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                         >
                           {s.title}
                         </button>
                     ))}
                     <button
                       onClick={() => setActiveFormTab('orders_tab')}
                       className={`px-5 py-3 text-sm font-bold whitespace-nowrap border-b-2 transition-colors flex items-center ${activeFormTab === 'orders_tab' ? 'border-purple-600 text-purple-700 bg-purple-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                     >
                       <Stethoscope size={16} className="mr-2" />
                       Codificación y Órdenes
                     </button>
                 </div>

                 {selectedTemplate?.sections.map(section => {
                     if (activeFormTab !== section.id) return null;
                     return (
                         <div key={section.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <h3 className="text-lg font-bold text-slate-800 mb-1">{section.title}</h3>
                             {section.description && <p className="text-xs text-slate-400 mb-4">{section.description}</p>}
                             
                             <div className="grid grid-cols-2 gap-4">
                                 {section.fields.map(field => {
                                     return renderField(field, isReadOnly);
                                 })}
                             </div>
                         </div>
                     );
                 })}

                 {activeFormTab === 'orders_tab' && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                         {/* DIAGNOSIS MODULE */}
                         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-700 mb-4 flex items-center"><Activity size={18} className="mr-2 text-purple-600"/> Diagnósticos (CIE-11)</h3>
                            {!isReadOnly && (
                                <div className="relative mb-4">
                                    <input className="w-full p-2 border rounded text-sm" placeholder="Buscar código o nombre CIE-11..." value={diagSearch} onChange={e => setDiagSearch(e.target.value)} />
                                    {diagSearch && (
                                        <ul className="absolute z-10 w-full bg-white border shadow-lg max-h-40 overflow-y-auto mt-1">
                                            {MOCK_CIE11.filter(t => t.name.toLowerCase().includes(diagSearch.toLowerCase()) || t.code.includes(diagSearch)).map(t => (
                                                <li key={t.code} className="p-2 hover:bg-slate-50 cursor-pointer text-sm" onClick={() => handleAddDiagnosis(t.code, t.name)}>
                                                    <span className="font-bold">{t.code}</span> - {t.name}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                            <div className="space-y-2">
                                {currentRecord.diagnoses?.map(d => (
                                    <div key={d.code} className="flex justify-between items-center p-3 bg-slate-50 border rounded-lg">
                                        <div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded mr-2 ${d.type === 'PRINCIPAL' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'}`}>{d.type}</span>
                                            <span className="text-sm font-medium">{d.code} - {d.name}</span>
                                        </div>
                                        {!isReadOnly && <button onClick={() => handleRemoveDiagnosis(d.code)} className="text-red-400"><Trash2 size={14}/></button>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PRESCRIPTION MODULE (Enhanced with Quick Load) */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-700 mb-4 flex items-center justify-between">
                                <div className="flex items-center"><Syringe size={18} className="mr-2 text-blue-600"/> Prescripción de Medicamentos</div>
                                {!isReadOnly && (
                                    <div className="relative">
                                        <button onClick={() => setShowMedHistory(!showMedHistory)} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200 flex items-center">
                                            <History size={14} className="mr-1"/> Recientes
                                        </button>
                                        {showMedHistory && (
                                            <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-xl border rounded-xl z-20 p-2">
                                                <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Más Usados</p>
                                                 {topMedications.map(med => (
                                                    <div key={med} className="p-2 hover:bg-blue-50 cursor-pointer text-xs rounded" onClick={() => { setNewRx({ ...newRx, medicationName: med }); setShowMedHistory(false); }}>
                                                        {med}
                                                    </div>
                                                ))}
                                                 {topMedications.length === 0 && <p className="text-xs text-slate-400 italic">Sin historial.</p>}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </h3>
                            {!isReadOnly && (
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                                    <div className="grid grid-cols-4 gap-2 mb-2">
                                        <div className="col-span-2">
                                            <label className="text-[10px] font-bold text-slate-500">Medicamento</label>
                                            <input className="w-full p-1.5 border rounded text-sm" list="medList" value={newRx.medicationName} onChange={e => setNewRx({...newRx, medicationName: e.target.value})} placeholder="Buscar o escribir nuevo..." />
                                            <datalist id="medList">
                                                {MOCK_MEDICATIONS.map(m => <option key={m} value={m}/>)}
                                            </datalist>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500">Dosis</label>
                                            <input className="w-full p-1.5 border rounded text-sm" value={newRx.dose} onChange={e => setNewRx({...newRx, dose: e.target.value})} placeholder="Ej. 500mg" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500">Frecuencia</label>
                                            <input className="w-full p-1.5 border rounded text-sm" value={newRx.frequency} onChange={e => setNewRx({...newRx, frequency: e.target.value})} placeholder="Ej. Cada 8h" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500">Vía</label>
                                            <select className="w-full p-1.5 border rounded text-sm" value={newRx.route} onChange={e => setNewRx({...newRx, route: e.target.value})}>
                                                <option>Oral</option><option>Intravenosa</option><option>Intramuscular</option><option>Tópica</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500">Duración</label>
                                            <input className="w-full p-1.5 border rounded text-sm" value={newRx.duration} onChange={e => setNewRx({...newRx, duration: e.target.value})} placeholder="Ej. 5 días" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500">Cant.</label>
                                            <input type="number" className="w-full p-1.5 border rounded text-sm" value={newRx.totalQuantity} onChange={e => setNewRx({...newRx, totalQuantity: parseInt(e.target.value)})} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-slate-500">Acción</label>
                                            <button onClick={handleAddPrescription} className="w-full bg-blue-600 text-white p-1.5 rounded text-sm font-bold">Agregar</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <table className="w-full text-xs text-left border-collapse">
                                <thead className="bg-slate-100 font-bold text-slate-600">
                                    <tr>
                                        <th className="p-2 border">Medicamento</th>
                                        <th className="p-2 border">Dosis/Frec/Vía</th>
                                        <th className="p-2 border">Duración</th>
                                        <th className="p-2 border">Cant.</th>
                                        {!isReadOnly && <th className="p-2 border text-center">x</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRecord.prescriptions?.map(p => (
                                        <tr key={p.id}>
                                            <td className="p-2 border font-medium">{p.medicationName}</td>
                                            <td className="p-2 border">{p.dose} - {p.frequency} ({p.route})</td>
                                            <td className="p-2 border">{p.duration}</td>
                                            <td className="p-2 border text-center">{p.totalQuantity}</td>
                                            {!isReadOnly && <td className="p-2 border text-center"><button onClick={() => handleRemovePrescription(p.id)} className="text-red-500"><Trash2 size={12}/></button></td>}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                         {/* PROCEDURES / INTERCONSULTAS (Enhanced with Custom & History) */}
                         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-700 mb-4 flex items-center justify-between">
                                <div className="flex items-center"><ListPlus size={18} className="mr-2 text-green-600"/> Procedimientos / Interconsultas</div>
                                {!isReadOnly && (
                                    <div className="flex space-x-2 relative">
                                        <button onClick={() => setShowCustomProcInput(!showCustomProcInput)} className="text-xs bg-slate-900 text-white px-2 py-1 rounded hover:bg-slate-800 flex items-center">
                                            <Plus size={14} className="mr-1"/> Crear Manual
                                        </button>
                                        <button onClick={() => setShowProcHistory(!showProcHistory)} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200 flex items-center">
                                            <History size={14} className="mr-1"/> Recientes
                                        </button>
                                        {showProcHistory && (
                                            <div className="absolute right-0 top-full mt-2 w-72 bg-white shadow-xl border rounded-xl z-20 p-2">
                                                <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase">Historial de Uso</p>
                                                 {topProcedures.map(proc => (
                                                    <div key={proc.code} className="p-2 hover:bg-green-50 cursor-pointer text-xs rounded border-b last:border-0" onClick={() => { handleAddProcedure(proc.code, proc.name); setShowProcHistory(false); }}>
                                                        <span className="font-bold block text-slate-700">{proc.code}</span>
                                                        <span className="text-slate-500">{proc.name}</span>
                                                    </div>
                                                ))}
                                                 {topProcedures.length === 0 && <p className="text-xs text-slate-400 italic">Sin historial.</p>}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </h3>
                            {!isReadOnly && (
                                <div className="relative mb-4">
                                    {showCustomProcInput ? (
                                        <div className="flex gap-2 animate-in fade-in slide-in-from-top-2">
                                            <input 
                                                className="flex-1 p-2 border rounded text-sm border-blue-300 ring-2 ring-blue-100" 
                                                placeholder="Nombre del Procedimiento Personalizado..." 
                                                value={customProcName} 
                                                onChange={e => setCustomProcName(e.target.value)} 
                                                autoFocus
                                            />
                                            <button 
                                                onClick={() => { if(customProcName) handleAddProcedure(`MAN-${Date.now().toString().slice(-4)}`, customProcName); }}
                                                className="bg-green-600 text-white px-4 rounded text-sm font-bold"
                                            >
                                                Agregar
                                            </button>
                                            <button onClick={() => setShowCustomProcInput(false)} className="bg-slate-200 text-slate-600 px-3 rounded"><X size={16}/></button>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <input className="w-full p-2 border rounded text-sm" placeholder="Buscar CUPS..." value={procSearch} onChange={e => setProcSearch(e.target.value)} />
                                            {procSearch && (
                                                <ul className="absolute z-10 w-full bg-white border shadow-lg max-h-40 overflow-y-auto mt-1">
                                                    {MOCK_SOAT_TARIFF.filter(t => t.name.toLowerCase().includes(procSearch.toLowerCase()) || t.code.includes(procSearch)).map(t => (
                                                        <li key={t.code} className="p-2 hover:bg-slate-50 cursor-pointer text-sm" onClick={() => handleAddProcedure(t.code, t.name)}>
                                                            <span className="font-bold">{t.code}</span> - {t.name}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="space-y-2">
                                {currentRecord.performedProcedures?.map(p => (
                                    <div key={p.id} className="flex justify-between items-center p-3 bg-slate-50 border rounded-lg">
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 mr-2">{p.code}</span>
                                            <span className="text-sm font-medium">{p.name}</span>
                                        </div>
                                        {!isReadOnly && <button onClick={() => handleRemoveProcedure(p.id)} className="text-red-400"><Trash2 size={14}/></button>}
                                    </div>
                                ))}
                            </div>
                        </div>
                     </div>
                 )}
             </div>

             <div className="lg:col-span-1">
                 <RecentResultsWidget />
             </div>
         </div>
      </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Mis Pacientes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map(p => {
                // CHECK APPOINTMENT STATUS
                const today = new Date().toISOString().split('T')[0];
                const appt = MOCK_APPOINTMENTS.find(a => a.patientId === p.id && a.date === today && a.status === 'WAITING');

                return (
                    <div key={p.id} className={`bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden ${appt ? 'ring-2 ring-green-500' : ''}`} onClick={() => handleCreateRecord(p)}>
                        {appt && (
                            <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                EN SALA DE ESPERA
                            </div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                                {p.fullName.charAt(0)}
                            </div>
                            <button className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Atender</button>
                        </div>
                        <h3 className="font-bold text-slate-800">{p.fullName}</h3>
                        <p className="text-sm text-slate-500 mb-2">{p.identification}</p>
                        <div className="flex items-center text-xs text-slate-400">
                            <Activity size={12} className="mr-1"/> Última atención: 10 Oct 2023
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};