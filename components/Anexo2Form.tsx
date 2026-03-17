import React from 'react';
import { FileText, Printer, X } from 'lucide-react';

interface Anexo2FormProps {
    patient: any;
    onClose: () => void;
}

export const Anexo2Form: React.FC<Anexo2FormProps> = ({ patient, onClose }) => {
    const handlePrintReferral = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return alert("Permita popups");

        const html = `
            <html>
                <head>
                    <title>Anexo 2 - Remisión</title>
                    <style>
                        body { font-family: sans-serif; padding: 40px; }
                        .header { text-align: center; border-bottom: 2px solid black; padding-bottom: 20px; }
                        .section { margin-top: 20px; border: 1px solid #ccc; padding: 15px; }
                        .title { font-weight: bold; background: #f0f0f0; padding: 5px; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>ANEXO TÉCNICO No. 2</h2>
                        <h3>INFORME DE ATENCIÓN INICIAL DE URGENCIAS Y REMISIÓN</h3>
                    </div>
                    <div class="section">
                        <div class="title">INFORMACIÓN DEL PACIENTE</div>
                        <p>Nombre: ${patient.fullName}</p>
                        <p>Identificación: ${patient.identification}</p>
                        <p>Fecha Nacimiento: ${patient.birthDate}</p>
                    </div>
                    <div class="section">
                        <div class="title">MOTIVO DE REMISIÓN</div>
                        <p style="height: 100px; border: 1px solid #eee;"></p>
                    </div>
                    <div class="section">
                        <div class="title">PROFESIONAL QUE REMITE</div>
                        <p>Nombre: __________________________</p>
                        <p>Registro Médico: ___________________</p>
                    </div>
                    <script>window.print();</script>
                </body>
            </html>
        `;
        printWindow.document.write(html);
        printWindow.document.close();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h3 className="text-xl font-bold text-slate-800 flex items-center">
                        <FileText className="mr-2 text-blue-600"/> Anexo 2: Remisión a Especialista
                    </h3>
                    <button onClick={onClose}><X size={20}/></button>
                </div>

                <div className="space-y-4 mb-8">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-xs font-bold text-slate-500 uppercase mb-2">Resumen de Paciente</p>
                        <p className="text-sm font-bold">{patient.fullName}</p>
                        <p className="text-xs text-slate-600">{patient.identification} | {patient.insuranceType}</p>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500">Observaciones / Justificación Médica</label>
                        <textarea className="w-full border p-3 rounded-lg text-sm h-32 mt-1" placeholder="Describa el motivo clínico de la remisión..."></textarea>
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 text-slate-600 font-medium">Cancelar</button>
                    <button onClick={handlePrintReferral} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold flex items-center hover:bg-blue-700 transition-colors">
                        <Printer size={18} className="mr-2"/> Imprimir Anexo
                    </button>
                </div>
            </div>
        </div>
    );
};
