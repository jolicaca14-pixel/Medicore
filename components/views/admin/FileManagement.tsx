import React, { useState } from 'react';
import { User, Contract, PaymentRequest } from '../../../types';
import { MOCK_USERS, MOCK_PAYMENT_REQUESTS } from '../../../constants';
import { Upload, Download, Trash2 } from 'lucide-react';

// Definimos un tipo unificado para los archivos que vamos a gestionar
type ManagedFile = {
    id: string;
    fileUrl: string;
    userName: string;
    date: string;
    type: 'CONTRACT' | 'PAYMENT';
};

export const FileManagement: React.FC = () => {
    const [fileManagementTab, setFileManagementTab] = useState<'CONTRACTS' | 'PAYMENTS'>('CONTRACTS');

    // Estado unificado para los archivos
    const [files, setFiles] = useState<ManagedFile[]>(() => {
        const contractFiles: ManagedFile[] = MOCK_USERS.flatMap(u =>
            u.contracts?.map(c => ({
                id: c.id,
                fileUrl: c.fileUrl || `contrato_${c.id}.pdf`,
                userName: u.name,
                date: c.startDate,
                type: 'CONTRACT',
            })) || []
        );

        const paymentFiles: ManagedFile[] = MOCK_PAYMENT_REQUESTS.filter(p => p.paymentReceiptUrl).map(p => ({
            id: p.id,
            fileUrl: p.paymentReceiptUrl!,
            userName: p.userName,
            date: p.dateSubmitted,
            type: 'PAYMENT',
        }));

        return [...contractFiles, ...paymentFiles];
    });

    const handleUploadFile = () => {
        const newFile: ManagedFile = {
            id: `file-${Date.now()}`,
            fileUrl: `nuevo_documento_${Date.now()}.pdf`,
            userName: 'Admin', // O el usuario actual
            date: new Date().toISOString(),
            type: fileManagementTab === 'CONTRACTS' ? 'CONTRACT' : 'PAYMENT',
        };
        setFiles(prev => [...prev, newFile]);
        alert(`'${newFile.fileUrl}' subido exitosamente.`);
    };

    const handleDeleteFile = (fileId: string) => {
        if(window.confirm("¿Está seguro de que desea eliminar este archivo? Esta acción no se puede deshacer.")) {
            setFiles(prev => prev.filter(f => f.id !== fileId));
        }
    };


    const filteredFiles = files.filter(f => f.type === (fileManagementTab === 'CONTRACTS' ? 'CONTRACT' : 'PAYMENT'));

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Gestión de Archivos</h2>
            <div className="flex space-x-1 bg-white p-1 rounded-lg border border-slate-200 w-fit">
                <button onClick={() => setFileManagementTab('CONTRACTS')} className={`px-4 py-2 rounded-md text-sm font-bold ${fileManagementTab === 'CONTRACTS' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>
                    Contratos
                </button>
                <button onClick={() => setFileManagementTab('PAYMENTS')} className={`px-4 py-2 rounded-md text-sm font-bold ${fileManagementTab === 'PAYMENTS' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>
                    Soportes de Pago
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-800">
                        {fileManagementTab === 'CONTRACTS' ? 'Archivos de Contratos' : 'Archivos de Soportes de Pago'}
                    </h3>
                    <button onClick={handleUploadFile} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center hover:bg-blue-700">
                        <Upload size={16} className="mr-2" /> Subir Archivo
                    </button>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                            <th className="p-3">Nombre del Archivo</th>
                            <th className="p-3">Usuario</th>
                            <th className="p-3">Fecha de Subida</th>
                            <th className="p-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredFiles.map((file) => (
                            <tr key={file.id}>
                                <td className="p-3 font-medium text-slate-700">{file.fileUrl}</td>
                                <td className="p-3">{file.userName}</td>
                                <td className="p-3 text-slate-500">{new Date(file.date).toLocaleDateString()}</td>
                                <td className="p-3 text-right">
                                    <button onClick={() => alert('Descargando archivo...')} className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><Download size={14} /></button>
                                    <button onClick={() => handleDeleteFile(file.id)} className="p-1.5 hover:bg-slate-200 rounded text-slate-500"><Trash2 size={14} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}