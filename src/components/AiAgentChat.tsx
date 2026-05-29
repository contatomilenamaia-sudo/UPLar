/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";
import { Bot, User, Sparkles, Send, RefreshCw, Calendar, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

interface AiAgentChatProps {
  currentStyleProfile?: string;
  onNavigateToTab?: (tab: string) => void;
}

const QUICK_SUGGESTIONS = [
  { text: "Dicas de paleta de cores para o estilo Japandi 🌿", prompt: "Gostaria de dicas detalhadas sobre como empregar a paleta de cores e texturas do estilo Japandi no meu quarto." },
  { text: "Como baratear uma reforma de cozinha? 💰", prompt: "Quais técnicas e materiais podemos sugerir para reduzir custos em uma reforma de cozinha?" },
  { text: "Agendar uma consultoria de design 📅", prompt: "Quero realizar o agendamento de uma consultoria com um profissional de design de interiores parceiro do UPLar." },
  { text: "Iluminação ideal para sala de estar 💡", prompt: "Qual é o esquema de iluminação recomendado para criar um ambiente aconchegante em uma sala de estar compacta?" }
];

export default function AiAgentChat({ currentStyleProfile, onNavigateToTab }: AiAgentChatProps) {
  const [isMinimized, setIsMinimized] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Olá! Sou o assistente inteligente de interiores do **UPLar**. \n\nPosso ajudar você a escolher móveis e revestimentos ideais, além de planejar sua reforma. Também posso recomendar as melhores opções em marcas parceiras ou auxiliar no agendamento de uma consultoria exclusiva com arquiteto. Como posso apoiar você hoje?",
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "numeric", minute: "2-digit" })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputText).trim();
    if (!textToSend) return;

    if (!customPrompt) {
      setInputText("");
    }

    const userMessage: ChatMessage = {
      id: `usr-${Math.random().toString(36).substring(2, 9)}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "numeric", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      // API payload incorporating user style if known
      const requestPayload = {
        message: textToSend,
        styleProfile: currentStyleProfile || "Nenhum testado ainda",
        chatHistory: messages.map((m) => ({ role: m.sender === "ai" ? "assistant" : "user", text: m.text }))
      };

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        throw new Error("Erro na rede com servidor de IA");
      }

      const backendData = await response.json();
      
      const aiResponse: ChatMessage = {
        id: `ai-${Math.random().toString(36).substring(2, 9)}`,
        sender: "ai",
        text: backendData.reply,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "numeric", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, aiResponse]);

      // Check if response suggests navigating to booking or scraper
      const lowerReply = backendData.reply.toLowerCase();
      if ((lowerReply.includes("agendamento") || lowerReply.includes("consultoria")) && onNavigateToTab) {
        // Soft trigger to inform user they can book below
      }

    } catch (err) {
      console.error(err);
      
      // Fallback response inside sandbox if server/Gemini is missing
      const fallbackReply: ChatMessage = {
        id: `ai-err-${Math.random().toString(36).substring(2, 9)}`,
        sender: "ai",
        text: `Entendi perfeitamente sua busca por "${textToSend}"! \n\n*Nota de Simulação:* Não consegui obter uma resposta ao vivo do servidor Gemini API (Certifique-se de preencher a GEMINI_API_KEY no menu de Secrets para habilitar respostas em tempo real). \n\nNo entanto, com base no seu perfil calculado de **${currentStyleProfile || "Japandi"}**, sugiro integrar revestimentos orgânicos à base de madeira clara Durafloor combinados com os itens de iluminação e decoração na aba de comparação de preços!`,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "numeric", minute: "2-digit" })
      };
      
      setMessages((prev) => [...prev, fallbackReply]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: "welcome-re",
        sender: "ai",
        text: "Chat reiniciado. Como o assistente UPLar pode ajudar a organizar e planejar sua obra hoje?",
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "numeric", minute: "2-digit" })
      }
    ]);
  };

  if (isMinimized) {
    return (
      <div 
        id="uPlar-chat-panel-minimized" 
        onClick={() => setIsMinimized(false)}
        className="bg-white/50 backdrop-blur-sm rounded-3xl border border-white shadow-sm flex flex-col hover:bg-white/70 hover:border-[#5B6347]/30 cursor-pointer transition-all duration-300 p-5 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-full bg-[#5B6347] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-all">
              <Bot className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="text-xs uppercase tracking-widest font-bold text-[#2C2C2C] flex items-center gap-1.5">
                Assistente de Design
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-pulse"></span>
              </h3>
              <p className="text-[10px] text-[#2C2C2C]/60 font-sans mt-0.5">Clique para falar sobre móveis e revestimentos</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] bg-white/80 text-[#2C2C2C] border border-[#2C2C2C]/10 px-2.5 py-1 rounded-full font-mono font-bold uppercase tracking-wider group-hover:bg-[#5B6347] group-hover:text-white group-hover:border-transparent transition-all">
              Responder ✨
            </span>
            <ChevronUp className="w-3.5 h-3.5 text-[#2C2C2C]/40 group-hover:text-[#2C2C2C] transition-colors" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="uPlar-chat-panel" className="bg-white/50 backdrop-blur-sm rounded-3xl border border-white shadow-sm flex flex-col h-[520px] overflow-hidden">
      {/* Header */}
      <div className="bg-[#D1CCC2]/30 px-5 py-4 flex items-center justify-between border-b border-[#2C2C2C]/5">
        <div className="flex items-center gap-3.5">
          <button 
            type="button"
            onClick={() => setIsMinimized(true)}
            className="w-8 h-8 rounded-full bg-[#5B6347]/10 text-[#5B6347] hover:bg-[#5B6347] hover:text-white flex items-center justify-center transition-all cursor-pointer"
            title="Minimizar"
          >
            <Bot className="w-4 h-4" />
          </button>
          <div className="text-left">
            <h3 className="text-xs uppercase tracking-widest font-bold text-[#2C2C2C]">Especialista de Interiores</h3>
            <span className="text-[9px] font-mono text-[#5B6347] flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block animate-ping"></span>
              ORQUESTRAÇÃO ATIVA
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {currentStyleProfile && (
            <span className="text-[9px] bg-[#C68B77] text-white px-2.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
              {currentStyleProfile}
            </span>
          )}
          <button
            id="btn-clear-chat"
            onClick={handleClearChat}
            title="Limpar Conversa"
            className="p-1.5 hover:bg-[#D1CCC2]/60 text-[#2C2C2C]/60 hover:text-[#2C2C2C] rounded-lg transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-minimize-chevron"
            onClick={() => setIsMinimized(true)}
            title="Minimizar Conversa"
            className="p-1.5 hover:bg-[#D1CCC2]/60 text-[#2C2C2C]/60 hover:text-[#2C2C2C] rounded-lg transition-all cursor-pointer"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto space-y-4 bg-white/10 scrollbar-thin">
        {messages.map((message) => {
          const isAi = message.sender === "ai";
          return (
            <div key={message.id} className={`flex gap-3 max-w-[85%] ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}>
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-xs ${
                  isAi ? "bg-[#5B6347]" : "bg-[#C68B77]"
                }`}
              >
                {isAi ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>

              <div className="space-y-1">
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed prose prose-sm ${
                    isAi
                      ? "bg-white/90 text-[#2C2C2C] rounded-tl-none border border-[#2C2C2C]/5 shadow-xs"
                      : "bg-[#2C2C2C] text-[#E5E1D8] rounded-tr-none"
                  }`}
                >
                  {/* Simplistic formatting renderer for basic bolding, breaks & lists */}
                  {message.text.split("\n").map((paragraph, index) => {
                    if (!paragraph.trim()) return <div key={index} className="h-2"></div>;
                    
                    // Simple bold check (Ex: **text**)
                    let elements: React.ReactNode[] = [];
                    let remaining = paragraph;
                    let keyIdx = 0;
                    
                    while (remaining.includes("**")) {
                      const startIndex = remaining.indexOf("**");
                      const endIndex = remaining.indexOf("**", startIndex + 2);
                      if (endIndex === -1) break;
 
                      // Prior text
                      if (startIndex > 0) {
                        elements.push(<span key={keyIdx++}>{remaining.substring(0, startIndex)}</span>);
                      }
                      
                      // Bold text
                      elements.push(
                        <strong key={keyIdx++} className={isAi ? "text-[#2C2C2C] font-bold" : "text-white font-bold"}>
                          {remaining.substring(startIndex + 2, endIndex)}
                        </strong>
                      );
                      
                      remaining = remaining.substring(endIndex + 2);
                    }
                    elements.push(<span key={keyIdx++}>{remaining}</span>);
 
                    // Check if bullet point
                    const isBullet = paragraph.trim().startsWith("*") || paragraph.trim().startsWith("-");
                    if (isBullet) {
                      return (
                        <li key={index} className="list-disc list-inside ml-2 py-0.5 font-sans">
                          {elements}
                        </li>
                      );
                    }
 
                    return <p key={index} className="font-sans text-xs m-0">{elements}</p>;
                  })}
                </div>
                <span className="text-[9px] font-mono text-[#2C2C2C]/40 block text-right font-medium tracking-wider">
                  {message.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="w-7 h-7 rounded-full bg-[#5B6347] flex items-center justify-center text-white flex-shrink-0 animate-pulse shadow-xs">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white/90 text-[#2C2C2C] p-3.5 rounded-2xl rounded-tl-none border border-[#2C2C2C]/5 text-xs flex items-center gap-2 shadow-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#5B6347]" />
              <span className="text-[11px] font-sans">O orquestrador UPLar está compilando soluções...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggestion Pills */}
      {messages.length < 3 && (
        <div className="p-3 border-t border-[#2C2C2C]/5 bg-white/20 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none scroll-smooth">
          {QUICK_SUGGESTIONS.map((sug, i) => (
            <button
              id={`quick-sug-${i}`}
              key={i}
              onClick={() => handleSendMessage(sug.prompt)}
              className="text-[10px] font-sans text-[#2C2C2C]/80 hover:text-[#2C2C2C] bg-white/80 hover:bg-[#D1CCC2]/30 border border-[#2C2C2C]/10 rounded-full px-3 py-1.5 transition-colors cursor-pointer flex-shrink-0"
            >
              {sug.text}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Field */}
      <div className="p-3 bg-white border-t border-[#2C2C2C]/5 flex items-center gap-2">
        <input
          id="chat-user-message-input"
          type="text"
          placeholder="Pergunte sobre materiais, preços ou agende consultorias..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 text-xs bg-[#D1CCC2]/10 placeholder-[#2C2C2C]/40 border border-[#2C2C2C]/10 rounded-2xl px-4 py-3 text-[#2C2C2C] outline-none focus:ring-1 focus:ring-[#5B6347] focus:border-[#5B6347]"
        />
        <button
          id="btn-send-message"
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || loading}
          className="bg-[#5B6347] hover:bg-[#464D36] text-white p-3 rounded-2xl transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
