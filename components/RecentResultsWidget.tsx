import React, { useMemo, useState } from 'react';
import { Patient, ClinicalRecord, RecordType } from '../types';
import { MOCK_SECTION_LIBRARY } from '../constants';
import { TestTube, Image, ChevronDown, ArrowLeftCircle } from 'lucide-react';

interface RecentResultsWidgetProps {
    selectedPatient: Patient | null;
    records: ClinicalRecord[];
    viewMode: 'LIST' | 'CREATE' | 'VIEW';
    handleImportResult: (result: ClinicalRecord) => void;
}

const RecentResultsWidget: React.FC<RecentResultsWidgetProps> = ({ selectedPatient, records, viewMode, handleImportResult }) => {
    const [expandedResultId, setExpandedResultId] = useState<string | null>(null);
    // Bolt ⚡: Memoize recent results to prevent re-filtering on every render.
    // This calculation can become expensive if the patient has a long record history.
    // The dependency array ensures it only recalculates when records or the selected patient change.
    const results = useMemo(() => {
        if (!selectedPatient) return [];
        return records
            .filter(r =>
                r.patientId === selectedPatient.id &&
                (r.recordType === RecordType.LAB_RESULT || r.recordType === RecordType.IMAGING_REPORT)
            )
            .sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
    }, [records, selectedPatient]);

    if (results.length === 0) return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
            <h4 className="font-bold text-slate-500 text-sm mb-2 flex items-center">
                <TestTube size={16} className="mr-2" /> Apoyo Diagnóstico
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
                        <ArrowLeftCircle size={14} className="mr-1" /> Incorporar a Historia
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 shadow-sm">
            <h4 className="font-bold text-blue-800 text-sm mb-3 flex items-center">
                <TestTube size={16} className="mr-2" /> Resultados Recientes
                <span className="ml-auto text-[10px] bg-blue-200 text-blue-800 px-2 rounded-full">{results.length}</span>
            </h4>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                {results.map(r => (
                    <div key={r.id} className="border border-blue-100 bg-white rounded-lg p-2 shadow-sm">
                        <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedResultId(expandedResultId === r.id ? null : r.id)}>
                            <div className="flex items-center overflow-hidden">
                                {r.recordType === RecordType.LAB_RESULT ? <TestTube size={14} className="text-purple-500 mr-2 flex-shrink-0" /> : <Image size={14} className="text-orange-500 mr-2 flex-shrink-0" />}
                                <div className="truncate">
                                    <p className="font-bold text-xs text-slate-700 truncate">{r.chiefComplaint}</p>
                                    <p className="text-[10px] text-slate-500">{new Date(r.dateCreated).toLocaleDateString()} ({new Date(r.dateCreated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</p>
                                </div>
                            </div>
                            <ChevronDown size={14} className={`text-slate-400 transition-transform flex-shrink-0 ${expandedResultId === r.id ? 'rotate-180' : ''}`} />
                        </div>
                        {expandedResultId === r.id && renderResultDetails(r)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default React.memo(RecentResultsWidget);
