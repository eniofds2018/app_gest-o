
import React, { useState } from 'react';
import { Package, Plus, X, Search, Tag } from 'lucide-react';

interface EstoqueViewProps {
  data: any[];
  setData: (data: any[]) => void;
}

export const EstoqueView: React.FC<EstoqueViewProps> = ({ data, setData }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', qty: '', price: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setData([...data, { id: Date.now(), ...formData, qty: parseInt(formData.qty) || 0, price: parseFloat(formData.price) || 0 }]);
    setIsFormOpen(false);
    setFormData({ name: '', qty: '', price: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" placeholder="Buscar no estoque..."
            className="w-full bg-white border border-gray-100 rounded-xl px-11 py-3 text-sm shadow-sm outline-none"
          />
        </div>
        <button onClick={() => setIsFormOpen(true)} className="bg-indigo-700 text-white p-3 rounded-xl shadow-md active:scale-90">
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <Package className="w-12 h-12 text-gray-200" />
          <p className="text-gray-400 text-sm">Estoque vazio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {data.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Tag className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="font-bold text-indigo-900 text-sm line-clamp-1">{item.name}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Qtd: {item.qty}</p>
              </div>
              <p className="font-bold text-indigo-600 text-xs">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
              </p>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-t-3xl p-6 space-y-6 animate-slide-up">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-indigo-900">Novo Item</h2>
              <button onClick={() => setIsFormOpen(false)}><X className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <input 
                placeholder="Nome da Peça / Item" required
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="number" placeholder="Quantidade"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none"
                  value={formData.qty}
                  onChange={e => setFormData({...formData, qty: e.target.value})}
                />
                <input 
                  type="number" step="0.01" placeholder="Preço"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <button className="w-full bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg active:scale-95">Salvar no Estoque</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
