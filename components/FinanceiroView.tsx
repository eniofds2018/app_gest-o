
import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, X, ArrowUpCircle, ArrowDownCircle, FileCheck } from 'lucide-react';

interface FinanceiroViewProps {
  data: any[];
  setData: (data: any[]) => void;
  onReceiptGenerated?: (receipt: any) => void;
  autoOpen?: boolean;
  initialType?: 'receita' | 'despesa';
  onCloseAutoOpen?: () => void;
}

export const FinanceiroView: React.FC<FinanceiroViewProps> = ({ data, setData, onReceiptGenerated, autoOpen, initialType, onCloseAutoOpen }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ description: '', value: '', type: 'receita', client: '' });

  useEffect(() => {
    if (autoOpen) {
      setIsFormOpen(true);
      if (initialType) setFormData(prev => ({ ...prev, type: initialType }));
      if (onCloseAutoOpen) onCloseAutoOpen();
    }
  }, [autoOpen, initialType, onCloseAutoOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.value) return;
    
    const valueNum = parseFloat(formData.value);
    const dateStr = new Date().toLocaleDateString('pt-BR');
    
    const newEntry = {
      id: Date.now(),
      ...formData,
      value: valueNum,
      date: dateStr
    };

    setData([newEntry, ...data]);

    if (formData.type === 'receita' && onReceiptGenerated) {
      onReceiptGenerated({
        id: `REC-${Date.now()}`,
        client: formData.client || 'Cliente não identificado',
        description: formData.description,
        value: valueNum,
        date: dateStr,
        timestamp: Date.now()
      });
    }

    setIsFormOpen(false);
    setFormData({ description: '', value: '', type: 'receita', client: '' });
  };

  const balance = data.reduce((acc, curr) => curr.type === 'receita' ? acc + curr.value : acc - curr.value, 0);

  return (
    <div className="space-y-6 pb-20">
      <div className="bg-indigo-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <p className="text-indigo-300 text-sm font-medium">Saldo Atual</p>
        <h2 className="text-3xl font-bold mt-1">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
        </h2>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Lançamentos Recentes</h3>
          {data.some(d => d.type === 'receita') && (
            <div className="flex items-center text-indigo-500 text-[10px] font-bold space-x-1">
              <FileCheck className="w-3 h-3" />
              <span>RECIBOS AUTOMÁTICOS</span>
            </div>
          )}
        </div>
        
        {data.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">Nenhum lançamento financeiro.</p>
          </div>
        ) : (
          data.map(entry => (
            <div key={entry.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center space-x-3 text-left">
                {entry.type === 'receita' ? <ArrowUpCircle className="text-green-500 w-5 h-5" /> : <ArrowDownCircle className="text-red-400 w-5 h-5" />}
                <div>
                  <p className="font-bold text-indigo-900 text-sm leading-tight">{entry.description}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{entry.date} {entry.client ? `• ${entry.client}` : ''}</p>
                </div>
              </div>
              <p className={`font-black ${entry.type === 'receita' ? 'text-green-600' : 'text-red-500'}`}>
                {entry.type === 'receita' ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.value)}
              </p>
            </div>
          ))
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-t-3xl p-6 space-y-6 animate-slide-up">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-indigo-900 uppercase">Novo Lançamento</h2>
              <button onClick={() => setIsFormOpen(false)}><X className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'receita'})}
                  className={`flex-1 py-3 rounded-lg text-xs font-black uppercase transition-all ${formData.type === 'receita' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-400'}`}
                >Recebimento</button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'despesa'})}
                  className={`flex-1 py-3 rounded-lg text-xs font-black uppercase transition-all ${formData.type === 'despesa' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-400'}`}
                >Pagamento</button>
              </div>
              
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Descrição / Referência</label>
                <input 
                  type="text" required
                  placeholder="Ex: Pagamento Aluguel"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none font-medium text-indigo-900"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              {formData.type === 'receita' && (
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cliente (para o recibo)</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none font-medium text-indigo-900"
                    placeholder="Nome do pagador"
                    value={formData.client}
                    onChange={e => setFormData({...formData, client: e.target.value})}
                  />
                </div>
              )}
              
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor</label>
                <input 
                  type="number" step="0.01" required
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none font-black text-indigo-900 text-lg"
                  placeholder="0,00"
                  value={formData.value}
                  onChange={e => setFormData({...formData, value: e.target.value})}
                />
              </div>
              
              <button className="w-full bg-indigo-700 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-transform uppercase tracking-widest text-xs">
                Confirmar Lançamento
              </button>
            </form>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[416px] bg-indigo-700 text-white font-black py-4 rounded-xl shadow-2xl flex items-center justify-center space-x-2 active:scale-95 transition-all uppercase tracking-widest text-xs"
      >
        <Plus className="w-5 h-5" />
        <span>Novo Lançamento Financeiro</span>
      </button>
    </div>
  );
};
