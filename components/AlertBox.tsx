
import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const AlertBox: React.FC = () => {
  return (
    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-center space-x-4">
      <AlertTriangle className="w-8 h-8 text-orange-400 flex-shrink-0" />
      <div>
        <h3 className="text-orange-800 font-bold text-sm">Garanta seu acesso ao aplicativo</h3>
        <p className="text-orange-700 text-xs">Verifique seu endereço de e-mail</p>
      </div>
    </div>
  );
};
