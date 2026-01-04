
import React from 'react';
import { ChevronDown, SlidersHorizontal, Info, BarChart3, TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';

interface GestaoViewProps {
  data: {
    pedidos: any[];
    financeiro: any[];
  };
}

const StatBar: React.FC<{ label: string; value: number; total: number; color: string }> = ({ label, value, total, color }) => {
  const percentage = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-500">
        <span>{label}</span>
        <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-500`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const AnalysisCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
    <div className="flex justify-between items-center">
      <h3 className="font-bold text-indigo-900 text-sm uppercase tracking-tight">{title}</h3>
      <Info className="w-4 h-4 text-gray-300" />
    </div>
    {children}
  </div>
);

export const GestaoView: React.FC<GestaoViewProps> = ({ data }) => {
  const financeiro = data.financeiro || [];
  
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Calculations
  const totalReceita = financeiro
    .filter(f => f.type === 'receita')
    .reduce((acc, curr) => acc + curr.value, 0);
    
  const totalDespesa = financeiro
    .filter(f => f.type === 'despesa')
    .reduce((acc, curr) => acc + curr.value, 0);

  const totalMovimentado = totalReceita + totalDespesa;
  const saldo = totalReceita - totalDespesa;
  const margemLucro = totalReceita > 0 ? (saldo / totalReceita) * 100 : 0;

  // Top Clients Analysis
  const clientRevenue: Record<string, number> = {};
  financeiro
    .filter(f => f.type === 'receita' && f.client)
    .forEach(f => {
      clientRevenue[f.client] = (clientRevenue[f.client] || 0) + f.value;
    });

  const topClients = Object.entries(clientRevenue)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-4 pb-24 text-left animate-fade-in">
      {/* Filter Section */}
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm cursor-pointer">
          <span className="text-xs text-gray-500">
            Período: <span className="font-bold text-indigo-900">Histórico Total</span>
          </span>
          <ChevronDown className="w-4 h-4 text-indigo-800" />
        </div>
        <button className="bg-white border border-indigo-100 p-3 rounded-xl shadow-sm text-indigo-800 active:scale-95 transition-all">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {financeiro.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center space-y-4 border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8 text-indigo-200" />
          </div>
          <p className="text-gray-400 text-sm">Cadastre lançamentos no Financeiro para visualizar a análise do seu negócio.</p>
        </div>
      ) : (
        <>
          {/* Summary Dashboard */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
              <div className="flex items-center space-x-1 text-green-500 mb-1">
                <TrendingUp className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase">Lucratividade</span>
              </div>
              <p className="text-2xl font-black text-indigo-900">{margemLucro.toFixed(1)}%</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Eficiência</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
              <div className="flex items-center space-x-1 text-indigo-500 mb-1">
                <BarChart3 className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase">Volume</span>
              </div>
              <p className="text-2xl font-black text-indigo-900">
                {new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(totalMovimentado)}
              </p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Movimentado</p>
            </div>
          </div>

          <AnalysisCard title="Receita x Despesa">
            <div className="space-y-4">
              <StatBar 
                label="Entradas (Receitas)" 
                value={totalReceita} 
                total={totalMovimentado} 
                color="bg-green-500" 
              />
              <StatBar 
                label="Saídas (Despesas)" 
                value={totalDespesa} 
                total={totalMovimentado} 
                color="bg-red-400" 
              />
            </div>
          </AnalysisCard>

          <AnalysisCard title="Melhores Clientes">
            {topClients.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-gray-300 text-xs italic">Nenhum cliente identificado nas receitas.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topClients.map(([name, value], index) => (
                  <div key={name} className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                      #{index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-indigo-900">{name}</span>
                        <span className="text-xs font-black text-green-600">
                          {formatCurrency(value)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full">
                        <div 
                          className="h-full bg-indigo-400 rounded-full" 
                          style={{ width: `${(value / topClients[0][1]) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AnalysisCard>

          {/* Resumo Financeiro Consolidado */}
          <AnalysisCard title="Resumo Financeiro Consolidado">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-green-50/50 rounded-2xl border border-green-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-green-700 uppercase tracking-widest block leading-none">Total Receitas</span>
                    <span className="text-[9px] text-green-600 font-bold uppercase">Entradas totais</span>
                  </div>
                </div>
                <span className="text-lg font-black text-green-700">{formatCurrency(totalReceita)}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-red-700 uppercase tracking-widest block leading-none">Total Despesas</span>
                    <span className="text-[9px] text-red-500 font-bold uppercase">Saídas totais</span>
                  </div>
                </div>
                <span className="text-lg font-black text-red-600">{formatCurrency(totalDespesa)}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100 shadow-inner">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <DollarSign className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest block leading-none">Saldo Líquido</span>
                    <span className="text-[9px] text-indigo-500 font-bold uppercase">Resultado Real</span>
                  </div>
                </div>
                <span className={`text-xl font-black ${saldo >= 0 ? 'text-indigo-900' : 'text-red-700'}`}>
                  {formatCurrency(saldo)}
                </span>
              </div>
            </div>
          </AnalysisCard>

          <AnalysisCard title="Eficiência Financeira">
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-100"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={364.4}
                    strokeDashoffset={364.4 - (364.4 * margemLucro) / 100}
                    className="text-indigo-600 transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-indigo-900">{margemLucro.toFixed(0)}%</span>
                  <span className="text-[8px] font-bold text-gray-400 uppercase">Lucratividade</span>
                </div>
              </div>
              <p className="text-center text-[10px] text-gray-400 px-6 font-medium">
                {saldo > 0 
                  ? "Seu negócio está operando com saldo positivo. Continue mantendo as despesas sob controle."
                  : "Atenção: Suas despesas estão superando suas receitas. Revise seus custos fixos."}
              </p>
            </div>
          </AnalysisCard>
        </>
      )}
    </div>
  );
};
