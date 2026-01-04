
import React, { useState } from 'react';
import { 
  FileCheck, Search, Eye, X, Printer, Share2, Download, Loader2, 
  Plus, Sparkles, FileText, ClipboardList, UserCheck, Scale, 
  ArrowRight, Wand2, Calendar, Trash2, PlusCircle, PenTool
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { GoogleGenAI, Type } from "@google/genai";
import { Documento } from '../App';

interface DocumentosViewProps {
  data: Documento[];
  onAddDocument: (doc: Omit<Documento, 'id' | 'timestamp' | 'date'>) => void;
}

export const DocumentosView: React.FC<DocumentosViewProps> = ({ data, onAddDocument }) => {
  const [selectedDoc, setSelectedDoc] = useState<Documento | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  
  // Modais de Formulário
  const [isPontoModalOpen, setIsPontoModalOpen] = useState(false);
  const [isOrcamentoModalOpen, setIsOrcamentoModalOpen] = useState(false);
  const [isAIFormOpen, setIsAIFormOpen] = useState(false);
  
  // Estados para geração IA
  const [activeAIType, setActiveAIType] = useState<'recibo' | 'contrato' | 'nota' | 'ia'>('ia');
  const [aiFormPrompt, setAiFormPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<{ title: string; content: string } | null>(null);

  const [pontoData, setPontoData] = useState({
    employer: '',
    employee: '',
    period: '',
    admission: '',
    workDays: 'Segunda a Sexta'
  });

  const [orcamentoData, setOrcamentoData] = useState({
    clientName: '',
    clientPhone: '',
    clientCNPJ: '',
    clientEmail: '',
    quoteNumber: `ORC-${Date.now().toString().slice(-6)}`,
    items: [{ description: '', unitValue: 0 }],
    discount: 0,
    observations: ''
  });

  const filteredData = data.filter(doc => 
    doc.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (value?: number) => {
    if (value === undefined) return '';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getDocIcon = (type: string) => {
    switch(type) {
      case 'recibo': return <FileCheck className="w-5 h-5 text-green-500" />;
      case 'orcamento': return <ClipboardList className="w-5 h-5 text-blue-500" />;
      case 'nota': return <FileText className="w-5 h-5 text-orange-500" />;
      case 'ponto': return <Calendar className="w-5 h-5 text-indigo-500" />;
      case 'contrato': return <Scale className="w-5 h-5 text-purple-500" />;
      case 'ia': return <Sparkles className="w-5 h-5 text-pink-500" />;
      default: return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleGenerateIA = async () => {
    if (!aiFormPrompt) return;
    setAiLoading(true);
    setAiResult(null);

    const typeLabels = {
      recibo: "um Recibo de Pagamento formal",
      contrato: "um Contrato de Prestação de Serviços detalhado e juridicamente seguro",
      nota: "uma Nota de Serviço/Relatório de Execução profissional",
      ia: "um documento administrativo"
    };

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Você é um especialista em redação administrativa e jurídica brasileira. 
        Gere ${typeLabels[activeAIType]} com base nestas informações: "${aiFormPrompt}".
        
        REGRAS:
        1. O texto deve ser formal, profissional e pronto para impressão.
        2. Use placeholders como [NOME], [CPF], [VALOR] se informações faltarem, mas tente deduzir pelo contexto.
        3. Para contratos, inclua cláusulas de Objeto, Preço, Prazos e Rescisão.
        4. Para recibos, escreva o valor por extenso.
        5. Retorne APENAS o JSON no formato especificado.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Título curto do documento" },
              content: { type: Type.STRING, description: "Conteúdo completo formatado para impressão" }
            },
            required: ["title", "content"]
          }
        }
      });
      
      const result = JSON.parse(response.text);
      setAiResult(result);
    } catch (error) {
      console.error("Erro IA:", error);
      alert("Falha na comunicação com a IA. Tente novamente.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveIADoc = () => {
    if (!aiResult) return;
    onAddDocument({
      type: activeAIType === 'ia' ? 'ia' : activeAIType,
      client: "Gerado por IA",
      description: aiResult.title,
      content: aiResult.content
    });
    setIsAIFormOpen(false);
    setAiResult(null);
    setAiFormPrompt('');
  };

  const handleSavePonto = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDocument({
      type: 'ponto',
      client: pontoData.employee,
      description: `Folha de Ponto - ${pontoData.period}`,
      content: JSON.stringify(pontoData)
    });
    setIsPontoModalOpen(false);
    setPontoData({ employer: '', employee: '', period: '', admission: '', workDays: 'Segunda a Sexta' });
  };

  const handleSaveOrcamento = (e: React.FormEvent) => {
    e.preventDefault();
    const totalItems = orcamentoData.items.reduce((acc, item) => acc + item.unitValue, 0);
    const totalFinal = totalItems - orcamentoData.discount;
    
    onAddDocument({
      type: 'orcamento',
      client: orcamentoData.clientName,
      description: `Orçamento #${orcamentoData.quoteNumber}`,
      value: totalFinal,
      content: JSON.stringify(orcamentoData)
    });
    setIsOrcamentoModalOpen(false);
    setOrcamentoData({
      clientName: '',
      clientPhone: '',
      clientCNPJ: '',
      clientEmail: '',
      quoteNumber: `ORC-${Date.now().toString().slice(-6)}`,
      items: [{ description: '', unitValue: 0 }],
      discount: 0,
      observations: ''
    });
  };

  const addOrcamentoItem = () => {
    setOrcamentoData({
      ...orcamentoData,
      items: [...orcamentoData.items, { description: '', unitValue: 0 }]
    });
  };

  const removeOrcamentoItem = (index: number) => {
    const newItems = orcamentoData.items.filter((_, i) => i !== index);
    setOrcamentoData({ ...orcamentoData, items: newItems });
  };

  const updateOrcamentoItem = (index: number, field: string, value: any) => {
    const newItems = [...orcamentoData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setOrcamentoData({ ...orcamentoData, items: newItems });
  };

  const handleDownloadPDF = async () => {
    if (!selectedDoc || isGeneratingPDF) return;
    setIsGeneratingPDF(true);
    const element = document.getElementById('printable-doc');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const finalWidth = pdfWidth * 0.95;
      const finalHeight = (canvas.height * finalWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', (pdfWidth - finalWidth) / 2, 5, finalWidth, finalHeight);
      pdf.save(`${selectedDoc.type}_${selectedDoc.id}.pdf`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    const content = document.getElementById('printable-doc')?.innerHTML;
    if (!content) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir Documento</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #333; line-height: 1.4; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 11px; }
            th { background-color: #f8fafc; font-weight: bold; text-transform: uppercase; }
            .header-info { display: grid; grid-template-cols: 1fr 1fr; gap: 15px; margin-bottom: 20px; border-bottom: 2px solid #312e81; padding-bottom: 15px; }
            .info-item { font-size: 11px; margin-bottom: 4px; }
            .totals { margin-left: auto; width: 250px; }
            .total-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; }
            .total-final { font-weight: 900; color: #312e81; border-top: 1px solid #312e81; margin-top: 4px; padding-top: 4px; }
            h2 { text-align: center; text-transform: uppercase; font-size: 18px; margin-bottom: 15px; color: #312e81; }
            .observations { margin-top: 20px; font-size: 10px; color: #666; font-style: italic; border-top: 1px dashed #ddd; padding-top: 10px; }
            .whitespace-pre-wrap { white-space: pre-wrap; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const renderOrcamentoTable = (doc: Documento) => {
    try {
      const o = JSON.parse(doc.content || '{}');
      const subtotal = o.items.reduce((acc: number, item: any) => acc + item.unitValue, 0);
      return (
        <div className="space-y-6 text-left text-gray-900">
          <div className="border-b-2 border-indigo-900 pb-4 mb-4">
            <h2 className="text-center font-black text-xl text-indigo-900 mb-4 uppercase tracking-tighter">Orçamento de Serviços</h2>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[11px]">
              <div><strong>Nº Orçamento:</strong> {o.quoteNumber}</div>
              <div className="text-right"><strong>Data:</strong> {doc.date}</div>
              <div className="col-span-2 mt-2 pt-2 border-t border-gray-100">
                <p className="font-black text-indigo-900 uppercase text-[9px] mb-1">Dados do Cliente</p>
                <div className="grid grid-cols-2 gap-2">
                   <div><strong>Cliente:</strong> {o.clientName}</div>
                   <div><strong>CNPJ/CPF:</strong> {o.clientCNPJ || 'N/A'}</div>
                   <div><strong>Telefone:</strong> {o.clientPhone}</div>
                   <div><strong>E-mail:</strong> {o.clientEmail}</div>
                </div>
              </div>
            </div>
          </div>

          <table className="w-full border-collapse text-[10px]">
            <thead>
              <tr className="bg-gray-50 text-indigo-900">
                <th className="border-b border-gray-200 p-2 text-left">Descrição do Serviço</th>
                <th className="border-b border-gray-200 p-2 text-right">Valor Unitário</th>
              </tr>
            </thead>
            <tbody>
              {o.items.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="p-2">{item.description}</td>
                  <td className="p-2 text-right font-bold">{formatCurrency(item.unitValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-56 space-y-1">
              <div className="flex justify-between text-[11px] text-gray-500">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-red-500 font-bold">
                <span>Desconto:</span>
                <span>- {formatCurrency(o.discount)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-indigo-900 border-t border-indigo-900 pt-1 mt-1">
                <span>TOTAL:</span>
                <span>{formatCurrency(subtotal - o.discount)}</span>
              </div>
            </div>
          </div>

          {o.observations && (
            <div className="mt-8 pt-4 border-t border-gray-100">
              <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Observações:</p>
              <p className="text-[10px] text-gray-600 italic whitespace-pre-wrap">{o.observations}</p>
            </div>
          )}

          <div className="pt-16 text-center">
            <div className="w-64 border-t border-indigo-900 mx-auto pt-1 font-bold text-[10px] uppercase text-indigo-900">
              Validade do Orçamento: 15 dias
            </div>
          </div>
        </div>
      );
    } catch (e) {
      return <p>Erro ao processar dados do orçamento.</p>;
    }
  };

  const renderPontoTable = (docContent: string) => {
    try {
      const p = JSON.parse(docContent);
      const days = Array.from({ length: 31 }, (_, i) => i + 1);
      return (
        <div className="space-y-6 text-left text-gray-900">
          <div className="border-b-2 border-black pb-4 mb-4">
            <h2 className="text-center font-black text-lg mb-4 uppercase tracking-tighter">Folha de Registro de Ponto</h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-[11px]">
              <div><strong>Empregador:</strong> {p.employer}</div>
              <div><strong>Período/Mês:</strong> {p.period}</div>
              <div><strong>Empregado:</strong> {p.employee}</div>
              <div><strong>Admissão:</strong> {p.admission}</div>
              <div className="col-span-2"><strong>Dias de Trabalho:</strong> {p.workDays}</div>
            </div>
          </div>

          <table className="w-full border-collapse border border-black text-[9px]">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-1">DIA</th>
                <th className="border border-black p-1">ENTRADA</th>
                <th className="border border-black p-1">SAÍDA (INT)</th>
                <th className="border border-black p-1">RETORNO</th>
                <th className="border border-black p-1">SAÍDA</th>
                <th className="border border-black p-1">ASSINATURA</th>
              </tr>
            </thead>
            <tbody>
              {days.map(day => (
                <tr key={day} className="h-6">
                  <td className="border border-black font-bold text-center">{day.toString().padStart(2, '0')}</td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                  <td className="border border-black"></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pt-12 text-center">
            <div className="w-64 border-t border-black mx-auto pt-1 font-bold text-[11px] uppercase">
              Assinatura do Empregado
            </div>
          </div>
        </div>
      );
    } catch (e) {
      return <p>Erro ao processar dados da folha de ponto.</p>;
    }
  };

  return (
    <div className="space-y-4 pb-32">
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" placeholder="Buscar documentos..." 
            className="w-full bg-white border border-gray-100 rounded-xl px-11 py-4 text-sm shadow-sm outline-none"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsCreatorOpen(true)}
          className="bg-indigo-700 text-white p-4 rounded-xl shadow-lg active:scale-90 transition-all"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-3">
        {filteredData.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <FileText className="w-16 h-16 text-gray-100 mx-auto" strokeWidth={1} />
            <p className="text-gray-400 text-sm">Nenhum documento encontrado.</p>
          </div>
        ) : (
          filteredData.map(doc => (
            <div key={doc.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between active:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                  {getDocIcon(doc.type)}
                </div>
                <div className="text-left">
                  <p className="font-bold text-indigo-900 text-sm leading-tight">{doc.description}</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold">{doc.date} • {doc.client}</p>
                </div>
              </div>
              <button onClick={() => setSelectedDoc(doc)} className="p-2 text-indigo-400 active:scale-90"><Eye className="w-5 h-5" /></button>
            </div>
          ))
        )}
      </div>

      {isCreatorOpen && (
        <div className="fixed inset-0 z-[150] bg-black/40 backdrop-blur-sm flex items-end p-4" onClick={() => setIsCreatorOpen(false)}>
          <div className="bg-white w-full rounded-t-3xl p-6 space-y-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="font-black text-indigo-900 uppercase text-xs tracking-widest">Opções de Documentos</h3>
              <button onClick={() => setIsCreatorOpen(false)}><X className="text-gray-400" /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 pb-4">
              <button 
                onClick={() => { setIsAIFormOpen(true); setActiveAIType('ia'); setIsCreatorOpen(false); }} 
                className="col-span-2 bg-gradient-to-r from-pink-500 to-indigo-600 p-5 rounded-2xl flex items-center justify-center space-x-3 text-white shadow-lg active:scale-95 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                <span className="font-bold uppercase text-[11px] tracking-widest">Criar com Inteligência Artificial</span>
              </button>
              
              <button 
                onClick={() => { setIsPontoModalOpen(true); setIsCreatorOpen(false); }}
                className="flex flex-col items-center p-4 bg-indigo-50 rounded-xl space-y-2 border border-indigo-100 active:scale-95 transition-all"
              >
                <div className="text-indigo-900"><UserCheck className="w-6 h-6" /></div>
                <span className="text-[9px] font-black text-indigo-800 uppercase">Folha de Ponto</span>
              </button>

              <button 
                onClick={() => { setIsOrcamentoModalOpen(true); setIsCreatorOpen(false); }}
                className="flex flex-col items-center p-4 bg-indigo-50 rounded-xl space-y-2 border border-indigo-100 active:scale-95 transition-all"
              >
                <div className="text-indigo-900"><ClipboardList className="w-6 h-6" /></div>
                <span className="text-[9px] font-black text-indigo-800 uppercase">Orçamento</span>
              </button>

              <button 
                onClick={() => { setIsAIFormOpen(true); setActiveAIType('recibo'); setIsCreatorOpen(false); }}
                className="flex flex-col items-center p-4 bg-indigo-50 rounded-xl space-y-2 border border-indigo-100 active:scale-95 transition-all"
              >
                <div className="text-indigo-900"><FileCheck className="w-6 h-6" /></div>
                <span className="text-[9px] font-black text-indigo-800 uppercase">Gerar Recibo</span>
              </button>

              <button 
                onClick={() => { setIsAIFormOpen(true); setActiveAIType('nota'); setIsCreatorOpen(false); }}
                className="flex flex-col items-center p-4 bg-indigo-50 rounded-xl space-y-2 border border-indigo-100 active:scale-95 transition-all"
              >
                <div className="text-indigo-900"><FileText className="w-6 h-6" /></div>
                <span className="text-[9px] font-black text-indigo-800 uppercase">Nota de Serviço</span>
              </button>

              <button 
                onClick={() => { setIsAIFormOpen(true); setActiveAIType('contrato'); setIsCreatorOpen(false); }}
                className="col-span-2 flex flex-row items-center justify-center p-4 bg-purple-50 rounded-xl space-x-3 border border-purple-100 active:scale-95 transition-all"
              >
                <div className="text-purple-700"><Scale className="w-6 h-6" /></div>
                <span className="text-[9px] font-black text-purple-900 uppercase">Novo Contrato com IA</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Inteligente para Recibo, Contrato e Nota */}
      {isAIFormOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-6 animate-slide-up shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div className="flex items-center space-x-2">
                {getDocIcon(activeAIType)}
                <h2 className="text-xl font-black text-indigo-900 uppercase">Gerador Inteligente</h2>
              </div>
              <button onClick={() => setIsAIFormOpen(false)}><X className="text-gray-400" /></button>
            </div>

            {!aiResult ? (
              <div className="space-y-4 text-left">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Informações para o {activeAIType}
                  </label>
                  <p className="text-[10px] text-indigo-400 italic font-medium">
                    {activeAIType === 'recibo' && "Ex: João Silva me pagou 300 reais pelo conserto do celular."}
                    {activeAIType === 'contrato' && "Ex: Contrato de 3 meses para consultoria de marketing com a empresa X."}
                    {activeAIType === 'nota' && "Ex: Lista de materiais usados e horas gastas na reforma da cozinha."}
                  </p>
                  <textarea 
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm min-h-[120px] focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Descreva aqui os detalhes com suas próprias palavras..."
                    value={aiFormPrompt}
                    onChange={e => setAiFormPrompt(e.target.value)}
                  />
                </div>
                <button 
                  onClick={handleGenerateIA}
                  disabled={aiLoading || !aiFormPrompt}
                  className="w-full bg-indigo-700 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center space-x-2 disabled:bg-gray-300"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Redigindo Documento...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Gerar com Inteligência Artificial</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4 animate-zoom-in">
                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 max-h-[300px] overflow-y-auto text-left">
                  <h4 className="font-black text-indigo-900 text-sm mb-2 uppercase border-b border-indigo-200 pb-1">{aiResult.title}</h4>
                  <p className="text-[11px] text-gray-700 whitespace-pre-wrap leading-relaxed">{aiResult.content}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={() => setAiResult(null)} className="py-4 border border-indigo-100 text-indigo-700 font-bold rounded-xl text-xs uppercase">Refazer</button>
                   <button onClick={handleSaveIADoc} className="py-4 bg-indigo-700 text-white font-black rounded-xl text-xs uppercase shadow-md">Salvar Documento</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Orçamento e Ponto permanecem iguais conforme solicitado nas regras de atualização mínima */}
      {isOrcamentoModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-6 animate-slide-up shadow-2xl my-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black text-indigo-900 uppercase">Novo Orçamento</h2>
              <button onClick={() => setIsOrcamentoModalOpen(false)}><X className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSaveOrcamento} className="space-y-4 text-left">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Informações do Cliente</label>
                <input required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm" placeholder="Nome do Cliente" value={orcamentoData.clientName} onChange={e => setOrcamentoData({...orcamentoData, clientName: e.target.value})} />
                <div className="grid grid-cols-2 gap-2">
                  <input className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm" placeholder="Telefone" value={orcamentoData.clientPhone} onChange={e => setOrcamentoData({...orcamentoData, clientPhone: e.target.value})} />
                  <input className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm" placeholder="CNPJ (Opcional)" value={orcamentoData.clientCNPJ} onChange={e => setOrcamentoData({...orcamentoData, clientCNPJ: e.target.value})} />
                </div>
                <input className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm" placeholder="E-mail" value={orcamentoData.clientEmail} onChange={e => setOrcamentoData({...orcamentoData, clientEmail: e.target.value})} />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Itens do Serviço</label>
                   <button type="button" onClick={addOrcamentoItem} className="text-indigo-600 flex items-center space-x-1 text-[10px] font-bold">
                     <PlusCircle className="w-3 h-3" /> <span>ADICIONAR ITEM</span>
                   </button>
                </div>
                {orcamentoData.items.map((item, idx) => (
                  <div key={idx} className="flex space-x-2 items-start bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex-1 space-y-2">
                      <input required className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs" placeholder="Descrição do serviço" value={item.description} onChange={e => updateOrcamentoItem(idx, 'description', e.target.value)} />
                      <input required type="number" className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold" placeholder="Valor Unitário" value={item.unitValue || ''} onChange={e => updateOrcamentoItem(idx, 'unitValue', parseFloat(e.target.value) || 0)} />
                    </div>
                    {orcamentoData.items.length > 1 && (
                      <button type="button" onClick={() => removeOrcamentoItem(idx)} className="text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Desconto R$</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-red-500" value={orcamentoData.discount || ''} onChange={e => setOrcamentoData({...orcamentoData, discount: parseFloat(e.target.value) || 0})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nº Orçamento</label>
                  <input className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-indigo-900" disabled value={orcamentoData.quoteNumber} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Observações</label>
                <textarea className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm min-h-[60px]" placeholder="Ex: Prazo de entrega 5 dias úteis..." value={orcamentoData.observations} onChange={e => setOrcamentoData({...orcamentoData, observations: e.target.value})} />
              </div>

              <button className="w-full bg-indigo-700 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs">
                Gerar Orçamento Técnico
              </button>
            </form>
          </div>
        </div>
      )}

      {isPontoModalOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-sm rounded-3xl p-6 space-y-6 animate-slide-up shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h2 className="text-xl font-black text-indigo-900">FOLHA DE PONTO</h2>
              <button onClick={() => setIsPontoModalOpen(false)}><X className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSavePonto} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome do Empregador</label>
                <input required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm" placeholder="Empresa ou Nome" value={pontoData.employer} onChange={e => setPontoData({...pontoData, employer: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nome do Empregado</label>
                <input required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm" placeholder="Nome Completo" value={pontoData.employee} onChange={e => setPontoData({...pontoData, employee: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Mês / Ano</label>
                  <input required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm" placeholder="05/2024" value={pontoData.period} onChange={e => setPontoData({...pontoData, period: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Data Admissão</label>
                  <input required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm" placeholder="01/01/2024" value={pontoData.admission} onChange={e => setPontoData({...pontoData, admission: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dias de Trabalho (Escala)</label>
                <input required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm" placeholder="Ex: Seg a Sex, das 08h às 18h" value={pontoData.workDays} onChange={e => setPontoData({...pontoData, workDays: e.target.value})} />
              </div>
              <button className="w-full bg-indigo-700 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-all uppercase tracking-widest text-xs">
                Gerar Folha Técnica
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedDoc && (
        <div className="fixed inset-0 bg-black/60 z-[250] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-zoom-in flex flex-col max-h-[90vh]">
            <div className="bg-indigo-900 p-4 flex justify-between items-center text-white shrink-0">
              <span className="text-[10px] font-black tracking-widest uppercase">{selectedDoc.type} Digital</span>
              <button onClick={() => setSelectedDoc(null)} className="active:scale-90"><X className="w-6 h-6" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
              <div id="printable-doc" className="bg-white p-6 md:p-10 shadow-md min-h-[400px] text-left text-gray-800">
                {selectedDoc.type === 'ponto' && selectedDoc.content ? (
                  renderPontoTable(selectedDoc.content)
                ) : selectedDoc.type === 'orcamento' ? (
                  renderOrcamentoTable(selectedDoc)
                ) : (
                  <div className="space-y-8">
                    <div className="text-center space-y-2 border-b-2 border-gray-100 pb-6">
                      <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{selectedDoc.description}</h2>
                      <p className="text-[9px] text-gray-400 font-bold tracking-widest">ID: {selectedDoc.id}</p>
                    </div>

                    <div className="space-y-6 text-sm leading-relaxed text-justify">
                      {selectedDoc.content ? (
                        <div className="whitespace-pre-wrap">{selectedDoc.content}</div>
                      ) : (
                        <p>O presente documento de tipo <strong>{selectedDoc.type.toUpperCase()}</strong> foi gerado para o cliente <strong>{selectedDoc.client}</strong> na data de {selectedDoc.date}.</p>
                      )}
                      
                      {selectedDoc.value && (
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Valor do Documento</p>
                          <p className="text-3xl font-black text-indigo-900">{formatCurrency(selectedDoc.value)}</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-12 space-y-12">
                      <div className="flex justify-between gap-10">
                          <div className="flex-1 border-t border-gray-900 pt-2 text-center">
                            <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Assinatura</p>
                          </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 grid grid-cols-3 gap-2 bg-white border-t border-gray-50 shrink-0">
              <button onClick={handleDownloadPDF} disabled={isGeneratingPDF} className="flex flex-col items-center justify-center space-y-1 bg-indigo-50 text-indigo-700 font-bold p-3 rounded-xl active:scale-95 transition-all">
                {isGeneratingPDF ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                <span className="text-[10px] uppercase">PDF</span>
              </button>
              <button onClick={handlePrint} className="flex flex-col items-center justify-center space-y-1 bg-indigo-50 text-indigo-700 font-bold p-3 rounded-xl active:scale-95 transition-all">
                <Printer className="w-5 h-5" />
                <span className="text-[10px] uppercase">Imprimir</span>
              </button>
              <button className="flex flex-col items-center justify-center space-y-1 bg-indigo-700 text-white font-bold p-3 rounded-xl active:scale-95 transition-all">
                <Share2 className="w-5 h-5" />
                <span className="text-[10px] uppercase">Enviar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes zoom-in { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-zoom-in { animation: zoom-in 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};
