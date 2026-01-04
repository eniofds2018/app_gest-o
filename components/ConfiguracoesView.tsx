
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building2, 
  Trash2, 
  Download, 
  Info, 
  ChevronRight, 
  Save, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';

interface ConfiguracoesViewProps {
  onResetApp: () => void;
  onExportData: () => void;
}

export const ConfiguracoesView: React.FC<ConfiguracoesViewProps> = ({ onResetApp, onExportData }) => {
  const [profile, setProfile] = useState({
    businessName: localStorage.getItem('gp_business_name') || '',
    ownerName: localStorage.getItem('gp_owner_name') || ''
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gp_business_name', profile.businessName);
    localStorage.setItem('gp_owner_name', profile.ownerName);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const confirmReset = () => {
    if (window.confirm("ATENÇÃO: Isso apagará TODOS os seus pedidos, clientes e registros financeiros permanentemente. Deseja continuar?")) {
      onResetApp();
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      {/* Perfil Section */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Perfil do Negócio</h3>
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <div className="space-y-1 text-left">
            <label className="flex items-center space-x-2 text-[10px] font-bold text-indigo-900 uppercase">
              <Building2 className="w-3 h-3" />
              <span>Nome da Empresa</span>
            </label>
            <input 
              type="text"
              placeholder="Ex: Oficina do João"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={profile.businessName}
              onChange={e => setProfile({...profile, businessName: e.target.value})}
            />
          </div>
          <div className="space-y-1 text-left">
            <label className="flex items-center space-x-2 text-[10px] font-bold text-indigo-900 uppercase">
              <User className="w-3 h-3" />
              <span>Proprietário</span>
            </label>
            <input 
              type="text"
              placeholder="Seu nome completo"
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={profile.ownerName}
              onChange={e => setProfile({...profile, ownerName: e.target.value})}
            />
          </div>
          <button 
            type="submit"
            className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all ${
              isSaved ? 'bg-green-500 text-white' : 'bg-indigo-700 text-white active:scale-95 shadow-lg'
            }`}
          >
            {isSaved ? (
              <><span>Salvo com Sucesso!</span></>
            ) : (
              <><Save className="w-4 h-4" /><span>Salvar Alterações</span></>
            )}
          </button>
        </form>
      </section>

      {/* Dados Section */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Gestão de Dados</h3>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <button 
            onClick={onExportData}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-50"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg"><Download className="w-5 h-5 text-blue-500" /></div>
              <div className="text-left">
                <p className="text-sm font-bold text-indigo-900">Exportar Backup</p>
                <p className="text-[10px] text-gray-400 font-medium uppercase">Baixar dados em JSON</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>

          <button 
            onClick={confirmReset}
            className="w-full flex items-center justify-between p-4 hover:bg-red-50 active:bg-red-100 transition-colors group"
          >
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100"><Trash2 className="w-5 h-5 text-red-500" /></div>
              <div className="text-left">
                <p className="text-sm font-bold text-red-600">Zerar Aplicativo</p>
                <p className="text-[10px] text-red-400 font-medium uppercase">Apagar tudo permanentemente</p>
              </div>
            </div>
            <AlertTriangle className="w-4 h-4 text-red-200" />
          </button>
        </div>
      </section>

      {/* Sobre Section */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Sobre o Sistema</h3>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-indigo-900 rounded-2xl text-white shadow-md">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-indigo-900 text-lg">Gestor Pro</p>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Versão 2.4.0 • Enterprise</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed text-left">
            O Gestor Pro é uma ferramenta completa para microempreendedores focada em agilidade, 
            organização financeira e documentos gerados com inteligência artificial.
          </p>
          <div className="pt-2 border-t border-gray-50 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase">
             <span>Suporte Premium</span>
             <span className="text-indigo-600">Ativo</span>
          </div>
        </div>
      </section>
    </div>
  );
};
