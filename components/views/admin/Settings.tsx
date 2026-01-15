import React, { useState } from 'react';
import { RoleTemplate, TemplateSection, TemplateField } from '../../../types';
import { MOCK_TEMPLATES, MOCK_SECTION_LIBRARY, MOCK_FIELD_LIBRARY, roleLabels } from '../../../constants';
import { LayoutTemplate, Plus, Edit, Trash2, Layers, Database, Calculator } from 'lucide-react';

export const Settings: React.FC = () => {
    const [settingsTab, setSettingsTab] = useState<'TEMPLATES' | 'SECTIONS' | 'FIELDS'>('TEMPLATES');
    const [templates, setTemplates] = useState<RoleTemplate[]>(MOCK_TEMPLATES);
    const [globalSections, setGlobalSections] = useState<TemplateSection[]>(MOCK_SECTION_LIBRARY);
    const [globalFields, setGlobalFields] = useState<TemplateField[]>(MOCK_FIELD_LIBRARY);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-slate-800">Configuración del Sistema</h2>
            </div>
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
};
