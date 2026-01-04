
import React, { useState, useEffect } from 'react';
import { Calendar, Plus, X, Clock, MapPin } from 'lucide-react';

interface AgendaViewProps {
  data: any[];
  setData: (data: any[]) => void;
  autoOpen?: boolean;
  onCloseAutoOpen?: () => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({ data, setData, autoOpen, onCloseAutoOpen }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', time: '', location: '' });

  useEffect(() => {
    if (autoOpen) {
      setIsFormOpen(true);
      if (onCloseAutoOpen) onCloseAutoOpen();
    }
  }, [autoOpen, onCloseAutoOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) return;
    setData([...data, { id: Date.now(), ...formData }]);
    setIsFormOpen(false);
    setFormData({ title: '', date: '', time: '', location: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-indigo-900 font-black uppercase text-xs tracking-widest">Sua Agenda</h3>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="bg-indigo-700 text-white p-2 rounded-lg active:scale-90 shadow-sm"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <Calendar className="w-12 h-12 text-gray-200" />
          <p className="text-gray-400 text-sm font-medium italic">Nenhum compromisso agendado para hoje.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-start space-x-4">
              <div className="bg-indigo-50 p-3 rounded-xl flex flex-col items-center min-w-[60px] border border-indigo-100">
                <span className="text-indigo-900 font-black text-lg">{item.date.split('-')[2]}</span>
                <span className="text-indigo-400 text-[10px] font-black uppercase">{new Date(item.date).toLocaleString('pt-BR', { month: 'short' }).replace('.', '')}</span>
              </div>
              <div className="flex-1 space-y-2 text-left">
                <p className="font-bold text-indigo-900 leading-tight">{item.title}</p>
                <div className="flex flex-wrap items-center gap-3 text-gray-400 text-[10px] font-bold uppercase">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>{item.time}</span>
                  </div>
                  {item.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-indigo-400" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-t-3xl p-6 space-y-6 animate-slide-up">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-indigo-900 uppercase">Novo Agendamento</h2>
              <button onClick={() => setIsFormOpen(false)}><X className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">O que será feito?</label>
                <input 
                  type="text" required
                  placeholder="Ex: Consultoria com João"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none font-medium text-indigo-900"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data</label>
                  <input 
                    type="date" required
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none font-medium text-indigo-900"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Horário</label>
                  <input 
                    type="time" required
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none font-medium text-indigo-900"
                    value={formData.time}
                    onChange={e => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Local (opcional)</label>
                <input 
                  type="text"
                  placeholder="Ex: Google Meet ou Endereço"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 outline-none font-medium text-indigo-900"
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <button className="w-full bg-indigo-700 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-transform uppercase tracking-widest text-xs">
                Gravar Compromisso
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
