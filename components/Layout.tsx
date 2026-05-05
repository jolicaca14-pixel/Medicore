import React, { useState } from 'react';
import { User, UserRole, AppNotification } from '../types';
import { MOCK_NOTIFICATIONS } from '../constants';
import { 
  LogOut, 
  LayoutDashboard, 
  Users, 
  FileText, 
  Stethoscope, 
  Settings,
  Calendar,
  TestTube,
  Library,
  DollarSign,
  Briefcase,
  Bell,
  X,
  ChevronRight,
  Image
} from 'lucide-react';

interface LayoutProps {
  user: User | null;
  onLogout: () => void;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ user, onLogout, children, activeTab, setActiveTab }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  if (!user) return <>{children}</>;

  const handleNotificationClick = (notif: AppNotification) => {
      if(notif.targetTab) {
          setActiveTab(notif.targetTab);
      }
      // Mark as read
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
      setIsNotifOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getMenuItems = () => {
    let items: any[] = [];
    const roles = user.roles || [];

    if (roles.includes(UserRole.ADMIN) || roles.includes(UserRole.MANAGER) || roles.includes(UserRole.ACCOUNTANT)) {
      items = [
        ...items,
        { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
        { id: 'hr', label: 'Talento Humano', icon: Briefcase },
        { id: 'reports', label: 'Gestión Financiera', icon: DollarSign },
      ];

      if (roles.includes(UserRole.ADMIN)) {
          items.push({ id: 'users', label: 'Gestión Usuarios', icon: Users });
          items.push({ id: 'files', label: 'Gestión Archivos', icon: FileText });
          items.push({ id: 'settings', label: 'Plantillas / Roles', icon: Settings });
      }
    }
    
    if (roles.includes(UserRole.PROFESSIONAL) || roles.includes(UserRole.PSYCHOLOGIST)) {
       // Avoid duplicates if admin already added dashboard
       if(!items.some(i => i.id === 'dashboard')) items.push({ id: 'dashboard', label: 'Mis Pacientes', icon: Users });
       items.push({ id: 'appointments', label: 'Agenda de Hoy', icon: Calendar });
       items.push({ id: 'records', label: 'Mis Historias', icon: FileText });
       // NEW: Allow Professional to see their own reports and HR
       if(!items.some(i => i.id === 'reports')) items.push({ id: 'reports', label: 'Mi Producción', icon: DollarSign });
       if(!items.some(i => i.id === 'hr')) items.push({ id: 'hr', label: 'Mi Contrato / RRHH', icon: Briefcase });
    }

    if (roles.includes(UserRole.SECRETARY)) {
       if(!items.some(i => i.id === 'dashboard')) items.push({ id: 'dashboard', label: 'Recepción', icon: Calendar });
       items.push({ id: 'patients', label: 'Registro Pacientes', icon: Users });
       items.push({ id: 'billing', label: 'Facturación/Cartera', icon: FileText });
    }

    if (roles.includes(UserRole.BACTERIOLOGIST)) {
       if(!items.some(i => i.id === 'dashboard')) items.push({ id: 'dashboard', label: 'Laboratorio', icon: TestTube });
       if(!items.some(i => i.id === 'hr')) items.push({ id: 'hr', label: 'Mi Contrato / RRHH', icon: Briefcase });
    }

    if (roles.includes(UserRole.RADIOLOGIST)) {
       if(!items.some(i => i.id === 'dashboard')) items.push({ id: 'dashboard', label: 'Imagenología', icon: Image });
       if(!items.some(i => i.id === 'hr')) items.push({ id: 'hr', label: 'Mi Contrato / RRHH', icon: Briefcase });
    }
    
    // Deduplicate by ID
    return items.filter((item, index, self) => 
       index === self.findIndex((t) => (t.id === item.id))
    );
  };

  const mapRoleToSpanish = (roles: UserRole[]) => {
      return roles.map(r => {
        switch(r) {
            case UserRole.ADMIN: return 'Admin';
            case UserRole.PROFESSIONAL: return 'Salud';
            case UserRole.SECRETARY: return 'Secr.';
            case UserRole.BACTERIOLOGIST: return 'Bact.';
            case UserRole.RADIOLOGIST: return 'Rad.';
            case UserRole.PSYCHOLOGIST: return 'Psi.';
            default: return r;
        }
      }).join(' / ');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
        <button
          className="p-6 border-b border-slate-100 flex items-center space-x-3 cursor-pointer hover:bg-slate-50 transition-colors w-full text-left"
          onClick={() => setActiveTab('dashboard')}
          aria-label="MediCore - Ir al Panel Principal"
        >
          <div className="bg-primary-600 p-2 rounded-lg text-white">
            <Stethoscope size={24} />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg tracking-tight">MediCore</h1>
            <p className="text-xs text-slate-500 font-medium">HCE Segura</p>
          </div>
        </button>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="mb-4 px-2">
            <p className="text-xs uppercase text-slate-400 font-semibold tracking-wider mb-2">Menú</p>
            {getMenuItems().map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={item.label}
                  aria-label={item.label}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-primary-600' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            className="w-full flex items-center space-x-3 px-2 py-3 mb-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 text-left"
            onClick={() => user.roles.includes(UserRole.ADMIN) && setActiveTab('settings')}
            aria-label={`Usuario: ${user.name}, Rol: ${mapRoleToSpanish(user.roles)}`}
          >
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{mapRoleToSpanish(user.roles)}</p>
            </div>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800 capitalize">
            {getMenuItems().find(i => i.id === activeTab)?.label || 'Panel Principal'}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full border border-primary-100">
              {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            
            {/* NOTIFICATIONS */}
            <div className="relative">
                <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative">
                    <Bell size={20} />
                    {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>}
                </button>
                {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                        <div className="p-3 border-b bg-slate-50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-700 text-sm">Notificaciones</h3>
                            <button onClick={() => setIsNotifOpen(false)}><X size={14} className="text-slate-400"/></button>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <p className="p-4 text-center text-xs text-slate-400">Sin notificaciones</p>
                            ) : (
                                notifications.map(n => (
                                    <div key={n.id} onClick={() => handleNotificationClick(n)} className={`p-3 border-b hover:bg-slate-50 cursor-pointer ${!n.read ? 'bg-blue-50/50' : ''}`}>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-[10px] px-1.5 rounded font-bold ${n.type === 'ALERT' ? 'bg-red-100 text-red-600' : (n.type === 'SUCCESS' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600')}`}>{n.type}</span>
                                            <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                                        </div>
                                        <h4 className="text-sm font-bold text-slate-800">{n.title}</h4>
                                        <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                                        {n.targetTab && (
                                            <div className="mt-2 flex items-center text-xs text-primary-600 font-bold">
                                                Ir a atender <ChevronRight size={12}/>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
          </div>
        </header>
        <div className="p-8 max-w-7xl mx-auto pb-20">
          {children}
        </div>
      </main>
    </div>
  );
};