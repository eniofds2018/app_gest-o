
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, ChevronLeft } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatViewProps {
  businessData: {
    pedidos: any[];
    financeiro: any[];
    clientes: any[];
    businessName: string;
  };
  onBack: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ businessData, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Olá! Sou seu assistente do Gestor Pro. Como posso ajudar seu negócio "${businessData.businessName || 'hoje'}"?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construindo o contexto do negócio para a IA
      const context = `
        Você é o Consultor Estratégico do app "Gestor Pro". 
        DADOS ATUAIS DO NEGÓCIO:
        - Nome da Empresa: ${businessData.businessName || 'Não definido'}
        - Total de Pedidos: ${businessData.pedidos.length}
        - Total de Clientes: ${businessData.clientes.length}
        - Saldo em Caixa: R$ ${businessData.financeiro.reduce((acc, curr) => curr.type === 'receita' ? acc + curr.value : acc - curr.value, 0).toFixed(2)}
        - Últimos Pedidos: ${businessData.pedidos.slice(0, 3).map(p => `${p.service} para ${p.client}`).join(', ')}

        Responda de forma executiva, curta e motivadora em português. Ajude o usuário a analisar seus dados ou dar dicas de gestão.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: context }] },
          ...messages.map(m => ({ role: m.role, parts: [{ text: m.text }] })),
          { role: 'user', parts: [{ text: userMessage }] }
        ],
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "Desculpe, tive um problema técnico." }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Erro na conexão. Verifique sua internet." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-gray-50 flex flex-col animate-fade-in">
      {/* Header Local do Chat */}
      <header className="bg-white border-b border-gray-100 p-4 flex items-center space-x-4">
        <button onClick={onBack} className="p-1 active:scale-90 transition-transform">
          <ChevronLeft className="w-6 h-6 text-indigo-900" />
        </button>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-900 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black text-indigo-900 uppercase tracking-tight leading-none">Assistente Pro</h2>
            <div className="flex items-center space-x-1 mt-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Online Agora</span>
            </div>
          </div>
        </div>
      </header>

      {/* Área de Mensagens */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
      >
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-zoom-in`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-900 text-white rounded-tr-none' 
                : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-white p-4 rounded-2xl border border-gray-100 rounded-tl-none flex items-center space-x-2">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">IA analisando dados...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input de Mensagem */}
      <div className="p-4 bg-white border-t border-gray-100 pb-8">
        <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 pl-4 focus-within:ring-2 focus-within:ring-indigo-500 transition-all shadow-inner">
          <input 
            type="text" 
            placeholder="Pergunte sobre seu negócio..."
            className="flex-1 bg-transparent border-none outline-none text-sm py-2 placeholder:text-gray-400 text-indigo-950 font-medium"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
          />
          <button 
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-indigo-900 text-white p-3 rounded-xl shadow-lg active:scale-90 transition-all disabled:opacity-50 disabled:grayscale"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-[8px] text-gray-300 font-bold uppercase tracking-[0.2em] mt-3 flex items-center justify-center space-x-1">
          <Sparkles className="w-3 h-3" />
          <span>Insights gerados pelo Gemini AI</span>
        </p>
      </div>
    </div>
  );
};
