import React, { useState } from 'react';
import { User, Patient, Appointment, Invoice, InvoiceItem, RecordType, RecordStatus, ClinicalRecord, UserRole, TariffItem } from '../../types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, MOCK_RECORDS, MOCK_SOAT_TARIFF, SMLDV_2024, formatCurrency, MOCK_USERS } from '../../constants';
import { appointmentService } from '../../services/appointmentService';
import { Users, Calendar, FileText, Search, Plus, Edit, Trash2, X, DollarSign, Printer, CheckCircle, Clock, Download, Briefcase, Percent, Stethoscope, ListPlus, UserCheck, AlertOctagon, RotateCcw, Loader2 } from 'lucide-react';
import { useToast } from '../Toast';

interface SecretaryViewProps {
  user: User;
  onLogout: () => void;
}

export const SecretaryView: React.FC<SecretaryViewProps> = ({ user, onLogout }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'PATIENTS' | 'AGENDA' | 'BILLING' | 'CARTERA'>('AGENDA');

  // --- PATIENTS & AGENDA STATE ---
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingAppts, setIsLoadingAppts] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  // ⚡ TRINITY: Fetch appointments from API
  React.useEffect(() => {
    const fetchAppts = async () => {
        setIsLoadingAppts(true);
        try {
            const data = await appointmentService.getAppointments(selectedDate);
            setAppointments(data);
        } catch (err) {
            console.warn("Usando datos locales de citas");
            setAppointments(MOCK_APPOINTMENTS.filter(a => a.date === selectedDate));
        } finally {
            setIsLoadingAppts(false);
        }
    };
    fetchAppts();
  }, [selectedDate]);
  
  // Agenda Modal
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [newAppt, setNewAppt] = useState<Partial<Appointment>>({ time: '08:00', status: 'SCHEDULED' });
  const [apptProcedures, setApptProcedures] = useState<TariffItem[]>([]); // Temp store for modal

  // Get available professionals
  const professionals = MOCK_USERS.filter(u => u.roles.includes(UserRole.PROFESSIONAL));

  // --- BILLING STATE ---
  const [billingPatient, setBillingPatient] = useState<Patient | null>(null);
  const [billingSearchTerm, setBillingSearchTerm] = useState(''); // Search state

  const [selectedServices, setSelectedServices] = useState<InvoiceItem[]>([]);
  const [globalDiscount, setGlobalDiscount] = useState<number>(0);
  const [partialPayment, setPartialPayment] = useState<string>('');
  const [tariffMode, setTariffMode] = useState<'SOAT' | 'PARTICULAR'>('SOAT');
  const [invoices, setInvoices] = useState<Invoice[]>([]); // Cartera

  // Manual Item
  const [manualItemName, setManualItemName] = useState('');
  const [manualItemPrice, setManualItemPrice] = useState('');

  // Payment Modal state for Cartera
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<string>('');

  // --- AGENDA HANDLERS ---
  const handleOpenApptModal = (existingAppt?: Appointment) => {
      if (existingAppt) {
          setNewAppt(existingAppt);
          setApptProcedures(existingAppt.procedures || []);
      } else {
          setNewAppt({ time: '08:00', status: 'SCHEDULED', reason: '' });
          setApptProcedures([]);
      }
      setIsApptModalOpen(true);
  };

  const handleAddProcedureToAppt = (cupsCode: string) => {
      const item = MOCK_SOAT_TARIFF.find(t => t.code === cupsCode);
      if (item && !apptProcedures.some(p => p.code === item.code)) {
          setApptProcedures([...apptProcedures, item]);
      }
  };

  const handleRemoveProcedureFromAppt = (code: string) => {
      setApptProcedures(apptProcedures.filter(p => p.code !== code));
  };

  const calculateProcedureTotal = (procs: TariffItem[]) => {
      return procs.reduce((acc, item) => acc + Math.round(item.soatFactor * SMLDV_2024), 0);
  };

  const handleSaveAppointment = async () => {
      if(!newAppt.patientId || !newAppt.time || !newAppt.reason || !newAppt.professionalId) {
          showToast("Complete los campos requeridos (Paciente, Profesional, Hora, Motivo)", "warning");
          return;
      }
      const patient = patients.find(p => p.id === newAppt.patientId);
      
      let finalAppt: Appointment;
      const isEdit = !!newAppt.id;

      if (isEdit) {
          finalAppt = { ...newAppt, procedures: apptProcedures } as Appointment;
          // Note: Backend update for details not yet implemented, for now only status is patchable
          setAppointments(prev => prev.map(a => a.id === finalAppt.id ? finalAppt : a));
      } else {
          try {
              const created = await appointmentService.create({
                  ...newAppt,
                  date: selectedDate,
                  procedures: apptProcedures
              });
              finalAppt = {
                  ...created,
                  patientName: patient?.fullName // Enrich for UI
              } as Appointment;
              setAppointments([...appointments, finalAppt]);
          } catch (e) {
          showToast("Error al guardar en servidor. Se usará modo local.", "info");
              finalAppt = {
                  id: `appt-${Date.now()}`,
                  patientId: newAppt.patientId,
                  patientName: patient?.fullName,
                  professionalId: newAppt.professionalId,
                  date: selectedDate,
                  time: newAppt.time,
                  reason: newAppt.reason,
                  status: 'SCHEDULED',
                  procedures: apptProcedures
              } as Appointment;
              setAppointments([...appointments, finalAppt]);
          }
      }

      // Auto-Generate Invoice logic
      if (apptProcedures.length > 0 && !isEdit) {
          const items: InvoiceItem[] = apptProcedures.map(p => ({
              code: p.code,
              name: p.name,
              price: Math.round(p.soatFactor * SMLDV_2024),
              quantity: 1
          }));
          
          const total = calculateProcedureTotal(apptProcedures);

          const newInvoice: Invoice = {
              id: `INV-${Date.now()}`,
              patientId: patient!.id,
              patientName: patient!.fullName,
              date: new Date().toISOString(),
              items: items,
              subtotal: total,
              discount: 0,
              total: total,
              balance: total, 
              payments: [],
              payerType: 'INSURER', 
              status: 'PENDING'
          };
          setInvoices([...invoices, newInvoice]);
          showToast("Cita agendada y Factura creada automáticamente en Cartera.", "success");
      } else {
          showToast(isEdit ? "Cita reprogramada/actualizada." : "Cita agendada exitosamente.", "success");
      }

      setIsApptModalOpen(false);
  };

  const updateApptStatus = async (id: string, status: 'WAITING' | 'CANCELLED') => {
      try {
          await appointmentService.updateStatus(id, status);
          setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
          if (status === 'WAITING') showToast("Paciente marcado como ASISTIÓ. El profesional verá el estado 'En Sala'.", "success");
          if (status === 'CANCELLED') showToast("Cita cancelada.", "info");
      } catch (e) {
          console.error("Error updating status in backend, updating locally");
          setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      }
  };

  // --- BILLING HANDLERS ---
  const handleSelectBillingPatient = (p: Patient) => {
      setBillingPatient(p);
      setBillingSearchTerm('');
  };

  const addToCart = (tariffItem: any) => {
      // Calculate Price
      const basePrice = Math.round(tariffItem.soatFactor * SMLDV_2024);
      const finalPrice = tariffMode === 'PARTICULAR' ? Math.round(basePrice * 1.3) : basePrice; // +30% for private

      const existing = selectedServices.find(s => s.code === tariffItem.code && !s.isSupply);
      if (existing) {
          setSelectedServices(selectedServices.map(s => s.code === tariffItem.code ? { ...s, quantity: s.quantity + 1 } : s));
      } else {
          setSelectedServices([...selectedServices, { code: tariffItem.code, name: tariffItem.name, price: finalPrice, quantity: 1 }]);
      }
  };

  const addManualItem = () => {
      if(!manualItemName || !manualItemPrice) return;
      setSelectedServices([...selectedServices, {
          code: `MAN-${Date.now()}`,
          name: manualItemName,
          price: parseFloat(manualItemPrice),
          quantity: 1,
          isSupply: true
      }]);
      setManualItemName('');
      setManualItemPrice('');
  };

  const updateItemDiscount = (index: number, val: number) => {
      const newServices = [...selectedServices];
      newServices[index].discount = val;
      setSelectedServices(newServices);
  };

  const calculateTotal = () => {
      let subtotal = 0;
      let totalItemDiscounts = 0;

      selectedServices.forEach(item => {
          const itemTotal = item.price * item.quantity;
          subtotal += itemTotal;
          // Item discount
          if (item.discount && item.discount > 0) {
              totalItemDiscounts += itemTotal * (item.discount / 100);
          }
      });

      const netSubtotal = subtotal - totalItemDiscounts;
      
      let globalDiscountAmount = 0;
      if (globalDiscount > 0) {
          globalDiscountAmount = netSubtotal * (globalDiscount / 100);
      }

      const totalDiscount = totalItemDiscounts + globalDiscountAmount;
      const total = subtotal - totalDiscount;

      return { subtotal, totalDiscount, total, totalItemDiscounts, globalDiscountAmount };
  };

  const finalizeInvoice = () => {
      if(!billingPatient) return;
      const { total, subtotal, totalDiscount } = calculateTotal();
      
      const initialPayment = partialPayment ? parseFloat(partialPayment) : 0;
      const balance = total - initialPayment;
      const status = balance <= 0 ? 'PAID' : (initialPayment > 0 ? 'PARTIAL' : 'PENDING');

      const newInvoice: Invoice = {
          id: `INV-${Date.now()}`,
          patientId: billingPatient.id,
          patientName: billingPatient.fullName,
          date: new Date().toISOString(),
          items: selectedServices,
          subtotal,
          discount: totalDiscount,
          total,
          balance,
          payments: initialPayment > 0 ? [{ id: `pay-${Date.now()}`, date: new Date().toISOString(), amount: initialPayment, method: 'CASH' }] : [],
          payerType: tariffMode === 'PARTICULAR' ? 'PATIENT' : 'INSURER',
          status
      };
      setInvoices([...invoices, newInvoice]);
      setSelectedServices([]);
      setBillingPatient(null);
      setPartialPayment('');
      showToast(`Factura generada. Saldo pendiente: ${formatCurrency(balance)}`, "success");
  };

  const printInvoice = (invoice: Invoice) => {
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      const itemsHtml = invoice.items.map(item => `
          <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price)}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
          </tr>
      `).join('');

      printWindow.document.write(`
          <html>
              <head>
                  <title>Factura ${invoice.id}</title>
                  <style>
                      body { font-family: sans-serif; color: #333; padding: 20px; }
                      .header { text-align: center; margin-bottom: 30px; }
                      .info { margin-bottom: 20px; }
                      table { width: 100%; border-collapse: collapse; }
                      .totals { margin-top: 20px; text-align: right; }
                  </style>
              </head>
              <body>
                  <div class="header">
                      <h1>MEDICORE IPS</h1>
                      <p>NIT: 900.123.456-7</p>
                      <h2>FACTURA DE VENTA N° ${invoice.id}</h2>
                  </div>
                  <div class="info">
                      <p><strong>Paciente:</strong> ${invoice.patientName}</p>
                      <p><strong>Fecha:</strong> ${new Date(invoice.date).toLocaleString()}</p>
                  </div>
                  <table>
                      <thead>
                          <tr style="background: #f9fafb;">
                              <th style="padding: 8px; text-align: left;">Descripción</th>
                              <th style="padding: 8px;">Cant.</th>
                              <th style="padding: 8px; text-align: right;">Precio Unit.</th>
                              <th style="padding: 8px; text-align: right;">Total</th>
                          </tr>
                      </thead>
                      <tbody>${itemsHtml}</tbody>
                  </table>
                  <div class="totals">
                      <p>Subtotal: ${formatCurrency(invoice.subtotal)}</p>
                      <p>Descuentos: ${formatCurrency(invoice.discount)}</p>
                      <h3 style="color: #111;">TOTAL: ${formatCurrency(invoice.total)}</h3>
                      <p>Pagado: ${formatCurrency(invoice.total - invoice.balance)}</p>
                      <p style="color: #d32f2f;"><strong>SALDO PENDIENTE: ${formatCurrency(invoice.balance)}</strong></p>
                  </div>
                  <div style="margin-top: 50px; text-align: center; font-size: 10px; color: #777;">
                      Factura generada por MediCore Pro
                  </div>
              </body>
          </html>
      `);
      printWindow.document.close();
      printWindow.print();
  };

  // --- CARTERA HANDLERS ---
  const handleOpenPaymentModal = (invoice: Invoice) => {
      setPaymentInvoice(invoice);
      setPaymentAmount(invoice.balance.toString());
      setIsPaymentModalOpen(true);
  };

  const confirmPayment = () => {
      if (!paymentInvoice || !paymentAmount) return;
      const amount = parseFloat(paymentAmount);
      
      if (amount > paymentInvoice.balance) {
          showToast("El monto ingresado supera el saldo pendiente.", "error");
          return;
      }

      setInvoices(invoices.map(invoice => {
          if (invoice.id !== paymentInvoice.id) return invoice;
          const newBalance = invoice.balance - amount;
          const newStatus = newBalance <= 0 ? 'PAID' : 'PARTIAL';
          return {
              ...invoice,
              balance: newBalance,
              status: newStatus,
              payments: [...invoice.payments, { id: `pay-${Date.now()}`, date: new Date().toISOString(), amount, method: 'CASH' }]
          };
      }));
      setIsPaymentModalOpen(false);
      showToast("Pago registrado correctamente.", "success");
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar simplified for Secretary */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-6 border-b border-slate-100">
              <h1 className="font-bold text-lg text-slate-800">Recepción</h1>
              <p className="text-xs text-slate-500">{user.name}</p>
          </div>
          <nav className="p-4 space-y-2">
              <button onClick={() => setActiveTab('AGENDA')} className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'AGENDA' ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 text-slate-600'}`}>
                  <Calendar size={18} className="mr-3"/> Agenda
              </button>
              <button onClick={() => setActiveTab('PATIENTS')} className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'PATIENTS' ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 text-slate-600'}`}>
                  <Users size={18} className="mr-3"/> Pacientes
              </button>
              <button onClick={() => setActiveTab('BILLING')} className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'BILLING' ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 text-slate-600'}`}>
                  <DollarSign size={18} className="mr-3"/> Facturación
              </button>
              <button onClick={() => setActiveTab('CARTERA')} className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'CARTERA' ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 text-slate-600'}`}>
                  <Briefcase size={18} className="mr-3"/> Cartera
              </button>
          </nav>
          <div className="mt-auto p-4 border-t">
              <button onClick={onLogout} className="text-red-600 text-sm font-medium">Cerrar Sesión</button>
          </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
          
          {/* Payment Registration Modal */}
          {isPaymentModalOpen && paymentInvoice && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                          <DollarSign className="mr-2 text-green-600"/> Registrar Abono / Pago
                      </h3>
                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                          <p className="text-xs text-slate-500 font-bold uppercase mb-1">Paciente</p>
                          <p className="font-bold text-slate-800 mb-3">{paymentInvoice.patientName}</p>
                          <div className="flex justify-between">
                              <div>
                                  <p className="text-xs text-slate-500 font-bold uppercase">Saldo Actual</p>
                                  <p className="font-bold text-red-600">{formatCurrency(paymentInvoice.balance)}</p>
                              </div>
                              <div className="text-right">
                                  <p className="text-xs text-slate-500 font-bold uppercase">Total Factura</p>
                                  <p className="font-bold text-slate-700">{formatCurrency(paymentInvoice.total)}</p>
                              </div>
                          </div>
                      </div>

                      <div className="mb-6">
                          <label htmlFor="payment-amount-input" className="block text-sm font-bold text-slate-700 mb-2">Monto a Recibir</label>
                          <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                              <input
                                  id="payment-amount-input"
                                  type="number"
                                  className="w-full pl-8 pr-4 py-3 border-2 border-blue-100 rounded-xl text-xl font-bold focus:border-blue-500 outline-none"
                                  value={paymentAmount}
                                  onChange={e => setPaymentAmount(e.target.value)}
                                  autoFocus
                              />
                          </div>
                      </div>

                      <div className="flex gap-3">
                          <button onClick={() => setIsPaymentModalOpen(false)} className="flex-1 px-4 py-3 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors">
                              Cancelar
                          </button>
                          <button onClick={confirmPayment} className="flex-1 px-4 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all">
                              Confirmar Pago
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {/* PATIENTS TAB */}
          {activeTab === 'PATIENTS' && (
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Directorio de Pacientes</h2>
             </div>
          )}
          {/* AGENDA TAB (Now Functional) */}
          {activeTab === 'AGENDA' && (
              <div>
                  {isApptModalOpen && (
                      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                          <div className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                              <h3 className="font-bold text-lg mb-4 flex items-center">
                                  <Calendar className="mr-2"/> {newAppt.id ? 'Reprogramar / Editar Cita' : 'Nueva Cita Médica'}
                              </h3>
                              <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                      <div className="col-span-2">
                                          <label className="text-xs font-bold text-slate-500">Paciente</label>
                                          <select disabled={!!newAppt.id} className="w-full border p-2 rounded text-sm disabled:bg-slate-100" value={newAppt.patientId || ''} onChange={e => setNewAppt({...newAppt, patientId: e.target.value})}>
                                              <option value="">Seleccione...</option>
                                              {patients.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
                                          </select>
                                      </div>
                                      <div className="col-span-2">
                                          <label className="text-xs font-bold text-slate-500">Profesional</label>
                                          <select className="w-full border p-2 rounded text-sm" value={newAppt.professionalId || ''} onChange={e => setNewAppt({...newAppt, professionalId: e.target.value})}>
                                              <option value="">Seleccione Médico/a...</option>
                                              {professionals.map(p => <option key={p.id} value={p.id}>{p.name} - {p.specialty}</option>)}
                                          </select>
                                      </div>
                                      <div>
                                          <label className="text-xs font-bold text-slate-500">Hora</label>
                                          <input type="time" className="w-full border p-2 rounded text-sm" value={newAppt.time} onChange={e => setNewAppt({...newAppt, time: e.target.value})} />
                                      </div>
                                      <div>
                                          <label className="text-xs font-bold text-slate-500">Motivo</label>
                                          <input type="text" className="w-full border p-2 rounded text-sm" value={newAppt.reason} onChange={e => setNewAppt({...newAppt, reason: e.target.value})} placeholder="Ej. Control"/>
                                      </div>
                                  </div>

                                  {/* PROCEDURES SELECTOR */}
                                  <div className="border-t pt-3 mt-2">
                                      <label className="text-xs font-bold text-slate-700 block mb-2 flex items-center">
                                          <DollarSign size={14} className="mr-1 text-green-600"/> Procedimientos a Facturar (CUPS)
                                      </label>
                                      <div className="flex space-x-2 mb-2">
                                          <select className="flex-1 border p-2 rounded text-xs bg-slate-50" id="cupsSelect" onChange={(e) => { if(e.target.value) handleAddProcedureToAppt(e.target.value); e.target.value = ''; }}>
                                              <option value="">+ Agregar Procedimiento...</option>
                                              {MOCK_SOAT_TARIFF.map(t => (
                                                  <option key={t.code} value={t.code}>{t.code} - {t.name}</option>
                                              ))}
                                          </select>
                                      </div>
                                      <div className="space-y-1 max-h-32 overflow-y-auto bg-slate-50 p-2 rounded border">
                                          {apptProcedures.length === 0 && <p className="text-xs text-slate-400 italic text-center">Ningún procedimiento seleccionado.</p>}
                                          {apptProcedures.map(p => (
                                              <div key={p.code} className="flex justify-between items-center bg-white p-2 rounded border shadow-sm">
                                                  <div className="text-xs">
                                                      <span className="font-bold block">{p.code}</span>
                                                      <span className="text-slate-500 truncate w-40 block">{p.name}</span>
                                                  </div>
                                                  <div className="flex items-center space-x-2">
                                                      <span className="font-bold text-xs text-slate-700">{formatCurrency(p.soatFactor * SMLDV_2024)}</span>
                                                      <button onClick={() => handleRemoveProcedureFromAppt(p.code)} className="text-red-500 hover:text-red-700"><Trash2 size={12}/></button>
                                                  </div>
                                              </div>
                                          ))}
                                      </div>
                                      {apptProcedures.length > 0 && (
                                          <div className="flex justify-between items-center mt-2 px-2">
                                              <span className="text-xs font-bold text-slate-500">Total Estimado:</span>
                                              <span className="text-sm font-bold text-green-700">{formatCurrency(calculateProcedureTotal(apptProcedures))}</span>
                                          </div>
                                      )}
                                  </div>

                                  <div className="pt-4 flex gap-2">
                                      <button onClick={() => setIsApptModalOpen(false)} className="flex-1 border border-slate-300 text-slate-600 py-2 rounded font-bold text-sm">Cancelar</button>
                                      <button onClick={handleSaveAppointment} className="flex-1 bg-slate-900 text-white py-2 rounded font-bold text-sm flex items-center justify-center">
                                          <CheckCircle size={14} className="mr-2"/> {newAppt.id ? 'Guardar Cambios' : 'Agendar y Facturar'}
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  )}

                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Agenda de Citas</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-4 rounded-xl shadow-sm border h-fit">
                          <h4 className="font-bold mb-4">Calendario</h4>
                          <input type="date" className="w-full p-2 border rounded" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                          <button onClick={() => handleOpenApptModal()} className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center">
                              <Plus size={16} className="mr-2"/> Nueva Cita
                          </button>
                      </div>
                      <div className="col-span-2 space-y-3">
                          {isLoadingAppts ? (
                              <div className="flex justify-center p-12">
                                  <Loader2 className="animate-spin text-blue-500" size={32}/>
                              </div>
                          ) : appointments.map(app => (
                              <div key={app.id} className={`bg-white p-4 rounded-xl border border-l-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center group relative ${app.status === 'CANCELLED' ? 'border-l-red-400 opacity-60' : (app.status === 'WAITING' ? 'border-l-green-500 bg-green-50/30' : 'border-l-blue-500')}`}>
                                  <div className="mb-3 sm:mb-0">
                                      <p className="font-bold text-lg text-slate-800">{app.time}</p>
                                      <p className="font-medium text-slate-600">{app.patientName}</p>
                                      <div className="flex items-center text-xs text-slate-500 mt-1">
                                          <Stethoscope size={12} className="mr-1"/>
                                          {professionals.find(p => p.id === app.professionalId)?.name || 'Sin asignar'}
                                      </div>
                                      <p className="text-sm text-slate-400 mt-1">{app.reason}</p>
                                      {/* Procedures Badge */}
                                      {app.procedures && app.procedures.length > 0 && (
                                          <div className="mt-2 flex gap-1">
                                              {app.procedures.map(p => (
                                                  <span key={p.code} className="text-[10px] bg-green-50 text-green-700 border border-green-200 px-1.5 rounded" title={p.name}>
                                                      {p.code}
                                                  </span>
                                              ))}
                                          </div>
                                      )}
                                  </div>
                                  <div className="flex flex-col items-end gap-2">
                                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                          app.status === 'COMPLETED' ? 'bg-slate-100 text-slate-700' : 
                                          app.status === 'WAITING' ? 'bg-green-100 text-green-700' :
                                          app.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                          'bg-blue-100 text-blue-700'
                                      }`}>
                                          {app.status === 'WAITING' ? 'EN SALA' : app.status}
                                      </span>

                                      {/* ACTION BUTTONS */}
                                      {app.status === 'SCHEDULED' && (
                                          <div className="flex gap-2 mt-2">
                                              <button onClick={() => updateApptStatus(app.id, 'WAITING')} className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-1 rounded hover:bg-green-100 flex items-center" title="Marcar Asistencia">
                                                  <UserCheck size={14} className="mr-1"/> Asistió
                                              </button>
                                              <button onClick={() => handleOpenApptModal(app)} className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-1 rounded hover:bg-blue-100 flex items-center" title="Reprogramar">
                                                  <RotateCcw size={14} className="mr-1"/> Reprogramar
                                              </button>
                                              <button onClick={() => updateApptStatus(app.id, 'CANCELLED')} className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded hover:bg-red-100 flex items-center" title="Cancelar Cita">
                                                  <AlertOctagon size={14} className="mr-1"/> Cancelar
                                              </button>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          ))}
                          {!isLoadingAppts && appointments.length === 0 && (
                              <div className="bg-slate-50 p-8 rounded-xl text-center text-slate-400 italic">No hay citas programadas para esta fecha.</div>
                          )}
                      </div>
                  </div>
              </div>
          )}

          {/* BILLING TAB */}
          {activeTab === 'BILLING' && (
              <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Facturación de Servicios</h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left: Selectors */}
                      <div className="lg:col-span-2 space-y-6">
                          {/* Client Selection (Enhanced Search) */}
                          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative z-20">
                              <h3 className="font-bold text-slate-700 mb-4">1. Datos del Cliente</h3>
                              {!billingPatient ? (
                                  <div className="relative">
                                      <div className="flex items-center border rounded-lg bg-slate-50 px-3 py-2">
                                          <Search size={18} className="text-slate-400 mr-2"/>
                                          <input 
                                              className="bg-transparent w-full outline-none text-sm"
                                              placeholder="Buscar por Nombre o Cédula..."
                                              value={billingSearchTerm}
                                              onChange={e => setBillingSearchTerm(e.target.value)}
                                          />
                                      </div>
                                      {billingSearchTerm && (
                                          <div className="absolute top-full left-0 right-0 bg-white shadow-xl border rounded-lg mt-1 max-h-48 overflow-y-auto z-30">
                                              {patients.filter(p => 
                                                  p.fullName.toLowerCase().includes(billingSearchTerm.toLowerCase()) || 
                                                  p.identification.includes(billingSearchTerm)
                                              ).map(p => (
                                                  <div key={p.id} className="p-3 hover:bg-slate-50 cursor-pointer border-b last:border-0" onClick={() => handleSelectBillingPatient(p)}>
                                                      <p className="font-bold text-sm text-slate-800">{p.fullName}</p>
                                                      <p className="text-xs text-slate-500">{p.identification} - {p.insuranceType}</p>
                                                  </div>
                                              ))}
                                              {patients.filter(p => p.fullName.toLowerCase().includes(billingSearchTerm.toLowerCase())).length === 0 && (
                                                  <div className="p-3 text-xs text-slate-400 text-center">No encontrado.</div>
                                              )}
                                          </div>
                                      )}
                                  </div>
                              ) : (
                                  <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
                                      <div>
                                          <p className="font-bold text-blue-900">{billingPatient.fullName}</p>
                                          <p className="text-xs text-blue-600">{billingPatient.identification} | {billingPatient.insuranceType}</p>
                                      </div>
                                      <button onClick={() => setBillingPatient(null)} className="p-1 hover:bg-blue-200 rounded text-blue-700"><X size={16}/></button>
                                  </div>
                              )}
                              
                              <div className="flex space-x-3 mt-4">
                                  <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
                                      <button onClick={() => setTariffMode('SOAT')} className={`px-3 py-1 rounded-md text-sm font-bold ${tariffMode === 'SOAT' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>SOAT</button>
                                      <button onClick={() => setTariffMode('PARTICULAR')} className={`px-3 py-1 rounded-md text-sm font-bold ${tariffMode === 'PARTICULAR' ? 'bg-white shadow text-slate-800' : 'text-slate-500'}`}>Particular</button>
                                  </div>
                              </div>
                          </div>

                          {/* Services Selector */}
                          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                              <h3 className="font-bold text-slate-700 mb-4">2. Agregar Procedimientos (CUPS)</h3>
                              <div className="space-y-2 max-h-60 overflow-y-auto mb-6">
                                  {MOCK_SOAT_TARIFF.map(svc => {
                                      const basePrice = Math.round(svc.soatFactor * SMLDV_2024);
                                      const displayPrice = tariffMode === 'PARTICULAR' ? Math.round(basePrice * 1.3) : basePrice;
                                      return (
                                          <div key={svc.code} className="flex justify-between items-center p-3 border rounded-lg hover:bg-slate-50 cursor-pointer" onClick={() => addToCart(svc)}>
                                              <div className="flex-1">
                                                  <p className="font-bold text-sm text-slate-700">{svc.name}</p>
                                                  <p className="text-xs text-slate-400">CUPS: {svc.code}</p>
                                              </div>
                                              <div className="flex items-center space-x-3 ml-4">
                                                  <span className="font-bold text-slate-700">{formatCurrency(displayPrice)}</span>
                                                  <Plus size={16} className="text-blue-600"/>
                                              </div>
                                          </div>
                                      );
                                  })}
                              </div>

                              <div className="border-t pt-4">
                                  <h4 className="text-sm font-bold text-slate-600 mb-2">Insumo / Servicio Manual</h4>
                                  <div className="flex space-x-2">
                                      <input className="flex-1 border p-2 rounded text-sm" placeholder="Descripción (ej. Kit Curación)" value={manualItemName} onChange={e => setManualItemName(e.target.value)} />
                                      <input className="w-32 border p-2 rounded text-sm" type="number" placeholder="Precio" value={manualItemPrice} onChange={e => setManualItemPrice(e.target.value)} />
                                      <button onClick={addManualItem} className="bg-slate-900 text-white px-3 rounded"><Plus/></button>
                                  </div>
                              </div>
                          </div>
                      </div>

                      {/* Right: Summary */}
                      <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 flex flex-col h-fit">
                          <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Pre-Factura</h3>
                          <div className="flex-1 space-y-3 mb-6">
                              {selectedServices.map((item, i) => (
                                  <div key={i} className="flex justify-between text-sm items-start">
                                      <div className="w-full">
                                          <div className="flex justify-between">
                                              <span className="text-slate-700 font-medium truncate w-32">{item.name}</span>
                                              <span className="font-bold">{formatCurrency(item.price * item.quantity)}</span>
                                          </div>
                                          <div className="flex justify-between items-center mt-1">
                                               <span className="text-xs text-slate-400">{item.quantity} x {formatCurrency(item.price)}</span>
                                               <div className="flex items-center text-xs">
                                                   <span className="text-slate-400 mr-1">Desc(%):</span>
                                                   <input type="number" className="w-10 p-0.5 border rounded text-right" value={item.discount || 0} onChange={e => updateItemDiscount(i, parseFloat(e.target.value))} />
                                               </div>
                                          </div>
                                      </div>
                                  </div>
                              ))}
                              {selectedServices.length === 0 && <p className="text-slate-400 text-sm italic text-center py-4">No hay items.</p>}
                          </div>

                          <div className="border-t border-slate-100 pt-4 space-y-3">
                              <div className="flex justify-between text-sm">
                                  <span>Subtotal:</span>
                                  <span>{formatCurrency(calculateTotal().subtotal)}</span>
                              </div>
                              <div className="flex justify-between text-sm text-slate-500">
                                  <span>Descuentos Ítems:</span>
                                  <span>- {formatCurrency(calculateTotal().totalItemDiscounts)}</span>
                              </div>
                              <div className="flex justify-between text-sm text-red-500">
                                  <span>Descuento Global (%):</span>
                                  <div className="flex items-center">
                                      <input type="number" className="w-12 border rounded text-right mr-2" value={globalDiscount} onChange={e => setGlobalDiscount(parseFloat(e.target.value))} />
                                      <span>- {formatCurrency(calculateTotal().globalDiscountAmount)}</span>
                                  </div>
                              </div>
                               <div className="flex justify-between items-center text-xl font-bold text-slate-900 pt-2 border-t">
                                  <span>Total:</span>
                                  <span>{formatCurrency(calculateTotal().total)}</span>
                              </div>
                              <div className="flex items-center space-x-2 mt-2 bg-slate-50 p-2 rounded">
                                  <span className="text-sm font-bold">Pago Inicial:</span>
                                  <input type="number" placeholder="0" className="flex-1 p-1 border rounded" value={partialPayment} onChange={e => setPartialPayment(e.target.value)} />
                              </div>
                          </div>

                          <button 
                            disabled={!billingPatient || selectedServices.length === 0}
                            onClick={finalizeInvoice}
                            className="mt-6 w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 flex justify-center items-center"
                          >
                              <CheckCircle size={18} className="mr-2"/> Generar Factura
                          </button>
                      </div>
                  </div>
              </div>
          )}

          {/* CARTERA TAB (Enhanced) */}
          {activeTab === 'CARTERA' && (
              <div>
                   <h2 className="text-2xl font-bold text-slate-800 mb-6">Cartera (Cuentas por Cobrar)</h2>
                   <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                       <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-slate-500 font-medium">
                              <tr>
                                  <th className="p-4">Factura ID</th>
                                  <th className="p-4">Fecha</th>
                                  <th className="p-4">Paciente</th>
                                  <th className="p-4">Total</th>
                                  <th className="p-4">Saldo Pendiente</th>
                                  <th className="p-4">Estado</th>
                                  <th className="p-4 text-right">Acción</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              {invoices.map(inv => (
                                  <tr key={inv.id} className="hover:bg-slate-50">
                                      <td className="p-4 font-mono">{inv.id}</td>
                                      <td className="p-4">{new Date(inv.date).toLocaleDateString()}</td>
                                      <td className="p-4 font-bold">{inv.patientName}</td>
                                      <td className="p-4 font-bold text-slate-800">{formatCurrency(inv.total)}</td>
                                      <td className="p-4 font-bold text-red-600">{formatCurrency(inv.balance)}</td>
                                      <td className="p-4">
                                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${inv.status === 'PAID' ? 'bg-green-100 text-green-700' : (inv.status === 'PARTIAL' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700')}`}>
                                              {inv.status}
                                          </span>
                                      </td>
                                      <td className="p-4 text-right flex justify-end space-x-2">
                                          <button onClick={() => printInvoice(inv)} className="bg-slate-200 text-slate-700 p-2 rounded hover:bg-slate-300" title="Imprimir"><Printer size={16}/></button>
                                          {inv.status !== 'PAID' && (
                                              <button onClick={() => handleOpenPaymentModal(inv)} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-700">
                                                  Abonar
                                              </button>
                                          )}
                                      </td>
                                  </tr>
                              ))}
                              {invoices.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-slate-400 italic">No hay facturas registradas.</td></tr>}
                          </tbody>
                      </table>
                   </div>
              </div>
          )}
      </div>
    </div>
  );
};