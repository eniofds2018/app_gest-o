
import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Wand2, 
  Loader2,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const FAQ_ITEMS = [
  {
    question: "Como gerar um recibo automático?",
    answer: "Sempre que você cadastrar uma 'Receita' no Financeiro informando o nome do cliente, o sistema gera automaticamente um recibo no 'Centro de Documentos'."
  },
  {
    question: "Meus dados estão seguros?",
    answer: "Sim! Seus dados são armazenados localmente no seu dispositivo. Recomendamos fazer um 'Exportar Backup' regularmente nas configurações para sua segurança."
  },
  {
    question: "Como funciona a IA nos documentos?",
    answer: "No Centro de Documentos, ao escolher 'Criar com IA', você descreve o que precisa (ex: 'aluguel de 500 reais do João') e nossa inteligência redige o texto formal para você."
  },
  {
    question: "Como concluir um pedido?",
    answer: "Vá em 'Pedidos', encontre o pedido em aberto e clique em 'Concluir'. Isso moverá o valor para o seu financeiro e gerará o recibo de quitação."
  }
];

export const AjudaView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [userQuery, setUserQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAskAI = async () => {
    if (!userQuery) return;
    setIsLoading(true);
    setAiResponse('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Você é o suporte técnico do aplicativo "Gestor Pro". 
        O usuário tem a seguinte dúvida: "${userQuery}".
        
        CONTEXTO DO APP:
        - O app gerencia Pedidos, Clientes, Financeiro, Agenda e Documentos.
        - Gera recibos, contratos e notas de serviço usando IA.
        - Os dados ficam salvos no navegador (localStorage).
        - Tem área de gestão com gráficos.
        
        Responda de forma curta, prestativa e amigável em português do Brasil.`,
      });
      
      setAiResponse(response.text || "Desculpe, não consegui processar sua dúvida agora.");
    } catch (error) {
      console.error(error);
      setAiResponse("Ocorreu um erro ao consultar o assistente. Verifique sua conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-fade-in text-left">
      {/* AI Assistant Section */}
      <section className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Sparkles className="w-20 h-20" />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-2">
            <Wand2 className="w-5 h-5 text-indigo-300" />
            <h2 className="text-lg font-black uppercase tracking-widest">Assistente Inteligente</h2>
          </div>
          
          <p className="text-xs text-indigo-100 font-medium">
            Tem alguma dúvida sobre como usar uma funcionalidade? Pergunte à nossa IA:
          </p>

          <div className="flex space-x-2">
            <input 
              type="text"
              placeholder="Ex: Como faço backup?"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm placeholder:text-indigo-300 outline-none focus:ring-2 focus:ring-white/50 transition-all"
              value={userQuery}
              onChange={e => setUserQuery(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleAskAI()}
            />
            <button 
              onClick={handleAskAI}
              disabled={isLoading || !userQuery}
              className="bg-white text-indigo-900 p-3 rounded-xl shadow-lg active:scale-90 transition-transform disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <MessageSquare className="w-6 h-6" />}
            </button>
          </div>

          {aiResponse && (
            <div className="bg-white/10 border border-white/10 p-4 rounded-2xl animate-zoom-in">
              <p className="text-sm leading-relaxed">{aiResponse}</p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-3">
        <div className="flex items-center space-x-2 px-1">
          <BookOpen className="w-4 h-4 text-indigo-900" />
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dúvidas Frequentes</h3>
        </div>
        
        <div className="space-y-2">
          {FAQ_ITEMS.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left active:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-bold text-indigo-900">{item.question}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-gray-300" /> : <ChevronDown className="w-4 h-4 text-gray-300" />}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 animate-slide-down">
                  <p className="text-xs text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Suporte Direto</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => window.open('https://wa.me/seunumeroaqui', '_blank')}
            className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center space-y-3 active:scale-95 transition-all"
          >
            <div className="p-3 bg-green-50 rounded-2xl"><MessageCircle className="w-6 h-6 text-green-500" /></div>
            <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">WhatsApp</span>
          </button>
          
          <button 
            onClick={() => window.location.href = 'mailto:suporte@gestorpro.com'}
            className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center space-y-3 active:scale-95 transition-all"
          >
            <div className="p-3 bg-blue-50 rounded-2xl"><Mail className="w-6 h-6 text-blue-500" /></div>
            <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">E-mail</span>
          </button>
        </div>
      </section>

      <div className="py-6 text-center">
        <p className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.3em]">Gestor Pro • Central de Relacionamento</p>
      </div>

      <style>{`
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slide-down 0.2s ease-out; }
        .animate-zoom-in { animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};
