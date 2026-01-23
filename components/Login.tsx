import React, { useState } from 'react';
import { Lock } from 'lucide-react';

interface LoginProps { onLoginSuccess: () => void; }

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (['Jose', 'Lucas'].includes(username) && password === 'Soberano2026!') onLoginSuccess();
    else setError('Credenciales incorrectas.');
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in bg-white">
      <div className="w-full max-w-sm p-8 text-center bg-white border border-gray-100 shadow-xl">
        <h2 className="text-2xl font-serif text-black tracking-widest uppercase mb-8">Acceso Privado</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border-b border-gray-300 py-3 text-center focus:border-navy outline-none bg-transparent text-black" placeholder="Usuario" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-b border-gray-300 py-3 text-center focus:border-navy outline-none bg-transparent text-black" placeholder="Contraseña" />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" className="w-full bg-black text-white py-4 font-bold uppercase tracking-[0.2em] text-xs hover:bg-navy transition-colors">Ingresar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;