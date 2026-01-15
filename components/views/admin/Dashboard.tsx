import React from 'react';
import { Users, FileText, DollarSign, AlertTriangle, TrendingUp, Briefcase, File, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ComposedChart, PieChart, Pie, Cell, Legend, CartesianGrid, Line } from 'recharts';
import { formatCurrency } from '../../../constants';

const generateFinancialData = (filter: string, isRestricted: boolean) => {
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

interface DashboardProps {
    setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
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
                         <Users size={18} className="mr-2 text-blue-400"/> Gestionar Usuarios
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
};
