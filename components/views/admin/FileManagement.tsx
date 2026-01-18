import React, { useState } from 'react';
import { Download, Trash2, Upload } from 'lucide-react';
import { MOCK_USERS, MOCK_PAYMENT_REQUESTS } from '../../../constants';

export const FileManagement: React.FC = () => {
    const [fileManagementTab, setFileManagementTab] = useState<'CONTRACTS' | 'PAYMENTS'>('CONTRACTS');
    const [users, setUsers] = useState(MOCK_USERS);
    const [paymentRequests, setPaymentRequests] = useState(MOCK_PAYMENT_REQUESTS);
    const [isUploading, setIsUploading] = useState(false);

    const [isDownloading, setIsDownloading] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    const handleFileUpload = () => {
        setIsUploading(true);
        setTimeout(() => {
            alert('Archivo subido con éxito (simulado).');
            setIsUploading(false);
        }, 1500);
    };

    const handleFileDownload = (fileId: string) => {
        setIsDownloading(fileId);
        setTimeout(() => {
            alert(`Descargando archivo ${fileId}...`);
            setIsDownloading(null);
        }, 1500);
    };

    const handleFileDelete = (fileId: string) => {
        setIsDeleting(fileId);
        setTimeout(() => {
            alert(`Eliminando archivo ${fileId}...`);
            setIsDeleting(null);
        }, 1500);
    };

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
                    <button onClick={handleFileUpload} disabled={isUploading} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center hover:bg-blue-700 disabled:bg-blue-400">
                        <Upload size={16} className="mr-2"/> {isUploading ? 'Subiendo...' : 'Subir Archivo'}
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
                        {(fileManagementTab === 'CONTRACTS'
                            ? users.flatMap(u => u.contracts?.map(c => ({ ...c, userName: u.name })))
                            : paymentRequests.filter(p => p.paymentReceiptUrl).map(p => ({ ...p, fileUrl: p.paymentReceiptUrl })))
                            .map((file: any) => (
                                <tr key={file.id}>
                                    <td className="p-3 font-medium text-slate-700">{file.fileUrl || `contrato_${file.id}.pdf`}</td>
                                    <td className="p-3">{file.userName}</td>
                                    <td className="p-3 text-slate-500">{new Date(file.startDate || file.dateSubmitted).toLocaleDateString()}</td>
                                    <td className="p-3 text-right">
                                        <button onClick={() => handleFileDownload(file.id)} disabled={isDownloading === file.id} className="p-1.5 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-50">
                                            {isDownloading === file.id ? '...' : <Download size={14}/>}
                                        </button>
                                        <button onClick={() => handleFileDelete(file.id)} disabled={isDeleting === file.id} className="p-1.5 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-50">
                                            {isDeleting === file.id ? '...' : <Trash2 size={14}/>}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};
