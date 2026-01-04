
import React from 'react';
import { ClipboardList, Calendar, DollarSign, User, Briefcase, FileText } from 'lucide-react';
import { ViewType } from '../App';

interface GridItemProps {
  icon: React.ReactNode;
  label: string;
  iconBg: string;
  iconColor: string;
  onClick: () => void;
}

const GridItem: React.FC<GridItemProps> = ({ icon, label, iconBg, iconColor, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-start space-y-3 active:scale-95 transition-transform cursor-pointer"
  >
    <div className={`p-2 rounded-lg ${iconBg}`}>
      {React.cloneElement(icon as React.ReactElement, { className: `w-6 h-6 ${iconColor}` })}
    </div>
    <span className="text-sm font-semibold text-gray-700">{label}</span>
  </div>
);

interface MainGridProps {
  onNavigate: (view: ViewType) => void;
}

export const MainGrid: React.FC<MainGridProps> = ({ onNavigate }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <GridItem 
        label="Pedidos" 
        icon={<ClipboardList />} 
        iconBg="bg-indigo-50" 
        iconColor="text-indigo-600" 
        onClick={() => onNavigate('pedidos')}
      />
      <GridItem 
        label="Agenda" 
        icon={<Calendar />} 
        iconBg="bg-cyan-50" 
        iconColor="text-cyan-500" 
        onClick={() => onNavigate('agenda')}
      />
      <GridItem 
        label="Financeiro" 
        icon={<DollarSign />} 
        iconBg="bg-green-50" 
        iconColor="text-green-500" 
        onClick={() => onNavigate('financeiro')}
      />
      <GridItem 
        label="Clientes" 
        icon={<User />} 
        iconBg="bg-orange-50" 
        iconColor="text-orange-400" 
        onClick={() => onNavigate('clientes')}
      />
      <GridItem 
        label="Assessoria" 
        icon={<Briefcase />} 
        iconBg="bg-blue-50" 
        iconColor="text-blue-500" 
        onClick={() => onNavigate('assessoria')}
      />
      <GridItem 
        label="Serviços" 
        icon={<FileText />} 
        iconBg="bg-indigo-50" 
        iconColor="text-indigo-400" 
        onClick={() => onNavigate('servicos')}
      />
    </div>
  );
};
