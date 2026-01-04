
import React, { useState } from 'react';
import { Briefcase, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';

interface AuthViewProps {
  onLogin: (userData: any) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (isLogin) {
      // Simulação de Login
      const storedUser = localStorage.getItem('gp_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.email === formData.email && user.password === formData.password) {
          onLogin(user);
        } else {
          setError('E-mail ou senha incorretos.');
        }
      } else {
        setError('Usuário não encontrado. Cadastre-se primeiro!');
      }
    } else {
      // Simulação de Cadastro
      localStorage.setItem('gp_user', JSON.stringify(formData));
      onLogin(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo Section */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-indigo-900 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl rotate-12 hover:rotate-0 transition-transform duration-500">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-indigo-900 tracking-tighter">Gestor Pro</h1>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-1">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span>Sua empresa em suas mãos</span>
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-gray-100 space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-black text-indigo-900 uppercase tracking-tight">
              {isLogin ? 'Bem-vindo de volta' : 'Criar nova conta'}
            </h2>
            <p className="text-gray-400 text-xs font-medium mt-1">
              {isLogin ? 'Entre com suas credenciais' : 'Preencha os dados abaixo'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input 
                    type="text"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="João Silva"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1 text-left">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input 
                  type="email"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input 
                  type="password"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-[10px] font-bold text-center animate-shake">{error}</p>}

            <button 
              type="submit"
              className="w-full bg-indigo-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <span>{isLogin ? 'Acessar Painel' : 'Finalizar Cadastro'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça Login'}
            </button>
          </div>
        </div>

        <p className="text-center text-[9px] text-gray-300 font-bold uppercase tracking-[0.3em]">
          Gestor Pro • Enterprise 2.4.0
        </p>
      </div>
    </div>
  );
};
