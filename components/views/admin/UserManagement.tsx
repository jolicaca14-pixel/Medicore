import React, { useState } from 'react';
import { User, UserRole } from '../../../types';
import { MOCK_USERS } from '../../../constants';
import { Plus, Edit } from 'lucide-react';
import { UserForm } from '../../UserForm';

const roleLabels: Record<UserRole, string> = {
    [UserRole.ADMIN]: 'Administrador',
    [UserRole.PROFESSIONAL]: 'Profesional Salud',
    [UserRole.BACTERIOLOGIST]: 'Bacteriólogo (Lab)',
    [UserRole.RADIOLOGIST]: 'Radiólogo (Img)',
    [UserRole.SECRETARY]: 'Secretaria / Admisiones',
    [UserRole.PSYCHOLOGIST]: 'Psicólogo'
};

export const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<Partial<User>>({});

    const handleEditUser = (user: User) => {
        setCurrentUser({ ...user });
        setIsUserModalOpen(true);
    };

    const handleAddNewUser = () => {
        setCurrentUser({ id: `u${Date.now()}`, roles: [UserRole.PROFESSIONAL], status: 'ACTIVE', name: '', username: '' });
        setIsUserModalOpen(true);
    };

    const handleSaveUser = () => {
        if (!currentUser.firstName || !currentUser.lastName || !currentUser.username || !currentUser.documentNumber) { alert("Complete nombres, apellidos, usuario y documento."); return; }

        if (!currentUser.roles || currentUser.roles.length === 0) {
            alert("El usuario debe tener al menos un rol asignado.");
            return;
        }

        if (currentUser.roles.some(r => r === UserRole.PROFESSIONAL || r === UserRole.BACTERIOLOGIST || r === UserRole.RADIOLOGIST)) {
            if (!currentUser.professionalLicense) {
                alert("Para roles asistenciales, el Registro Médico/Profesional es obligatorio.");
                return;
            }
        }

        const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
        const userToSave = { ...currentUser, name: fullName } as User;

        if (users.some(u => u.id === userToSave.id)) {
            setUsers(prev => prev.map(u => u.id === userToSave.id ? userToSave : u));
        } else {
            setUsers(prev => [...prev, userToSave]);
        }
        setIsUserModalOpen(false);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {isUserModalOpen && (
              <UserForm
                user={currentUser}
                onSave={handleSaveUser}
                onCancel={() => setIsUserModalOpen(false)}
              />
            )}

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800">Directorio de Usuarios</h3>
                <button onClick={handleAddNewUser} className="px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center"><Plus size={14} className="mr-1"/> Agregar</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="py-3 px-4">Documento</th>
                                <th className="py-3 px-4">Nombre Completo</th>
                                <th className="py-3 px-4">Roles</th>
                                <th className="py-3 px-4">Info Profesional</th>
                                <th className="py-3 px-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50">
                                    <td className="py-3 px-4">
                                        <div className="font-bold text-slate-700">{u.documentNumber}</div>
                                        <div className="font-mono text-xs text-slate-400">@{u.username}</div>
                                    </td>
                                    <td className="py-3 px-4 font-bold text-slate-700">{u.name}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            {u.roles?.map(r => <span key={r} className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">{roleLabels[r] || r}</span>)}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        {u.roles.some(r => r === UserRole.PROFESSIONAL || r === UserRole.BACTERIOLOGIST || r === UserRole.RADIOLOGIST) ? (
                                            <div className="text-xs">
                                                <p><span className="font-bold">Lic:</span> {u.professionalLicense || 'N/A'}</p>
                                                {u.digitalStampUrl && <span className="text-[9px] text-green-600 bg-green-50 px-1 rounded">Firma OK</span>}
                                            </div>
                                        ) : <span className="text-xs text-slate-400">-</span>}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <button onClick={() => handleEditUser(u)} className="p-1 text-slate-400 hover:text-blue-600"><Edit size={16}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
