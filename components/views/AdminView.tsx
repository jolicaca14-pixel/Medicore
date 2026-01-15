import React from 'react';
import { User, UserRole } from '../../../types';
import { Ban } from 'lucide-react';
import { Dashboard } from './admin/Dashboard';
import { UserManagement } from './admin/UserManagement';
import { HRManagement } from './admin/HRManagement';
import { FileManagement } from './admin/FileManagement';
import { Reports } from './admin/Reports';
import { Settings } from './admin/Settings';

interface AdminViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUserSession?: User;
}

export const AdminView: React.FC<AdminViewProps> = ({ activeTab, setActiveTab, currentUserSession }) => {
  const isAdmin = currentUserSession?.roles.includes(UserRole.ADMIN);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400">
        <Ban size={64} className="mb-4 text-red-400"/>
        <h2 className="text-xl font-bold text-slate-700">Acceso Restringido</h2>
        <p className="text-sm">Se requieren permisos de ADMINISTRADOR para acceder a este módulo.</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'users':
        return <UserManagement />;
      case 'hr':
        return <HRManagement currentUserSession={currentUserSession} />;
      case 'files':
        return <FileManagement />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return <>{renderContent()}</>;
};
