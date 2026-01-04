
import React, { useState, useEffect } from 'react';
import { Settings2, Plus, ArrowUpCircle, ArrowDownCircle, ClipboardList, CalendarPlus, X } from 'lucide-react';
import { Header } from './components/Header';
import { MainGrid } from './components/MainGrid';
import { Shortcuts } from './components/Shortcuts';
import { SummaryCard } from './components/SummaryCard';
import { BottomNavigation } from './components/BottomNavigation';
import { GestaoView } from './components/GestaoView';
import { MenuDrawer } from './components/MenuDrawer';
import { PedidosView } from './components/PedidosView';
import { PlaceholderView } from './components/PlaceholderView';
import { ClientesView } from './components/ClientesView';
import { FinanceiroView } from './components/FinanceiroView';
import { AgendaView } from './components/AgendaView';
import { ServicosView } from './components/ServicosView';
import { AssessoriaView } from './components/AssessoriaView';
import { DocumentosView } from './components/DocumentosView';
import { ConfiguracoesView } from './components/ConfiguracoesView';
import { AjudaView } from './components/AjudaView';
import { AuthView } from './components/AuthView';
import { ChatView } from './components/ChatView';

export type ViewType = 
  | 'inicio' 
  | 'gestao' 
  | 'pedidos' 
  | 'agenda' 
  | 'financeiro' 
  | 'clientes' 
  | 'assessoria' 
  | 'servicos'
  | 'documentos'
  | 'ajuda'
  | 'configuracoes'
  | 'chat';

export interface Documento {
  id: string;
  type: 'recibo' | 'orcamento' | 'nota' | 'ponto' | 'contrato' | 'ia';
  client: string;
  description: string;
  value?: number;
  date: string;
  content?: string; 
  timestamp: number;
}

const load = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (e) {
    console.error(`Error loading ${key}:`, e);
    return defaultValue;
  }
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('gp_is_logged_in') === 'true';
  });
  
  const [currentView, setCurrentView] = useState<ViewType>('inicio');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  
  const [formConfig, setFormConfig] = useState<{
    open: boolean;
    type?: 'receita' | 'despesa' | 'pedido' | 'agenda';
  }>({ open: false });

  // Persistent States
  const [pedidos, setPedidos] = useState<any[]>(() => load('gp_pedidos', []));
  const [clientes, setClientes] = useState<any[]>(() => load('gp_clientes', [{ id: 1, name: 'Consumidor Final', phone: '' }]));
  const [financeiro, setFinanceiro] = useState<any[]>(() => load('gp_financeiro', []));
  const [agenda, setAgenda] = useState<any[]>(() => load('gp_agenda', []));
  const [servicos, setServicos] = useState<any[]>(() => load('gp_servicos', [{ id: 1, name: 'Serviço Padrão', price: 100 }]));
  const [assessoria, setAssessoria] = useState<any[]>(() => load('gp_assessoria', []));
  const [documentos, setDocumentos] = useState<Documento[]>(() => load('gp_documentos', []));

  // Persistence Sync
  useEffect(() => { localStorage.setItem('gp_pedidos', JSON.stringify(pedidos)); }, [pedidos]);
  useEffect(() => { localStorage.setItem('gp_clientes', JSON.stringify(clientes)); }, [clientes]);
  useEffect(() => { localStorage.setItem('gp_financeiro', JSON.stringify(financeiro)); }, [financeiro]);
  useEffect(() => { localStorage.setItem('gp_agenda', JSON.stringify(agenda)); }, [agenda]);
  useEffect(() => { localStorage.setItem('gp_servicos', JSON.stringify(servicos)); }, [servicos]);
  useEffect(() => { localStorage.setItem('gp_assessoria', JSON.stringify(assessoria)); }, [assessoria]);
  useEffect(() => { localStorage.setItem('gp_documentos', JSON.stringify(documentos)); }, [documentos]);

  const handleLogin = (user: any) => {
    localStorage.setItem('gp_is_logged_in', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('gp_is_logged_in');
    setIsAuthenticated(false);
    setIsMenuOpen(false);
    setCurrentView('inicio');
  };

  const resetApp = () => {
    localStorage.clear();
    window.location.reload();
  };

  const exportData = () => {
    const data = {
      pedidos, clientes, financeiro, agenda, servicos, assessoria, documentos,
      profile: {
        businessName: localStorage.getItem('gp_business_name'),
        ownerName: localStorage.getItem('gp_owner_name')
      }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_gestor_pro_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const addServiceToCatalog = (name: string, price: number) => {
    if (!servicos.find(s => s.name.toLowerCase() === name.toLowerCase())) {
      setServicos(prev => [...prev, { id: Date.now(), name, price }]);
    }
  };

  const addClientToContacts = (name: string) => {
    if (!clientes.find(c => c.name.toLowerCase() === name.toLowerCase())) {
      setClientes(prev => [...prev, { id: Date.now(), name, phone: '' }]);
    }
  };

  const addDocument = (doc: Omit<Documento, 'id' | 'timestamp' | 'date'>) => {
    const newDoc: Documento = {
      ...doc,
      id: `${doc.type.toUpperCase()}-${Date.now()}`,
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('pt-BR')
    };
    setDocumentos(prev => [newDoc, ...prev]);
  };

  const addFinanceEntry = (entry: { description: string, value: number, type: 'receita' | 'despesa', client?: string }) => {
    setFinanceiro(prev => [{
      id: Date.now(), ...entry, date: new Date().toLocaleDateString('pt-BR'),
    }, ...prev]);

    if (entry.type === 'receita') {
      addDocument({
        type: 'recibo', client: entry.client || 'Cliente não identificado', description: entry.description, value: entry.value
      });
    }
  };

  const handleConcludeOrder = (orderId: number) => {
    const order = pedidos.find(p => p.id === orderId);
    if (!order || order.status === 'Concluído') return;
    setPedidos(prev => prev.map(p => p.id === orderId ? { ...p, status: 'Concluído' } : p));
    addFinanceEntry({ description: `Pedido: ${order.service}`, value: order.value, type: 'receita', client: order.client });
  };

  const handleNavigate = (view: ViewType, autoOpenType?: any) => {
    setCurrentView(view);
    setIsMenuOpen(false);
    setIsQuickAddOpen(false);
    if (autoOpenType) {
      setFormConfig({ open: true, type: autoOpenType });
    } else {
      setFormConfig({ open: false });
    }
    window.scrollTo(0, 0);
  };

  const getViewTitle = () => {
    switch (currentView) {
      case 'inicio': return 'Painel Geral';
      case 'gestao': return 'Análise de Negócio';
      case 'pedidos': return 'Gerenciar Pedidos';
      case 'agenda': return 'Sua Agenda';
      case 'financeiro': return 'Caixa & Finanças';
      case 'clientes': return 'Meus Clientes';
      case 'servicos': return 'Serviços';
      case 'assessoria': return 'Gestão de Assessoria';
      case 'documentos': return 'Centro de Documentos';
      case 'configuracoes': return 'Configurações';
      case 'ajuda': return 'Central de Ajuda';
      case 'chat': return 'Assistente IA';
      default: return 'Gestor Pro';
    }
  };

  if (!isAuthenticated) {
    return <AuthView onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-gray-50 pb-48 relative overflow-x-hidden antialiased text-center">
      <Header 
        title={getViewTitle()} 
        onMenuClick={() => setIsMenuOpen(true)} 
        onChatClick={() => setCurrentView('chat')}
        showBack={currentView !== 'inicio' && currentView !== 'gestao'} 
        onBack={() => setCurrentView('inicio')} 
      />
      <MenuDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} onNavigate={handleNavigate} onLogout={handleLogout} />

      <main className="px-4 mt-4">
        {currentView === 'inicio' ? (
          <div className="space-y-6 animate-fade-in">
            <MainGrid onNavigate={handleNavigate} />
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-gray-400 font-semibold text-xs tracking-widest uppercase">Ações Rápidas</h2>
                <Settings2 className="w-5 h-5 text-gray-400 cursor-pointer" />
              </div>
              <Shortcuts onNavigate={handleNavigate} agendaCount={agenda.length} />
            </section>
            <SummaryCard 
              onAddClick={() => setIsQuickAddOpen(true)}
              stats={{
                pedidos: pedidos.length,
                clientes: clientes.length,
                financeiro: financeiro.reduce((acc, curr) => curr.type === 'receita' ? acc + curr.value : acc - curr.value, 0)
              }} 
            />
          </div>
        ) : currentView === 'gestao' ? (
          <GestaoView data={{ pedidos, financeiro }} />
        ) : currentView === 'pedidos' ? (
          <PedidosView 
            data={pedidos} setData={setPedidos} clients={clientes} services={servicos} 
            onConclude={handleConcludeOrder} onAddNewService={addServiceToCatalog} onAddNewClient={addClientToContacts}
            autoOpen={formConfig.open && formConfig.type === 'pedido'} onCloseAutoOpen={() => setFormConfig({ open: false })}
          />
        ) : currentView === 'financeiro' ? (
          <FinanceiroView 
            data={financeiro} setData={setFinanceiro} onReceiptGenerated={(r) => addDocument({ type: 'recibo', ...r })}
            autoOpen={formConfig.open && (formConfig.type === 'receita' || formConfig.type === 'despesa')}
            initialType={formConfig.type === 'despesa' ? 'despesa' : 'receita'}
            onCloseAutoOpen={() => setFormConfig({ open: false })}
          />
        ) : currentView === 'agenda' ? (
          <AgendaView 
            data={agenda} setData={setAgenda} 
            autoOpen={formConfig.open && formConfig.type === 'agenda'}
            onCloseAutoOpen={() => setFormConfig({ open: false })}
          />
        ) : currentView === 'clientes' ? (
          <ClientesView data={clientes} setData={setClientes} />
        ) : currentView === 'servicos' ? (
          <ServicosView data={servicos} setData={setServicos} />
        ) : currentView === 'assessoria' ? (
          <AssessoriaView data={assessoria} setData={setAssessoria} />
        ) : currentView === 'documentos' ? (
          <DocumentosView data={documentos} onAddDocument={addDocument} />
        ) : currentView === 'configuracoes' ? (
          <ConfiguracoesView onResetApp={resetApp} onExportData={exportData} />
        ) : currentView === 'ajuda' ? (
          <AjudaView />
        ) : currentView === 'chat' ? (
          <ChatView 
            onBack={() => setCurrentView('inicio')}
            businessData={{
              pedidos,
              financeiro,
              clientes,
              businessName: localStorage.getItem('gp_business_name') || ''
            }}
          />
        ) : (
          <PlaceholderView title={getViewTitle()} onBack={() => setCurrentView('inicio')} />
        )}
      </main>

      {isQuickAddOpen && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center p-4 backdrop-blur-sm bg-black/40" onClick={() => setIsQuickAddOpen(false)}>
          <div className="bg-white w-full rounded-3xl p-6 space-y-6 animate-slide-up shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black text-indigo-900 uppercase">O que deseja incluir?</h3>
              <button onClick={() => setIsQuickAddOpen(false)} className="p-2 bg-gray-50 rounded-full"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleNavigate('financeiro', 'receita')} className="flex flex-col items-center p-4 bg-green-50 border border-green-100 rounded-2xl space-y-2 active:scale-95 transition-all text-center">
                <ArrowUpCircle className="w-8 h-8 text-green-500" />
                <span className="text-[10px] font-black text-green-700 uppercase">Recebimento</span>
              </button>
              <button onClick={() => handleNavigate('financeiro', 'despesa')} className="flex flex-col items-center p-4 bg-red-50 border border-red-100 rounded-2xl space-y-2 active:scale-95 transition-all text-center">
                <ArrowDownCircle className="w-8 h-8 text-red-500" />
                <span className="text-[10px] font-black text-red-700 uppercase">Pagamento</span>
              </button>
              <button onClick={() => handleNavigate('pedidos', 'pedido')} className="flex flex-col items-center p-4 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-2 active:scale-95 transition-all text-center">
                <ClipboardList className="w-8 h-8 text-indigo-600" />
                <span className="text-[10px] font-black text-indigo-800 uppercase">Novo Pedido</span>
              </button>
              <button onClick={() => handleNavigate('agenda', 'agenda')} className="flex flex-col items-center p-4 bg-cyan-50 border border-cyan-100 rounded-2xl space-y-2 active:scale-95 transition-all text-center">
                <CalendarPlus className="w-8 h-8 text-cyan-500" />
                <span className="text-[10px] font-black text-cyan-700 uppercase">Agendamento</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {(currentView === 'inicio' || currentView === 'gestao') && (
        <BottomNavigation activeTab={currentView === 'gestao' ? 'gestao' : 'inicio'} setActiveTab={(tab) => setCurrentView(tab as ViewType)} onNewOrder={() => handleNavigate('pedidos', 'pedido')} />
      )}

      <style>{`
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default App;
