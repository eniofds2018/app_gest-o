
import React, { useState } from 'react';
import { FileText, Plus, X, Search } from 'lucide-react';

interface ServicosViewProps {
  data: any[];
  setData: (data: any[]) => void;
}

export const ServicosView: React.FC<ServicosViewProps> = ({ data, setData }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setData([...data, { id: Date.now(), ...formData, price: parseFloat(formData.price) || 0 }]);
    setIsFormOpen(false);
    setFormData({ name: '', price: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-gray-800">Seus Serviços</h3>
        <button onClick={() => setIsFormOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold active:scale-95 shadow-md">
          Cadastrar
        </button>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <FileText className="w-12 h-12 text-gray-200" />
          <p className="text-gray-400 text-sm">Nenhum serviço cadastrado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map(serv => (
            <div key={serv.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex justify-between items-center">
              <span className="font-bold text-indigo-900">{serv.name}</span>
              <span className="font-bold text-indigo-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(serv.price)}
              </span>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-sm rounded-t-3xl p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-indigo-900">Novo Serviço</h2>
              <button onClick={() => setIsFormOpen(false)}><X className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input 
                placeholder="Nome do Serviço" required
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="number" placeholder="Preço Sugerido"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
              <button className="w-full bg-indigo-700 text-white font-bold py-4 rounded-xl">Salvar Serviço</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
