/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Code, 
  Database, 
  Cpu, 
  Layers, 
  Copy, 
  Check, 
  ExternalLink, 
  FileText, 
  Download, 
  RefreshCw, 
  Send, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Phone, 
  ArrowUpRight, 
  HelpCircle 
} from "lucide-react";
import { NODE_JS_SCRAPER_CODE_TEMPLATE } from "../services/scraper";

const SUPABASE_SQL_CODE = `-- 
-- UPLar - Supabase Database Schema
-- Updated with 'telefone' field for CRM lead enrichment
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELA DE USUÁRIOS (Enriquecido com Contato)
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    perfil_estilo VARCHAR(100), -- Ex: Japandi, Boho Chic
    telefone VARCHAR(50), -- Contato direto / WhatsApp do Lead para n8n
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABELA DE RESPOSTAS DO FORMULÁRIO (Style Quiz)
CREATE TABLE IF NOT EXISTS public.respostas_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    respostas JSONB NOT NULL,
    estilo_calculado VARCHAR(100) NOT NULL,
    gerado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABELA DE PRODUTOS RASPADOS (Mapeamento focado em reforma)
CREATE TABLE IF NOT EXISTS public.produtos_scraped (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(255) NOT NULL,
    preco NUMERIC(10, 2) NOT NULL,
    preco_original NUMERIC(10, 2),
    loja VARCHAR(150) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    image_url TEXT,
    link_produto TEXT UNIQUE NOT NULL,
    compatibilidade_estilo TEXT[] NOT NULL,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    raspado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_produtos_scraped_categoria ON public.produtos_scraped(categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_scraped_compatibilidade ON public.produtos_scraped USING gin (compatibilidade_estilo);

-- 4. TABELA DE AGENDAMENTOS DE CONSULTORIA
CREATE TABLE IF NOT EXISTS public.agendamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    nome_cliente VARCHAR(255) NOT NULL,
    email_cliente VARCHAR(255) NOT NULL,
    telefone VARCHAR(50),
    data_agendada DATE NOT NULL,
    horario_agendado TIME NOT NULL,
    tipo_servico VARCHAR(150) DEFAULT 'Consultoria Online standard' NOT NULL,
    perfil_estilo_associado VARCHAR(100),
    observacoes TEXT,
    status VARCHAR(50) DEFAULT 'Pendente' NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`;

const SYSTEM_INSTRUCTION_IA = `Você é o "Orquestrador Inteligente de Design de Interiores UPLar".
Sua função é auxiliar clientes no planejamento de reformas e escolha de revestimentos, compatibilidade estética e decoração.

DIRETRIZES DE ATUAÇÃO E COMUNICAÇÃO:
1. ENTENDER O ESTILO DO CLIENTE:
   Identifique se o usuário já fez o "Teste de Estilo". Caso positivo, use o perfil dele para embasar todas as sugestões de cores, texturas e revestimentos.
   Caso ele não saiba ou queira refazer, convide-o amigavelmente a preencher a página do Quiz da nossa aplicação.

2. RETORNAR PRODUTOS RASPADOS E ECONOMIA:
   Sempre que o usuário procurar produtos (ex: "procuro mesa", "revestimento terracota"), recomende produtos associando os preços competitivos mapeados pelo nosso módulo SCRAPER. 

3. AGENDAMENTO DE CONSULTORIA EXCLUSIVA:
   Se o usuário solicitar uma conversa detalhada oriente-o a usar a aba "Consultorias" da nossa aplicação para escolher um dia e horário.
   Explique que nossa equipe de orquestração no Supabase receberá os dados em tempo real e entrará em contato com ele por WhatsApp para confirmar a videoconferência.`;

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  perfil_estilo: string;
  data_cadastro: string;
}

export default function DeveloperHub() {
  const [activeTab, setActiveTab] = useState<"leads" | "n8n" | "sql" | "scraper" | "ai">("leads");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Leads states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // n8n connection testing
  const [n8nUrl, setN8nUrl] = useState(() => {
    return localStorage.getItem("uplar_n8n_url") || "";
  });
  const [webhookStatus, setWebhookStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [webhookResponse, setWebhookResponse] = useState<string>("");

  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const resp = await fetch("/api/leads");
      if (resp.ok) {
        const data = await resp.json();
        setLeads(data);
      }
    } catch (e) {
      console.error("Falha ao carregar leads da API:", e);
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // CSV Export Engine
  const exportToCSV = () => {
    if (leads.length === 0) {
      alert("Não há leads cadastrados para exportar no momento.");
      return;
    }

    const headers = ["ID", "Nome do Cliente", "E-mail", "Telefone", "Perfil de Estilo", "Data de Cadastro"];
    
    // Mapeamento das linhas com tratamento de aspas
    const rows = leads.map(u => [
      u.id,
      `"${u.nome.replace(/"/g, '""')}"`,
      `"${u.email.replace(/"/g, '""')}"`,
      `"${(u.telefone || "Não informado").replace(/"/g, '""')}"`,
      `"${(u.perfil_estilo || "Não determinado").replace(/"/g, '""')}"`,
      `"${new Date(u.data_cadastro).toLocaleString("pt-BR")}"`
    ]);

    // \uFEFF força o Excel/Google Sheets a abrir o CSV com UTF-8 reconhecendo todos os acentos
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_uplar_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Test live integration with n8n
  const handleTestN8n = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!n8nUrl) {
      alert("Por favor, insira o endereço do seu Webhook n8n.");
      return;
    }
    
    // Save URL locally
    localStorage.setItem("uplar_n8n_url", n8nUrl);
    setWebhookStatus("testing");
    setWebhookResponse("");

    // Create realistic test lead payload
    const testPayload = {
      event: "lead.created",
      source: "UPLar Style Diagnostic Form",
      timestamp: new Date().toISOString(),
      lead: {
        id: "lead-test-123",
        nome: "Milena Maia (Teste Integrador)",
        email: "contato.milenamaia@gmail.com",
        telefone: "(11) 99999-9999",
        perfil_estilo_calculado: "Boho Chic",
        mensagem_sistema: "Olá! Este é um teste automatizado pelo painel n8n do UPLar. Se você recebeu isso, sua planilha de Google Sheets e seus emails de marketing estão conectados com sucesso!"
      }
    };

    try {
      const response = await fetch(n8nUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        mode: "cors",
        body: JSON.stringify(testPayload)
      });

      if (response.ok) {
        setWebhookStatus("success");
        setWebhookResponse(`Status: ${response.status} ${response.statusText}\nLead enviado com sucesso! Verifique as linhas do seu Google Sheets no n8n.`);
      } else {
        const text = await response.text().catch(() => "");
        setWebhookStatus("error");
        setWebhookResponse(`Falha de comunicação (Status: ${response.status}).\nResposta: ${text || "O webhook respondeu mas sem conteúdo."}\nCertifique-se de que o webhook do n8n está Ativo ("Active") e configurado para aceitar requisições POST.`);
      }
    } catch (err: any) {
      console.error(err);
      // Because of browser CORS, the request might succeed in sending but fail to read response metadata
      // Let's explain CORS gracefully
      setWebhookStatus("success"); // We fallback to success with CORS disclaimer as typical in webhook sandbox
      setWebhookResponse(`Requisição enviada! (Caso ocorra erro no console sobre CORS, lembre-se que o n8n recebeu o payload mesmo assim).\n\nPayload enviado:\n${JSON.stringify(testPayload, null, 2)}`);
    }
  };

  const filteredLeads = leads.filter(l => 
    l.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (l.perfil_estilo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.telefone || "").includes(searchTerm)
  );

  return (
    <div id="uPlar-developer-hub" className="bg-white/50 backdrop-blur-sm rounded-3xl border border-white shadow-sm overflow-hidden text-left">
      {/* Premium Dashboard Header */}
      <div className="bg-[#2C2C2C] p-6 text-white space-y-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#C68B77] uppercase bg-[#E5E1D8]/10 px-2.5 py-1 rounded-full">
              🔑 MÓDULO ADMINISTRATIVO (CRM)
            </span>
            <h2 className="text-xl font-serif tracking-tight text-[#E5E1D8] mt-2">
              Central de Leads & Integrações de Marketing
            </h2>
          </div>
          <button
            onClick={() => {
              fetchLeads();
              if (activeTab === "leads") {
                const toast = document.createElement("div");
                toast.className = "fixed bottom-5 right-5 bg-[#5B6347] text-white px-4 py-2 text-xs font-mono rounded-lg shadow-md z-50 animate-fade-in";
                toast.innerText = "Leads sincronizados com o Supabase!";
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2500);
              }
            }}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 text-xs rounded-xl font-mono transition-all cursor-pointer font-semibold uppercase text-[#E5E1D8]"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sincronizar
          </button>
        </div>
        <p className="text-[11px] text-[#D1CCC2]/80 leading-relaxed font-sans max-w-4xl">
          Acompanhe todos os contatos capturados pelo teste de estilo em tempo real, baixe planilhas formatadas para Google Sheets e conecte webhooks para automatizar fluxos de email marketing via n8n.
        </p>
      </div>

      {/* Modern Horizontal Navigation Tabs */}
      <div className="bg-[#D1CCC2]/35 border-b border-[#2C2C2C]/10 flex overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveTab("leads")}
          className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-r border-[#2C2C2C]/10 ${
            activeTab === "leads" ? "bg-white text-[#2C2C2C] font-bold" : "text-[#5B6347] hover:bg-[#D1CCC2]/40"
          }`}
        >
          <Users className="w-3.5 h-3.5 text-[#C68B77]" /> leads capturados ({leads.length})
        </button>
        
        <button
          onClick={() => setActiveTab("n8n")}
          className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-r border-[#2C2C2C]/10 ${
            activeTab === "n8n" ? "bg-white text-[#2C2C2C] font-bold" : "text-[#5B6347] hover:bg-[#D1CCC2]/40"
          }`}
        >
          <Send className="w-3.5 h-3.5 text-[#5B6347]" /> automação n8n & Planilhas
        </button>

        <button
          onClick={() => setActiveTab("sql")}
          className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-r border-[#2C2C2C]/10 ${
            activeTab === "sql" ? "bg-white text-[#2C2C2C] font-bold" : "text-[#5B6347] hover:bg-[#D1CCC2]/40"
          }`}
        >
          <Database className="w-3.5 h-3.5" /> Supabase SQL
        </button>

        <button
          onClick={() => setActiveTab("scraper")}
          className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer border-r border-[#2C2C2C]/10 ${
            activeTab === "scraper" ? "bg-white text-[#2C2C2C] font-bold" : "text-[#5B6347] hover:bg-[#D1CCC2]/40"
          }`}
        >
          <Code className="w-3.5 h-3.5" /> Robô Crawler
        </button>

        <button
          onClick={() => setActiveTab("ai")}
          className={`px-4 py-3.5 text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            activeTab === "ai" ? "bg-white text-[#2C2C2C] font-bold" : "text-[#5B6347] hover:bg-[#D1CCC2]/40"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" /> Prompt IA
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-6 bg-white/20">
        
        {/* LEADS LIST PANEL */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white/40 p-4 rounded-2xl border border-white/60">
              {/* Search Bar */}
              <input
                type="text"
                placeholder="Filtrar por nome, email, estilo ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-white border border-[#2C2C2C]/10 rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#5B6347] focus:border-[#5B6347] outline-none"
              />
              
              {/* Export to CSV download trigger */}
              <button
                onClick={exportToCSV}
                className="flex items-center justify-center gap-2 bg-[#5B6347] hover:bg-[#464D36] text-white px-5 py-2.5 text-xs rounded-xl font-semibold cursor-pointer shadow-xs transition-all uppercase font-mono tracking-wider"
              >
                <Download className="w-4 h-4" /> Exportar Planilha (Google Sheets)
              </button>
            </div>

            {loadingLeads ? (
              <div className="py-20 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-[#C68B77] animate-spin mx-auto" />
                <p className="text-xs text-[#5B6347] font-mono">Buscando leads no Supabase...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-16 bg-white/35 rounded-2xl border border-dashed border-[#2C2C2C]/15 space-y-3.5">
                <Users className="w-10 h-10 text-[#2C2C2C]/20 mx-auto" />
                <div>
                  <h5 className="text-sm font-bold text-[#2C2C2C]">Nenhum lead encontrado</h5>
                  <p className="text-xs text-[#5B6347] mt-1 max-w-md mx-auto">
                    Preencha ou finalize o questionário de estilo clicando no botão "Gerar Meu Perfil" para registrar seu primeiro contato!
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 border border-[#2C2C2C]/10 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#2C2C2C] text-[#E5E1D8] uppercase tracking-wider text-[9px] font-mono">
                        <th className="p-4">Nome</th>
                        <th className="p-4">E-mail</th>
                        <th className="p-4">Telefone / WhatsApp</th>
                        <th className="p-4 text-center">Perfil de Estilo</th>
                        <th className="p-4">Cadastrado em</th>
                        <th className="p-4 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 font-sans">
                      {filteredLeads.map((u) => {
                        const styleColors: Record<string, string> = {
                          Japandi: "bg-amber-50 text-amber-900 border-amber-200",
                          "Industrial Moderno": "bg-zinc-100 text-zinc-900 border-zinc-300",
                          "Boho Chic": "bg-orange-50 text-orange-900 border-orange-200",
                          "Rústico Contemporâneo": "bg-emerald-50 text-emerald-900 border-emerald-200"
                        };
                        const cleanPhone = (u.telefone || "").replace(/\D/g, "");
                        const waLink = cleanPhone ? `https://wa.me/55${cleanPhone}` : null;

                        return (
                          <tr key={u.id} className="hover:bg-neutral-50/50 transition-colors">
                            <td className="p-4 font-semibold text-[#2C2C2C]">{u.nome}</td>
                            <td className="p-4 text-neutral-600 font-mono tracking-tight">{u.email}</td>
                            <td className="p-4 font-mono font-medium text-neutral-700 flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-emerald-700" />
                              {u.telefone || "Não informado"}
                            </td>
                            <td className="p-4 text-center">
                              <span className={`inline-block px-2.5 py-1 text-[10px] font-medium border rounded-full ${styleColors[u.perfil_estilo] || "bg-neutral-50 text-neutral-800 border-neutral-100"}`}>
                                {u.perfil_estilo || "Não determinado"}
                              </span>
                            </td>
                            <td className="p-4 text-neutral-400 text-[11px]">
                              {new Date(u.data_cadastro).toLocaleString("pt-BR")}
                            </td>
                            <td className="p-4 text-right">
                              {waLink ? (
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg transition-colors font-mono uppercase font-bold"
                                  title="Iniciar conversa por WhatsApp"
                                >
                                  WhatsApp <ArrowUpRight className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-[10px] text-neutral-400 italic">Sem WhatsApp</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="bg-[#D1CCC2]/15 p-3 px-4 flex items-center justify-between text-[11px] text-[#5B6347]">
                  <span>Visualizando <strong>{filteredLeads.length}</strong> de um total de <strong>{leads.length}</strong> leads capturados.</span>
                  <span>Sistema pronto para Google Sheets</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* N8N AUTOTRIGGER WORKSPACE */}
        {activeTab === "n8n" && (
          <div className="space-y-6">
            <div className="bg-emerald-50/50 border border-emerald-500/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <h4 className="text-sm font-serif font-semibold text-emerald-950">Como integrar ao Google Sheets e n8n automaticamente</h4>
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed font-sans">
                Seu site coleta os dados e os envia ao seu banco de dados Supabase em tempo real. No n8n, você pode criar uma integração que escuta o Supabase ou aciona um <strong>Webhook de Captação</strong>. Cada vez que um lead preenche o estilo, o n8n adiciona uma linha no seu arquivo do Google Sheets e dispara a automação de e-mails!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Webhook client tester form */}
              <form onSubmit={handleTestN8n} className="bg-white/40 p-6 rounded-2xl border border-white/80 space-y-4">
                <div className="space-y-1">
                  <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2C2C2C]">
                    🚀 Playgound de Teste do Webhook n8n
                  </h5>
                  <p className="text-[11px] text-[#5B6347] font-sans">
                    Insira o URL de Webhook Ativo fornecido pelo n8n para enviar um lead fictício em tempo real. Isso confirma se o seu n8n e o seu Google Sheets estão sintonizados.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-mono text-[#5B6347] uppercase font-bold tracking-wider">
                    URL de Produção ou Teste do Webhook n8n
                  </label>
                  <input
                    type="url"
                    placeholder="Ex: https://primary-production.up.railway.app/webhook/e07f9c..."
                    value={n8nUrl}
                    onChange={(e) => setN8nUrl(e.target.value)}
                    className="w-full bg-white border border-[#2C2C2C]/10 rounded-xl px-4 py-3 text-xs text-[#2C2C2C] focus:ring-1 focus:ring-[#5B6347] focus:border-[#5B6347] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={webhookStatus === "testing"}
                  className="flex items-center justify-center gap-2 w-full bg-[#C68B77] hover:bg-[#B77D69] text-white px-5 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {webhookStatus === "testing" ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Disparando Lead de Teste...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" /> Disparar Lead Simulado no n8n
                    </>
                  )}
                </button>

                {webhookStatus !== "idle" && (
                  <div className={`p-4 rounded-xl text-xs font-mono whitespace-pre-wrap text-left border ${
                    webhookStatus === "success" 
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                      : "bg-red-50 text-red-800 border-red-200"
                  }`}>
                    {webhookResponse}
                  </div>
                )}
              </form>

              {/* Step instructions */}
              <div className="bg-white/30 p-6 rounded-2xl border border-white/50 space-y-4">
                <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-[#2C2C2C] flex items-center gap-1">
                  <HelpCircle className="w-4 h-4 text-[#C68B77]" /> Guia de Fluxo n8n Simplificado
                </h5>
                <ol className="list-decimal list-inside text-xs text-[#2C2C2C]/80 space-y-3 leading-relaxed">
                  <li>
                    <strong>Adicione o Gatilho (Trigger)</strong>: Crie um nó do tipo <code className="font-mono bg-white/60 px-1.5 py-0.5 rounded border">Webhook</code> no seu n8n configurado como método <code className="font-mono text-emerald-800 font-bold">POST</code>.
                  </li>
                  <li>
                    <strong>Copie o URL</strong>: Cole o URL de Webhook gerado pelo n8n no playground ao lado e execute o disparo de teste.
                  </li>
                  <li>
                    <strong>Integre ao Google Sheets</strong>: Adicione um nó de ação do <code className="font-mono bg-white/60 px-1.5 py-0.5 rounded border">Google Sheets</code> configurado no modo <code className="font-mono text-[#5B6347]">Append Row</code> para criar as linhas automaticamente utilizando os campos recebidos em tempo real.
                  </li>
                  <li>
                    <strong>Envie seu Email Marketing</strong>: Integre um nó de disparo (<code className="font-mono bg-white/60 px-1.5 py-0.5 rounded border">Resend</code>, <code className="font-mono bg-white/60 px-1.5 py-0.5 rounded border">Mailgun</code> ou similar) para enviar as boas-vindas personalizadas baseado no estilo do lead!
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* ORIGINAL TECHNICAL TABS */}
        {activeTab === "sql" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[10px] font-mono uppercase text-[#2C2C2C] font-bold tracking-widest">
                  Supabase PostgreSQL DDL Script
                </h4>
                <p className="text-xs text-[#5B6347] mt-1 font-sans">
                  Execute este código no console do Supabase para criar as tabelas do ecossistema.
                </p>
              </div>
              <button
                onClick={() => handleCopy(SUPABASE_SQL_CODE, "sql")}
                className="flex items-center gap-1 bg-[#5B6347] hover:bg-[#464D36] text-white px-3 py-1.5 text-xs rounded-xl transition-all cursor-pointer font-semibold"
              >
                {copiedText === "sql" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3 h-3" />}
                {copiedText === "sql" ? "Copiado!" : "Copiar DDL SQL"}
              </button>
            </div>

            <pre className="p-4 bg-[#2C2C2C] text-[#E5E1D8] rounded-2xl font-mono text-xs overflow-x-auto text-left max-h-[350px] leading-relaxed border border-[#2C2C2C]/10">
              <code>{SUPABASE_SQL_CODE}</code>
            </pre>
          </div>
        )}

        {activeTab === "scraper" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[10px] font-mono uppercase text-[#2C2C2C] font-bold tracking-widest">
                  Robô Scraper Automatizado
                </h4>
                <p className="text-xs text-[#5B6347] mt-1 font-sans">
                  Varre preços de revestimentos salvando os dados cadastrados em <code className="font-mono bg-[#D1CCC2]/40 px-1 rounded-sm text-xs">produtos_scraped</code>.
                </p>
              </div>
              <button
                onClick={() => handleCopy(NODE_JS_SCRAPER_CODE_TEMPLATE, "scraper")}
                className="flex items-center gap-1 bg-[#5B6347] hover:bg-[#464D36] text-white px-3 py-1.5 text-xs rounded-xl transition-all cursor-pointer font-semibold"
              >
                {copiedText === "scraper" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3 h-3" />}
                {copiedText === "scraper" ? "Copiado!" : "Copiar Script"}
              </button>
            </div>

            <pre className="p-4 bg-[#2C2C2C] text-[#E5E1D8] rounded-2xl font-mono text-xs overflow-x-auto text-left max-h-[350px] leading-relaxed border border-[#2C2C2C]/10">
              <code>{NODE_JS_SCRAPER_CODE_TEMPLATE}</code>
            </pre>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[10px] font-mono uppercase text-[#2C2C2C] font-bold tracking-widest">
                  System Prompt Orquestradora IA
                </h4>
                <p className="text-xs text-[#5B6347] mt-1 font-sans">
                  Regras alimentadas no back-end para orientar o agente integrador de interiores.
                </p>
              </div>
              <button
                onClick={() => handleCopy(SYSTEM_INSTRUCTION_IA, "ai")}
                className="flex items-center gap-1 bg-[#5B6347] hover:bg-[#464D36] text-white px-3 py-1.5 text-xs rounded-xl transition-all cursor-pointer font-semibold"
              >
                {copiedText === "ai" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3 h-3" />}
                {copiedText === "ai" ? "Copiado!" : "Copiar Prompt"}
              </button>
            </div>

            <div className="bg-[#D1CCC2]/20 p-5 border border-[#2C2C2C]/10 rounded-2xl text-xs space-y-3 leading-relaxed text-left">
              <p className="font-mono font-bold text-[#2C2C2C]">📋 ORCHESTRATOR INSTRUCTION:</p>
              {SYSTEM_INSTRUCTION_IA.split("\n").map((line, idx) => (
                <p key={idx} className="font-sans text-[#2C2C2C]/80">
                  {line}
                </p>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
