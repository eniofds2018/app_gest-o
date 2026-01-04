
import React, { useState } from 'react';
import { UserPlus, Users, Search, X, Mail, Phone, User } from 'lucide-react';

interface ClientesViewProps {
  data: any[];
  setData: (data: any[]) => void;
}

export const ClientesView: React.FC<ClientesViewProps> = ({ data, setData }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    const newCliente = { id: Date.now(), ...formData };
    setData([newCliente, ...data]);
    setIsFormOpen(false);
    setFormData({ name: '', phone: '', email: '' });
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input 
          type="text" 
          placeholder="Buscar clientes..." 
          className="w-full bg-white border border-gray-100 rounded-xl px-11 py-4 text-sm shadow-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
            <Users className="w-12 h-12 text-gray-200" />
          </div>
          <p className="text-gray-400 text-sm">Nenhum cliente cadastrado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map(cliente => (
            <div key={cliente.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-indigo-900">{cliente.name}</p>
                <p className="text-xs text-gray-500">{cliente.phone || 'Sem telefone'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-t-3xl p-6 space-y-6 animate-slide-up">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-indigo-900">Novo Cliente</h2>
              <button onClick={() => setIsFormOpen(false)}><X className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Nome Completo</label>
                <input 
                  type="text" required
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">WhatsApp</label>
                <input 
                  type="tel"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <button className="w-full bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform">
                Cadastrar Cliente
              </button>
            </form>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[416px] bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-2xl flex items-center justify-center space-x-2 active:scale-95 transition-all"
      >
        <UserPlus className="w-5 h-5" />
        <span>Novo Cliente</span>
      </button>
    </div>
  );
};
