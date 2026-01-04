
import React from 'react';
import { ClipboardList, Home, BarChart3 } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'inicio' | 'gestao';
  setActiveTab: (tab: 'inicio' | 'gestao') => void;
  onNewOrder: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, setActiveTab, onNewOrder }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
      {/* Floating Action Button - With gradient background to separate from content */}
      {activeTab === 'inicio' && (
        <div className="px-4 pb-4 pt-8 bg-gradient-to-t from-gray-50/90 via-gray-50/50 to-transparent">
          <button 
            onClick={onNewOrder}
            className="w-full bg-indigo-800 hover:bg-indigo-900 text-white py-4 rounded-xl flex items-center justify-center space-x-2 font-bold shadow-2xl transition-all active:scale-95 border border-indigo-700/50"
          >
            <ClipboardList className="w-5 h-5" />
            <span className="uppercase text-xs tracking-widest">Criar novo pedido</span>
          </button>
        </div>
      )}

      {/* Main Bottom Nav */}
      <div className="bg-white border-t border-gray-100 px-8 py-3 flex justify-around items-center rounded-t-3xl shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)]">
        <button 
          onClick={() => setActiveTab('inicio')}
          className={`flex flex-col items-center space-y-1 transition-all px-6 py-2 rounded-xl active:scale-90 ${
            activeTab === 'inicio' ? 'bg-indigo-50 text-indigo-800 shadow-sm' : 'text-gray-400'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-wider">Início</span>
        </button>

        <button 
          onClick={() => setActiveTab('gestao')}
          className={`flex flex-col items-center space-y-1 transition-all px-6 py-2 rounded-xl active:scale-90 ${
            activeTab === 'gestao' ? 'bg-indigo-50 text-indigo-800 shadow-sm' : 'text-gray-400'
          }`}
        >
          <BarChart3 className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase tracking-wider">Gestão</span>
        </button>
      </div>
    </div>
  );
};
