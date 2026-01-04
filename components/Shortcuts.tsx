
import React from 'react';
import { 
  PlusSquare, 
  ArrowUpRight, 
  CalendarPlus, 
  CircleDollarSign, 
  FileCheck, 
  UserPlus, 
  CreditCard,
  Briefcase
} from 'lucide-react';
import { ViewType } from '../App';

interface ShortcutCardProps {
  icon: React.ReactNode;
  label: string;
  iconBg: string;
  iconColor: string;
  onClick: () => void;
  badge?: number;
}

const ShortcutCard: React.FC<ShortcutCardProps> = ({ icon, label, iconBg, iconColor, onClick, badge }) => (
  <div 
    onClick={onClick}
    className="flex-shrink-0 w-32 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col space-y-3 cursor-pointer hover:border-indigo-200 active:scale-95 transition-all relative"
  >
    {badge !== undefined && badge > 0 && (
      <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce">
        {badge}
      </div>
    )}
    <div className={`p-2 rounded-lg w-fit ${iconBg}`}>
      {React.cloneElement(icon as React.ReactElement, { className: `w-6 h-6 ${iconColor}` })}
    </div>
    <span className="text-[11px] font-bold text-gray-500 leading-tight uppercase tracking-tighter">{label}</span>
  </div>
);

interface ShortcutsProps {
  onNavigate: (view: ViewType) => void;
  agendaCount?: number;
}

export const Shortcuts: React.FC<ShortcutsProps> = ({ onNavigate, agendaCount }) => {
  return (
    <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
      <ShortcutCard 
        label="Serviço Direto" 
        icon={<PlusSquare />} 
        iconBg="bg-indigo-50" 
        iconColor="text-indigo-600" 
        onClick={() => onNavigate('pedidos')}
      />
      <ShortcutCard 
        label="Assessoria" 
        icon={<Briefcase />} 
        iconBg="bg-blue-50" 
        iconColor="text-blue-500" 
        onClick={() => onNavigate('assessoria')}
      />
      <ShortcutCard 
        label="Recebimento" 
        icon={<ArrowUpRight />} 
        iconBg="bg-green-50" 
        iconColor="text-green-500" 
        onClick={() => onNavigate('financeiro')}
      />
      <ShortcutCard 
        label="Pagamento" 
        icon={<CreditCard />} 
        iconBg="bg-rose-50" 
        iconColor="text-rose-500" 
        onClick={() => onNavigate('financeiro')}
      />
      <ShortcutCard 
        label="Agendar" 
        icon={<CalendarPlus />} 
        iconBg="bg-cyan-50" 
        iconColor="text-cyan-500" 
        onClick={() => onNavigate('agenda')}
        badge={agendaCount}
      />
      <ShortcutCard 
        label="Ver Recibos" 
        icon={<FileCheck />} 
        iconBg="bg-indigo-50" 
        iconColor="text-indigo-500" 
        onClick={() => onNavigate('documentos')}
      />
      <ShortcutCard 
        label="Novo cliente" 
        icon={<UserPlus />} 
        iconBg="bg-orange-50" 
        iconColor="text-orange-500" 
        onClick={() => onNavigate('clientes')}
      />
    </div>
  );
};
