import React from 'react';
import { Clock, ChevronRight, CheckCircle } from 'lucide-react';

interface PatientTimelineProps {
    records: any[];
    onSelectRecord: (record: any) => void;
}

export const PatientTimeline: React.FC<PatientTimelineProps> = ({ records, onSelectRecord }) => {
    const sortedRecords = [...records].sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());

    return (
        <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
                <Clock size={14} className="mr-2"/> Línea de Tiempo Clínica
            </h4>
            <div className="relative pl-4 space-y-6">
                <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-slate-100"></div>

                {sortedRecords.map((record, index) => (
                    <div key={record.id} className="relative group cursor-pointer" onClick={() => onSelectRecord(record)}>
                        <div className={`absolute -left-[1.35rem] top-1.5 w-3 h-3 rounded-full border-2 border-white z-10 transition-transform group-hover:scale-125 ${index === 0 ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-300'}`}></div>
                        <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-bold text-slate-400">{new Date(record.dateCreated).toLocaleDateString()}</span>
                                {record.status === 'FINALIZED' && <CheckCircle size={12} className="text-green-500"/>}
                            </div>
                            <h5 className="text-xs font-bold text-slate-700 truncate">{record.chiefComplaint || 'Consulta General'}</h5>
                            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{record.professionalName}</p>
                            <div className="flex items-center text-[9px] text-blue-600 font-bold mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                Ver Detalle <ChevronRight size={10} className="ml-1"/>
                            </div>
                        </div>
                    </div>
                ))}

                {sortedRecords.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-xs text-slate-400 italic">Sin antecedentes registrados.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
