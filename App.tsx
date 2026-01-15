import React, { useState } from 'react';
import { User, UserRole } from './types';
import { MOCK_USERS } from './constants';
import { Layout } from './components/Layout';
import { ProfessionalView } from './components/views/ProfessionalView';
import { AdminView } from './components/views/AdminView';
import { SecretaryView } from './components/views/SecretaryView';
import { DiagnosticView } from './components/views/DiagnosticView';

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

// Simple Login Component
const Login: React.FC<{ onLogin: (u: User) => void }> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Verify user from mock
    const user = MOCK_USERS.find(u => u.username === username);
    
    // 🛡️ SENTINEL: Using document number as a password for mock data.
    // This is not secure for production but removes the hardcoded password vulnerability.
    // TODO: Implement a secure authentication mechanism (e.g., OAuth, password hashing).
    if (user && password === user.documentNumber) {
      onLogin(user);
    } else {
      setError('Credenciales inválidas. Use el número de documento como contraseña.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-8 text-center">
           <div className="w-16 h-16 bg-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.18 0l2.9 2.27c.12.1.27.17.42.25"/></svg>
           </div>
           <h1 className="text-2xl font-bold text-white">MediCore Pro</h1>
           <p className="text-blue-200 text-sm mt-1">Historia Clínica Electrónica Segura</p>
        </div>
        <form onSubmit={handleLogin} className="p-8 space-y-5">
           <div>
             <label className="block text-sm font-semibold text-slate-700 mb-1">Usuario</label>
             <input 
               className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
               type="text" 
               value={username}
               onChange={(e) => setUsername(e.target.value)}
               placeholder="ej. doc_elena, admin, sarah_sec"
             />
           </div>
           <div>
             <label htmlFor="password-input" className="block text-sm font-semibold text-slate-700 mb-1">Contraseña</label>
             <div className="relative">
               <input
                 id="password-input"
                 className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all pr-10"
                 type={showPassword ? 'text' : 'password'}
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 placeholder="Use document number"
               />
               <button
                  type="button"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
             </div>
           </div>
           
           {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

           <button 
             type="submit"
             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-blue-200 transition-all"
           >
             Inicio de Sesión Seguro
           </button>
           
           <div className="text-center text-xs text-slate-400 pt-4">
             'doc_elena' (Médico) | 'psicologa' (Psi)<br/>
             'admin' (Admin) | 'sarah_sec' (Sec)
           </div>
        </form>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // API Key Check
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
           <div className="w-16 h-16 bg-red-500 rounded-xl mx-auto mb-4 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
           </div>
           <h1 className="text-2xl font-bold text-red-700">Error de Configuración</h1>
           <p className="text-slate-600 mt-2">
            La clave API de Gemini (VITE_GEMINI_API_KEY) no está configurada en su archivo <code>.env.local</code>.
           </p>
           <p className="text-xs text-slate-400 mt-4">
            Por favor, siga las instrucciones en el archivo README.md para configurar su clave y habilitar las funciones de IA.
           </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // If user is Secretary, bypass standard layout logic in some cases or use a specialized one
  if (user.roles.includes(UserRole.SECRETARY)) {
      return <SecretaryView user={user} onLogout={() => setUser(null)} />
  }

  return (
    <Layout user={user} onLogout={() => setUser(null)} activeTab={activeTab} setActiveTab={setActiveTab}>
      {user.roles.includes(UserRole.PROFESSIONAL) && <ProfessionalView user={user} onLogout={() => setUser(null)} activeTab={activeTab} />}
      
      {/* Pass activeTab and setter to AdminView for navigation control */}
      {user.roles.includes(UserRole.ADMIN) && <AdminView activeTab={activeTab} setActiveTab={setActiveTab} currentUserSession={user} />}
      
      {(user.roles.includes(UserRole.BACTERIOLOGIST) || user.roles.includes(UserRole.RADIOLOGIST)) && <DiagnosticView user={user} onLogout={() => setUser(null)} />}
    </Layout>
  );
};

export default App;