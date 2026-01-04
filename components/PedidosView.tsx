
import React, { useState, useEffect } from 'react';
import { NotebookTabs, X, CheckCircle2, Clock, AlertCircle, Plus, ChevronDown, PlusCircle } from 'lucide-react';

interface PedidosViewProps {
  data: any[];
  setData: (data: any[]) => void;
  clients: any[];
  services: any[];
  onConclude: (id: number) => void;
  onAddNewService: (name: string, price: number) => void;
  onAddNewClient: (name: string) => void;
  autoOpen?: boolean;
  onCloseAutoOpen?: () => void;
}

export const PedidosView: React.FC<PedidosViewProps> = ({ 
  data, setData, clients, services, onConclude, onAddNewService, onAddNewClient, autoOpen, onCloseAutoOpen
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'todos' | 'status'>('todos');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    client: '', 
    service: '', 
    value: '', 
    status: 'Aberto',
    isNewClient: false,
    isNewService: false
  });

  // Escuta o comando de abertura automática vindo do App/SummaryCard
  useEffect(() => {
    if (autoOpen) {
      setIsFormOpen(true);
      if (onCloseAutoOpen) onCloseAutoOpen();
    }
  }, [autoOpen, onCloseAutoOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client || !formData.service) return;

    const val = parseFloat(formData.value) || 0;

    if (formData.isNewClient) {
      onAddNewClient(formData.client);
    }

    if (formData.isNewService) {
      onAddNewService(formData.service, val);
    }

    const newPedido = {
      id: Date.now(),
      client: formData.client,
      service: formData.service,
      value: val,
      status: formData.status,
      date: new Date().toLocaleDateString('pt-BR'),
    };

    setData([newPedido, ...data]);
    
    if (formData.status === 'Concluído') {
      setTimeout(() => onConclude(newPedido.id), 100);
    }

    setIsFormOpen(false);
    setFormData({ client: '', service: '', value: '', status: 'Aberto', isNewClient: false, isNewService: false });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Concluído': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'Aberto': return <Clock className="w-4 h-4 text-indigo-500" />;
      default: return <AlertCircle className="w-4 h-4 text-orange-400" />;
    }
  };

  return (
    <div className="flex flex-col min-h-[70vh] -mx-4">
      <div className="flex border-b border-gray-100 bg-white sticky top-[64px] z-30">
        <button 
          onClick={() => setActiveSubTab('todos')}
          className={`flex-1 py-4 text-sm font-semibold transition-all relative ${
            activeSubTab === 'todos' ? 'text-indigo-900' : 'text-gray-400'
          }`}
        >
          Todos os pedidos
          {activeSubTab === 'todos' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-900 mx-4"></div>
          )}
        </button>
        <button 
          onClick={() => setActiveSubTab('status')}
          className={`flex-1 py-4 text-sm font-semibold transition-all relative ${
            activeSubTab === 'status' ? 'text-indigo-900' : 'text-gray-400'
          }`}
        >
          Abertos
          {activeSubTab === 'status' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-900 mx-4"></div>
          )}
        </button>
      </div>

      <div className="p-4 space-y-4 pb-32 text-left">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
            <div className="w-44 h-44 bg-gray-50 rounded-full flex items-center justify-center mb-10">
              <NotebookTabs className="w-24 h-24 text-gray-200" strokeWidth={1} />
            </div>
            <h2 className="text-gray-800 font-bold text-xl mb-3">Nenhum pedido ainda</h2>
            <p className="text-gray-400 text-sm">Toque no botão abaixo para gerar seu primeiro serviço!</p>
          </div>
        ) : (
          data
            .filter(p => activeSubTab === 'status' ? p.status === 'Aberto' : true)
            .map((pedido) => (
              <div key={pedido.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="font-bold text-indigo-900 leading-tight">{pedido.client}</p>
                    <p className="text-xs text-gray-500 font-medium">{pedido.service}</p>
                    <p className="text-[10px] text-gray-300 font-bold uppercase">{pedido.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-indigo-800 text-lg">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.value)}
                    </p>
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      {getStatusIcon(pedido.status)}
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{pedido.status}</span>
                    </div>
                  </div>
                </div>
                
                {pedido.status === 'Aberto' && (
                  <button 
                    onClick={() => onConclude(pedido.id)}
                    className="w-full bg-green-50 text-green-600 font-bold py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-green-100 transition-colors flex items-center justify-center space-x-2 border border-green-100"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Concluir e Gerar Receita</span>
                  </button>
                )}
                {pedido.status === 'Concluído' && (
                  <div className="bg-gray-50 py-2 rounded-lg text-center">
                    <span className="text-[10px] font-bold text-gray-400 italic">Receita e Recibo gerados</span>
                  </div>
                )}
              </div>
            ))
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-sm rounded-t-3xl p-6 space-y-6 animate-slide-up mb-0">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-indigo-900">Novo Pedido / Serviço</h2>
              <button onClick={() => setIsFormOpen(false)}><X className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex justify-between">
                  <span>Cliente</span>
                  {formData.isNewClient && <span className="text-indigo-600">Novo Cadastro!</span>}
                </label>
                <div className="relative">
                  {!formData.isNewClient ? (
                    <select 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 appearance-none font-medium text-indigo-900"
                      value={formData.client}
                      onChange={e => {
                        if (e.target.value === "ADD_NEW") {
                          setFormData({...formData, client: '', isNewClient: true});
                        } else {
                          setFormData({...formData, client: e.target.value});
                        }
                      }}
                      required
                    >
                      <option value="">Selecione o cliente...</option>
                      {clients.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      <option value="ADD_NEW" className="text-indigo-600 font-bold">+ Cadastrar novo cliente</option>
                    </select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <input 
                        className="flex-1 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 font-medium text-indigo-900"
                        placeholder="Nome do novo cliente"
                        autoFocus
                        value={formData.client}
                        onChange={e => setFormData({...formData, client: e.target.value})}
                      />
                      <button type="button" onClick={() => setFormData({...formData, isNewClient: false, client: ''})} className="p-2 text-gray-400"><X className="w-4 h-4"/></button>
                    </div>
                  )}
                  {!formData.isNewClient && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />}
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex justify-between">
                  <span>Serviço / Produto</span>
                  {formData.isNewService && <span className="text-indigo-600">Novo Serviço!</span>}
                </label>
                <div className="relative">
                  {!formData.isNewService ? (
                    <select 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 appearance-none font-medium text-indigo-900"
                      value={formData.service}
                      onChange={e => {
                        if (e.target.value === "ADD_NEW") {
                          setFormData({...formData, service: '', isNewService: true, value: ''});
                        } else {
                          const service = services.find(s => s.name === e.target.value);
                          setFormData({
                            ...formData, 
                            service: e.target.value,
                            value: service ? service.price.toString() : formData.value
                          });
                        }
                      }}
                      required
                    >
                      <option value="">Selecione o serviço...</option>
                      {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                      <option value="ADD_NEW" className="text-indigo-600 font-bold">+ Cadastrar novo serviço</option>
                    </select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <input 
                        className="flex-1 bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 font-medium text-indigo-900"
                        placeholder="Nome do novo serviço"
                        autoFocus
                        value={formData.service}
                        onChange={e => setFormData({...formData, service: e.target.value})}
                      />
                      <button type="button" onClick={() => setFormData({...formData, isNewService: false, service: ''})} className="p-2 text-gray-400"><X className="w-4 h-4"/></button>
                    </div>
                  )}
                  {!formData.isNewService && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor</label>
                  <input 
                    type="number" step="0.01"
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-indigo-900 focus:ring-2 focus:ring-indigo-500"
                    placeholder="0,00"
                    value={formData.value}
                    onChange={e => setFormData({...formData, value: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Status Inicial</label>
                  <select 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-medium text-indigo-900"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                  >
                    <option>Aberto</option>
                    <option>Concluído</option>
                  </select>
                </div>
              </div>
              <button className="w-full bg-indigo-700 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-transform uppercase tracking-widest text-xs">
                Gravar e Iniciar Fluxo
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="fixed bottom-10 left-0 right-0 px-4 max-w-md mx-auto z-40">
        <button 
          onClick={() => setIsFormOpen(true)}
          className="w-full bg-indigo-700 hover:bg-indigo-800 text-white py-4 rounded-xl flex items-center justify-center space-x-2 font-bold shadow-2xl transition-all active:scale-95"
        >
          <PlusCircle className="w-5 h-5" />
          <span className="uppercase text-xs tracking-widest">Novo Pedido de Serviço</span>
        </button>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};
