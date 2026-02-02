import React, { useState } from 'react';
import { Lock, Loader2, AlertCircle } from 'lucide-react';
import { loginAdmin } from '../services/firebaseService';

interface LoginProps { onLoginSuccess: () => void; }

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await loginAdmin(email, password);
      // El cambio de estado se maneja en App.tsx vía onAuthStateChanged
      // pero llamamos a success para forzar cualquier actualización necesaria
      onLoginSuccess();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Correo o contraseña incorrectos.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Intente más tarde.');
      } else {
        setError('Error de conexión con el servidor.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in bg-white p-4">
      <div className="w-full max-w-sm p-8 text-center bg-white border border-gray-100 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-navy-900"></div>
        <div className="mb-6 flex justify-center">
            <div className="bg-slate-50 p-4 rounded-full">
                <Lock className="text-navy-900" size={24} />
            </div>
        </div>
        <h2 className="text-2xl font-serif text-black tracking-widest uppercase mb-2">Panel Administrativo</h2>
        <p className="text-xs text-gray-400 mb-8 uppercase tracking-wider">Acceso Restringido</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
             <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Correo Electrónico</label>
             <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full border-b border-gray-300 py-3 px-2 focus:border-navy-900 outline-none bg-transparent text-black transition-colors" 
                placeholder="admin@soberano.com" 
                required
             />
          </div>
          
          <div className="text-left">
             <label className="text-[10px] font-bold uppercase text-gray-500 ml-1">Contraseña</label>
             <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full border-b border-gray-300 py-3 px-2 focus:border-navy-900 outline-none bg-transparent text-black transition-colors" 
                placeholder="••••••••" 
                required
             />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs bg-red-50 p-3 rounded text-left">
                <AlertCircle size={14} className="shrink-0" />
                {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-navy-900 text-white py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-navy-800 transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'INGRESAR'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;