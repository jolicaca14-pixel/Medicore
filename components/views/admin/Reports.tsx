import React, { useState } from 'react';
import { RecordStatus, RecordType } from '../../../types';
import { MOCK_RECORDS, MOCK_PATIENTS, formatCurrency } from '../../../constants';
import { FileJson, Zap, Download, TrendingUp } from 'lucide-react';
import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Line, ResponsiveContainer } from 'recharts';

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

export const Reports: React.FC = () => {
    const [ripsStartDate, setRipsStartDate] = useState(new Date().toISOString().split('T')[0].substring(0, 8) + '01');
    const [ripsEndDate, setRipsEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [generatedRips, setGeneratedRips] = useState<{ US: any[], AC: any[], AP: any[], AF: any[] } | null>(null);

    const generateRIPS = () => {
        const filteredRecords = MOCK_RECORDS.filter(r => {
            const d = r.dateCreated.split('T')[0];
            return d >= ripsStartDate && d <= ripsEndDate && r.status === RecordStatus.FINALIZED;
        });

        if (filteredRecords.length === 0) {
            alert("No se encontraron registros finalizados en el rango de fechas seleccionado.");
            setGeneratedRips(null);
            return;
        }

        const uniquePatientIds = Array.from(new Set(filteredRecords.map(r => r.patientId)));
        const usFile = uniquePatientIds.map(pid => {
            const p = MOCK_PATIENTS.find(pt => pt.id === pid);
            if (!p) return null;
            return {
                tipo_documento: 'CC',
                numero_documento: p.identification,
                codigo_admin: 'EPS001',
                tipo_usuario: '1',
                apellido_1: p.fullName.split(' ')[1] || 'Unknown',
                apellido_2: '',
                nombre_1: p.fullName.split(' ')[0],
                nombre_2: '',
                edad: new Date().getFullYear() - new Date(p.birthDate).getFullYear(),
                unidad_medida_edad: '1',
                sexo: p.gender,
                depto: '11',
                municipio: '001',
                zona: 'U'
            };
        }).filter(Boolean);

        const acFile = filteredRecords
            .filter(r => [RecordType.GENERAL, RecordType.PSYCHOLOGY, RecordType.NUTRITION, RecordType.PYP_CV_RISK, RecordType.PYP_GROWTH_DEV, RecordType.PYP_PREGNANCY].includes(r.recordType))
            .map(r => ({
                numero_factura: `FAC-${r.id}`,
                codigo_prestador: '1100100001',
                tipo_documento: 'CC',
                numero_documento: MOCK_PATIENTS.find(p => p.id === r.patientId)?.identification,
                fecha_consulta: r.dateCreated.split('T')[0].split('-').reverse().join('/'),
                numero_autorizacion: 'AUT-000',
                codigo_consulta: r.recordType === RecordType.PSYCHOLOGY ? '890208' : '890201',
                finalidad: '10',
                causa_externa: '13',
                dx_principal: r.diagnoses?.[0]?.code || 'Z000',
                dx_relacionado_1: r.diagnoses?.[1]?.code || '',
                dx_relacionado_2: '',
                dx_relacionado_3: '',
                tipo_dx_principal: '1',
                valor_consulta: 45000,
                valor_cuota_moderadora: 4500,
                valor_neto: 40500
            }));

        let apFile: any[] = [];

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
                        ambito: '1',
                        finalidad: '1',
                        personal_atiende: '1',
                        dx_principal: r.diagnoses?.[0]?.code || 'Z000',
                        dx_relacionado: '',
                        complicacion: '',
                        acto_qx: '1',
                        valor: 25000
                    });
                });
            }
            if (r.recordType === RecordType.LAB_RESULT || r.recordType === RecordType.IMAGING_REPORT) {
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
                    personal_atiende: '4',
                    dx_principal: '',
                    dx_relacionado: '',
                    complicacion: '',
                    acto_qx: '1',
                    valor: 35000
                });
            }
        });

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

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Reportes y Analítica</h2>
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
                            <div className="bg-slate-100 px-4 py-2 border-b flex justify-between items-center">
                                <span className="font-mono text-xs font-bold text-slate-600">Previsualización (Formato JSON Res. 2275/2023)</span>
                                <button onClick={downloadRIPS} className="text-xs flex items-center text-blue-600 font-bold hover:underline">
                                    <Download size={14} className="mr-1"/> Descargar ZIP
                                </button>
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
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center">
                    <TrendingUp className="mr-2 text-green-600"/> Indicadores Financieros
                </h3>
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
};
