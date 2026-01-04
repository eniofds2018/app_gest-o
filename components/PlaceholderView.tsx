
import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';

interface PlaceholderViewProps {
  title: string;
  onBack: () => void;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title, onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-8 text-center space-y-6">
      <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center">
        <Construction className="w-12 h-12 text-indigo-300" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-indigo-900">{title}</h2>
        <p className="text-gray-400 text-sm">Esta funcionalidade está sendo preparada para você!</p>
      </div>
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-indigo-600 font-bold text-sm bg-indigo-50 px-6 py-3 rounded-xl active:scale-95 transition-transform"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para o Início</span>
      </button>
    </div>
  );
};
