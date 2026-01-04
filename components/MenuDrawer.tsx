
import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Plus, 
  User, 
  Briefcase, 
  CalendarCheck2, 
  FileText, 
  DollarSign, 
  Calendar, 
  Package, 
  Users, 
  ChevronRight, 
  Settings, 
  MessageSquare, 
  LogOut, 
  RotateCcw,
  Camera,
  Building2,
  Save
} from 'lucide-react';
import { ViewType } from '../App';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewType) => void;
  onLogout: () => void;
}

const MenuItem: React.FC<{ icon: React.ReactNode; label: string; onClick?: () => void; danger?: boolean }> = ({ icon, label, onClick, danger }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between py-4 group active:bg-gray-50 px-2 rounded-lg transition-colors ${danger ? 'text-red-500' : 'text-indigo-900'}`}
  >
    <div className="flex items-center space-x-4">
      <div className={`${danger ? 'text-red-500' : 'text-indigo-900'} group-hover:scale-110 transition-transform`}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
      </div>
      <span className="font-medium text-sm">{label}</span>
    </div>
    <ChevronRight className={`w-5 h-5 ${danger ? 'text-red-200' : 'text-indigo-300'}`} />
  </button>
);

export const MenuDrawer: React.FC<MenuDrawerProps> = ({ isOpen, onClose, onNavigate, onLogout }) => {
  const [businessName, setBusinessName] = useState(localStorage.getItem('gp_business_name') || '');
  const [ownerName, setOwnerName] = useState(localStorage.getItem('gp_owner_name') || '');
  const [avatar, setAvatar] = useState(localStorage.getItem('gp_user_avatar') || '');
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with localStorage if it changes elsewhere
  useEffect(() => {
    if (isOpen) {
      setBusinessName(localStorage.getItem('gp_business_name') || '');
      setOwnerName(localStorage.getItem('gp_owner_name') || '');
      setAvatar(localStorage.getItem('gp_user_avatar') || '');
    }
  }, [isOpen]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatar(base64String);
        localStorage.setItem('gp_user_avatar', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gp_business_name', businessName);
    localStorage.setItem('gp_owner_name', ownerName);
    setIsEditingInfo(false);
    // Dispara um evento customizado para que o resto do app saiba que o perfil mudou
    window.dispatchEvent(new Event('storage'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      <div className="relative w-[85%] max-w-xs bg-white h-full shadow-2xl overflow-y-auto flex flex-col animate-slide-in-left">
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-7 h-7 text-gray-400" />
          </button>
        </div>

        {/* Profile Section */}
        <div className="px-6 space-y-4 mb-8">
          <div className="flex items-center space-x-4">
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center overflow-hidden border-2 border-indigo-100 shadow-inner">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <Briefcase className="w-8 h-8 text-indigo-200" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-indigo-900 border-2 border-white rounded-full flex items-center justify-center shadow-md group-hover:bg-indigo-700 transition-colors">
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            <div className="flex-1 text-left">
              {businessName ? (
                <div className="space-y-0.5">
                  <p className="text-indigo-900 font-black text-sm uppercase tracking-tight line-clamp-1">{businessName}</p>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest line-clamp-1">{ownerName || 'Proprietário'}</p>
                </div>
              ) : (
                <p className="text-indigo-900 text-xs font-semibold leading-tight">
                  Personalize o seu painel de gestão agora
                </p>
              )}
            </div>
            <button 
              onClick={() => setIsEditingInfo(!isEditingInfo)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white active:scale-90 transition-all shadow-md ${isEditingInfo ? 'bg-red-400 rotate-45' : 'bg-indigo-800'}`}
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {/* Inline Edit Form */}
          {isEditingInfo && (
            <form onSubmit={handleSaveInfo} className="bg-gray-50 p-4 rounded-2xl space-y-3 animate-zoom-in border border-gray-100">
              <div className="space-y-1 text-left">
                <label className="text-[9px] font-black text-indigo-400 uppercase ml-1">Nome da Empresa</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-200" />
                  <input 
                    className="w-full bg-white border border-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-indigo-900 outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Ex: Minha Oficina"
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[9px] font-black text-indigo-400 uppercase ml-1">Seu Nome</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-200" />
                  <input 
                    className="w-full bg-white border border-gray-100 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-indigo-900 outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="Ex: João Silva"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-indigo-700 text-white py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 shadow-sm active:scale-95 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Perfil</span>
              </button>
            </form>
          )}
        </div>

        {/* Preferences Section */}
        <div className="px-4 space-y-1">
          <h3 className="px-2 text-indigo-900 font-bold text-lg mb-2 text-left">Preferências</h3>
          <MenuItem icon={<CalendarCheck2 />} label="Pedidos" onClick={() => onNavigate('pedidos')} />
          <MenuItem icon={<FileText />} label="Documentos" onClick={() => onNavigate('documentos')} />
          <MenuItem icon={<DollarSign />} label="Finanças & pagamentos" onClick={() => onNavigate('financeiro')} />
          <MenuItem icon={<Calendar />} label="Agenda" onClick={() => onNavigate('agenda')} />
          <MenuItem icon={<Package />} label="Serviços" onClick={() => onNavigate('servicos')} />
          <MenuItem icon={<Users />} label="Clientes" onClick={() => onNavigate('clientes')} />
        </div>

        <div className="my-6 border-t border-gray-100 mx-6"></div>

        <div className="px-4 space-y-1 mb-8">
          <MenuItem icon={<Settings />} label="Outras configurações" onClick={() => onNavigate('configuracoes')} />
          <MenuItem icon={<MessageSquare />} label="Preciso de ajuda" onClick={() => onNavigate('ajuda')} />
          <MenuItem icon={<LogOut />} label="Sair da conta" onClick={onLogout} danger />
        </div>

        <div className="mt-auto p-6 flex justify-end">
          <button onClick={() => window.location.reload()} className="p-2 text-gray-400 hover:text-indigo-800 transition-colors">
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slide-in-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes zoom-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-zoom-in {
          animation: zoom-in 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};
