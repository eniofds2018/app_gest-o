
import React from 'react';
import { Plus, TrendingUp, Users, ClipboardList, Wallet } from 'lucide-react';

interface SummaryCardProps {
  stats?: {
    pedidos: number;
    clientes: number;
    financeiro: number;
  };
  onAddClick: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ stats, onAddClick }) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const hasData = stats && (stats.pedidos > 0 || stats.clientes > 0 || stats.financeiro !== 0);

  if (!hasData) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center space-y-4 border border-dashed border-gray-200 shadow-sm">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
          <TrendingUp className="w-8 h-8 text-gray-200" />
        </div>
        <div className="space-y-1">
          <h3 className="text-gray-900 font-bold">Seu resumo está vazio</h3>
          <p className="text-gray-400 text-xs px-6">Comece a cadastrar suas movimentações para ver a saúde do seu negócio aqui.</p>
        </div>
        <button 
          onClick={onAddClick}
          className="bg-indigo-700 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Iniciar Agora</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-indigo-950 to-indigo-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
        
        <div className="flex justify-between items-start relative z-10">
          <div className="space-y-1">
            <p className="text-indigo-300 text-[10px] font-black uppercase tracking-[0.2em]">Saldo em Caixa</p>
            <h2 className="text-3xl font-black tracking-tight">
              {formatCurrency(stats!.financeiro)}
            </h2>
          </div>
          <button 
            onClick={onAddClick}
            className="p-3 bg-lime-400 text-indigo-950 rounded-2xl shadow-lg active:scale-90 transition-transform"
          >
            <Plus className="w-6 h-6" strokeWidth={3} />
          </button>
        </div>

        <div className="mt-6 flex items-center space-x-2 relative z-10">
          <div className="flex items-center space-x-1 bg-white/10 px-2 py-1 rounded-full border border-white/5">
            <TrendingUp className="w-3 h-3 text-lime-400" />
            <span className="text-[10px] font-bold text-lime-400">+12% hoje</span>
          </div>
          <p className="text-indigo-300/60 text-[9px] font-medium italic">Atualizado agora mesmo</p>
        </div>
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
            <ClipboardList className="w-5 h-5 text-orange-500" />
          </div>
          <div className="text-left">
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Pedidos</p>
            <p className="text-lg font-black text-indigo-950 leading-none">{stats!.pedidos}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="text-left">
            <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mb-1">Clientes</p>
            <p className="text-lg font-black text-indigo-950 leading-none">{stats!.clientes}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
