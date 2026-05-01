import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { sanitizeInput } from '../utils/security';
import { Shield, CheckCircle, UploadCloud, Trash2 } from 'lucide-react';
import { useToast } from './Toast';

const roleLabels: { [key in UserRole]: string } = {
  [UserRole.ADMIN]: 'Administrador',
  [UserRole.PROFESSIONAL]: 'Profesional de Salud',
  [UserRole.BACTERIOLOGIST]: 'Bacteriólogo/a',
  [UserRole.RADIOLOGIST]: 'Radiólogo/a',
  [UserRole.SECRETARY]: 'Secretaría',
  [UserRole.PSYCHOLOGIST]: 'Psicólogo/a',
  [UserRole.NUTRITIONIST]: 'Nutricionista',
  [UserRole.ACCOUNTANT]: 'Contador/a',
  [UserRole.MANAGER]: 'Gerente'
};

interface UserFormProps {
  user: Partial<User>;
  onSave: (user: Partial<User>) => void;
  onCancel: () => void;
  isEmbedded?: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel, isEmbedded = false }) => {
  const { showToast } = useToast();
  const [currentUser, setCurrentUser] = useState<Partial<User>>(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const toggleUserRole = (role: UserRole) => {
    const currentRoles = currentUser.roles || [];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter((r) => r !== role)
      : [...currentRoles, role];
    setCurrentUser({ ...currentUser, roles: newRoles });
  };

  const handleSave = () => {
    if (!currentUser.firstName || !currentUser.lastName || !currentUser.username || !currentUser.documentNumber) {
      showToast('Complete nombres, apellidos, usuario y documento.', 'warning');
      return;
    }
    if (!currentUser.roles || currentUser.roles.length === 0) {
      showToast('El usuario debe tener al menos un rol asignado.', 'warning');
      return;
    }
    if (
      currentUser.roles.some(
        (r) =>
          r === UserRole.PROFESSIONAL ||
          r === UserRole.BACTERIOLOGIST ||
          r === UserRole.RADIOLOGIST
      )
    ) {
      if (!currentUser.professionalLicense) {
        showToast(
          'Para roles asistenciales, el Registro Médico/Profesional es obligatorio.',
          'warning'
        );
        return;
      }
    }
    onSave(currentUser);
  };

  const showProfessionalFields = currentUser.roles?.some(r => r === UserRole.PROFESSIONAL || r === UserRole.BACTERIOLOGIST || r === UserRole.RADIOLOGIST);

  const FormContent = () => (
    <>
      <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label htmlFor="user-form-document-number" className="text-xs font-bold text-slate-500">
              Número de Documento (Cédula) <span className="text-red-500">*</span>
            </label>
            <input
              id="user-form-document-number"
              className="w-full p-2 border rounded"
              placeholder="CC/DNI"
              value={currentUser.documentNumber || ''}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, documentNumber: sanitizeInput(e.target.value) })
              }
            />
            <p className="text-[10px] text-slate-400 mt-1">
              Este será la contraseña inicial del usuario.
            </p>
          </div>
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="user-form-first-name" className="text-xs font-bold text-slate-500">
              Nombres <span className="text-red-500">*</span>
            </label>
            <input
              id="user-form-first-name"
              className="w-full p-2 border rounded"
              value={currentUser.firstName || ''}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, firstName: sanitizeInput(e.target.value) })
              }
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="user-form-last-name" className="text-xs font-bold text-slate-500">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <input
              id="user-form-last-name"
              className="w-full p-2 border rounded"
              value={currentUser.lastName || ''}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, lastName: sanitizeInput(e.target.value) })
              }
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="user-form-username" className="text-xs font-bold text-slate-500">
              Usuario (Login) <span className="text-red-500">*</span>
            </label>
            <input
              id="user-form-username"
              className="w-full p-2 border rounded"
              value={currentUser.username || ''}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, username: sanitizeInput(e.target.value) })
              }
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="user-form-birth-date" className="text-xs font-bold text-slate-500">
              Fecha Nacimiento
            </label>
            <input
              id="user-form-birth-date"
              type="date"
              className="w-full p-2 border rounded"
              value={currentUser.birthDate || ''}
              onChange={(e) =>
                setCurrentUser({ ...currentUser, birthDate: e.target.value })
              }
            />
          </div>
          <div className="col-span-2 border-t pt-4">
            <label className="block text-sm font-semibold mb-3">
              Roles y Permisos
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(UserRole).map((role) => (
                <label
                  key={role}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                    currentUser.roles?.includes(role)
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={currentUser.roles?.includes(role) || false}
                    onChange={() => toggleUserRole(role)}
                    className="hidden"
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold">{roleLabels[role]}</span>
                    <span className="text-[9px] opacity-75">{role}</span>
                  </div>
                  {currentUser.roles?.includes(role) && (
                    <CheckCircle size={14} className="ml-auto text-blue-600" />
                  )}
                </label>
              ))}
            </div>
          </div>
          {showProfessionalFields && (
            <div className="col-span-2 border-t pt-4 mt-2 bg-slate-50 p-4 rounded-lg border border-slate-200 animate-in slide-in-from-top-2">
              <h4 className="font-bold text-sm text-slate-800 mb-2 flex items-center">
                <Shield size={16} className="mr-2 text-blue-600" />
                Credenciales Asistenciales
              </h4>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label htmlFor="user-form-license" className="text-xs font-bold text-slate-500">
                    Registro Médico / Licencia <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="user-form-license"
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Ej. MED-12345"
                    value={currentUser.professionalLicense || ''}
                    onChange={(e) =>
                      setCurrentUser({
                        ...currentUser,
                        professionalLicense: sanitizeInput(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="user-form-specialty" className="text-xs font-bold text-slate-500">
                    Especialidad
                  </label>
                  <input
                    id="user-form-specialty"
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Ej. Medicina General"
                    value={currentUser.specialty || ''}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser, specialty: sanitizeInput(e.target.value) })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">
                  Firma Digital (Imagen) <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-white cursor-pointer hover:bg-slate-50 transition-colors relative group">
                  {currentUser.digitalStampUrl ? (
                    <>
                      <div className="text-center">
                        <p className="text-green-600 font-bold text-sm flex items-center">
                          <CheckCircle size={14} className="mr-1" /> Firma Cargada
                        </p>
                        <p className="text-xs text-slate-400 mt-1 truncate max-w-xs">
                          {currentUser.digitalStampUrl}
                        </p>
                      </div>
                      <button
                        className="absolute top-2 right-2 p-1 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentUser({ ...currentUser, digitalStampUrl: '' });
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  ) : (
                    <div
                      className="text-center"
                      onClick={() =>
                        setCurrentUser({
                          ...currentUser,
                          digitalStampUrl: 'firma_simulada.png',
                        })
                      }
                    >
                      <UploadCloud
                        size={32}
                        className="text-slate-300 mb-2 mx-auto"
                      />
                      <p className="text-xs font-bold text-slate-500">
                        Click para cargar firma
                      </p>
                      <p className="text-[10px] text-slate-400">
                        PNG, JPG (Fondo transparente recomendado)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button onClick={onCancel} className="px-4 py-2 text-slate-600">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-slate-900 text-white rounded"
          >
            Guardar
          </button>
        </div>
    </>
  );

  if (isEmbedded) {
    return <FormContent />;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
         <h3 className="text-xl font-bold mb-4">
          {currentUser.id ? 'Editar Usuario' : 'Nuevo Usuario'}
        </h3>
        <FormContent />
      </div>
    </div>
  );
};