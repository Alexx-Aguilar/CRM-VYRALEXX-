import React, { useState } from 'react';
import { LockKeyhole, Mail, ShieldCheck, LoaderCircle } from 'lucide-react';
import { api } from '../services/api.js';
import { User } from '../types/index.js';

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      onLogin(await api.login(email, password));
    } catch (reason: any) {
      setError(reason.message || 'No se pudo iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#10101B] flex items-center justify-center px-6 py-10 relative overflow-hidden">
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#8B3DFF]/20 blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#EC4899]/15 blur-3xl" />
      <section className="glass-card-static w-full max-w-md rounded-3xl p-8 relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl gradient-primary-btn flex items-center justify-center shadow-lg shadow-[#8B3DFF]/25">
            <ShieldCheck size={32} className="text-white" />
          </div>
        </div>
        <div className="text-center mb-8">
          <p className="text-2xl font-extrabold gradient-brand-text">VYRALEXX</p>
          <h1 className="text-xl font-bold text-white mt-4">Bienvenido de nuevo</h1>
          <p className="text-sm text-[#A1A1B5] mt-2">Ingresa para administrar tu CRM</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold text-[#A1A1B5]">Correo electrónico</span>
            <div className="relative mt-1.5">
              <Mail size={16} className="absolute left-3 top-3 text-[#A855F7]" />
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-3 rounded-xl glass-input text-sm" placeholder="admin@vyralexx.com" />
            </div>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-[#A1A1B5]">Contraseña</span>
            <div className="relative mt-1.5">
              <LockKeyhole size={16} className="absolute left-3 top-3 text-[#A855F7]" />
              <input required minLength={8} type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-10 pr-3 py-3 rounded-xl glass-input text-sm" placeholder="••••••••" />
            </div>
          </label>
          {error && <p className="text-xs text-[#FB7185] bg-[#FB7185]/10 border border-[#FB7185]/20 rounded-xl p-3">{error}</p>}
          <button disabled={isLoading} type="submit" className="w-full py-3 rounded-xl gradient-primary-btn text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">
            {isLoading && <LoaderCircle size={16} className="animate-spin" />}
            {isLoading ? 'Validando...' : 'Iniciar sesión'}
          </button>
        </form>
      </section>
    </main>
  );
};
