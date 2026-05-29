/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { Booking } from "./src/types";
import { createClient } from "@supabase/supabase-js";

// Load Environment Variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Supabase Client Safely and dynamically
let activeSupabaseUrl = process.env.SUPABASE_URL || "";
let activeSupabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
let supabaseClient: any = null;

const initSupabaseClient = (url?: string, key?: string) => {
  const finalUrl = url !== undefined ? url : activeSupabaseUrl;
  const finalKey = key !== undefined ? key : activeSupabaseKey;

  if (!finalUrl || !finalKey || finalUrl === "MY_SUPABASE_URL" || finalKey === "MY_SUPABASE_KEY" || finalUrl === "" || finalKey === "") {
    supabaseClient = null;
    return null;
  }
  try {
    supabaseClient = createClient(finalUrl, finalKey);
    activeSupabaseUrl = finalUrl;
    activeSupabaseKey = finalKey;
    process.env.SUPABASE_URL = finalUrl;
    process.env.SUPABASE_SERVICE_ROLE_KEY = finalKey;
    return supabaseClient;
  } catch (error) {
    console.error("Falha ao inicializar o cliente Supabase:", error);
    supabaseClient = null;
    return null;
  }
};

initSupabaseClient();

// Initialize Gemini Client safely using system skill patterns
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("Aviso: GEMINI_API_KEY não foi configurada. Usando mock inteligentes.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
};

// Simulated Database Collections (Syncs with the Supabase Schema in DeveloperHub)
let DB_USERS: Array<{ email: string; nome: string; perfil_estilo: string; telefone?: string; data_cadastro?: Date }> = [
  { email: "comercial.maia@live.com", nome: "Milena Maia", perfil_estilo: "Boho Chic", telefone: "(11) 98765-4321", data_cadastro: new Date() }
];

let DB_QUIZ_RESPONSES: Array<any> = [];

let DB_BOOKINGS: Booking[] = [
  {
    id: "bkg-initial-1",
    userName: "Milena Maia",
    userEmail: "contato.milenamaia@gmail.com",
    phone: "(11) 98765-4321",
    date: "2026-06-15",
    time: "14:00",
    serviceType: "Consultoria Personalizada de Iluminação 💡",
    styleProfile: "Boho Chic",
    notes: "Preciso de spots que criem padrões acolhedores no teto.",
    status: "Confirmado"
  }
];

// Aesthetic templates
const STYLE_DIAGNOSES: Record<string, any> = {
  Japandi: {
    tagline: "O encontro perfeito entre o minimalismo escandinavo e a paz zen japonesa.",
    description: "Seu estilo valoriza a paz, a pureza e a conexão espiritual com o lar. Espaços limpos, luz natural abundante, plantas sutis e móveis baixos definem o ambiente ideal. O aconchego é trazido por texturas naturais, cerâmica wabi-sabi impermeável e madeiras claras refinadas.",
    colors: [
      { name: "Off-white Seda", hex: "#F3F1ED" },
      { name: "Areia Fendi", hex: "#DFD8CE" },
      { name: "Carvalho Refinado", hex: "#D6C7B7" },
      { name: "Cinza Linho Orgânico", hex: "#A8A29A" },
      { name: "Carvão Suave", hex: "#2E3331" }
    ],
    elements: ["Luz natural abundante", "Cerâmica wabi-sabi irregular", "Madeiras claras e bambu", "Móveis baixos e funcionais"],
    productFocus: ["Porcelanatos acetinados areia", "Painéis de freijó ripado", "Lustres de papel de arroz washis", "Móveis com estrutura rente ao chão"]
  },
  "Industrial Moderno": {
    tagline: "Estética urbana crua de Nova York integrada a detalhes arquitetônicos polidos.",
    description: "Você adora a força do tijolo aparente, do cimento queimado e de estruturas metálicas expostas. O contraste entre o preto do ferro maciço fundido, cinza-grafite escuro e madeira de demolição dá o tom rústico sofisticado que exala a autenticidade dos antigos lofts industriais.",
    colors: [
      { name: "Cimento Escovado", hex: "#9E9E9E" },
      { name: "Ferro Fundido Negro", hex: "#1A1D1C" },
      { name: "Tijolo Terracota Queimada", hex: "#A05A4A" },
      { name: "Cobre Escovado Industrial", hex: "#CD7F32" }
    ],
    elements: ["Paredes de concreto texturizado", "Tubulação e vigas expostas", "Estruturas em ferro preto fosco", "Contraste de couro envelhecido marrom"],
    productFocus: ["Revestimento de tijolinhos de argila", "Lâmpadas de filamento de carbono", "Spots direcionáveis em trilhos pretos", "Prateleiras suspensas de vergalhão"]
  },
  "Boho Chic": {
    tagline: "Uma celebração calorosa de texturas étnicas, tecidos naturais e muitas plantas.",
    description: "Livre, convidativo e com muita alma. Seu lar ideal é repleto de peças de artesanato local, palha trançada, tapetes de algodão cru lavados, texturas macrame e tons terrosos quentes como terracota e mostarda, que convidam ao relaxamento, à criatividade e ao aconchego.",
    colors: [
      { name: "Terracota Queimado Suave", hex: "#B2856F" },
      { name: "Mostarda Terrosa", hex: "#E3A857" },
      { name: "Algodão Cru Natural", hex: "#ECE7E1" },
      { name: "Verde Oliva Sage", hex: "#596A5F" }
    ],
    elements: ["Mobiliário de Rattan e Vime entalhado", "Plantas ornamentais de folhas largas", "Macramê trançado e tapetes orientais", "Paredes em pintura de argila ensolarada"],
    productFocus: ["Pisos cerâmicos terracota", "Vasos de barro moldados à mão", "Pendentes de palha natural trançada", "Poltronas aconchegantes com almofadas tecidas"]
  },
  "Rústico Contemporâneo": {
    tagline: "O aconchego acolhedor do campo equilibrado com o conforto moderno.",
    description: "Seu coração pertence a espaços robustos que contam histórias reais. Grandes vigas de madeira no teto, pedras fendi naturais nas paredes, couro caramelo macio e peças Vintage restauradas são harmonizadas perfeitamente com elementos de tecnologia e linhas limpas.",
    colors: [
      { name: "Carvalho de Demolição", hex: "#8B5A2B" },
      { name: "Pedra Calcária Fendi", hex: "#CDC1B4" },
      { name: "Tabaco Profundo", hex: "#4E3629" },
      { name: "Verde Floresta", hex: "#2E5A44" }
    ],
    elements: ["Madeira de demolição maciça com textura", "Pedras naturais esculpidas à mão", "Artigos vintage e couro de celeiro", "Telas e vidraçarias amplas para o jardim"],
    productFocus: ["Ladrilhos hidráulicos artesanais", "Mesas de tampo de madeira maciça", "Puxadores de ferro oxidado retro", "Bancadas em granito escovado escuro"]
  }
};

// ==========================================
// API ROUTES
// ==========================================

// Helper to test if connection to Supabase database actually works
const testConnection = async (client: any) => {
  if (!client) return { ok: false, error: "Nenhum cliente Supabase configurado" };
  try {
    const { data, error } = await client.from("usuarios").select("count").limit(1);
    if (error) {
      if (error.code === "P0001" || error.message?.includes("relation") || error.message?.includes("does not exist")) {
        return { 
          ok: true, 
          warn: "Conectado ao Supabase, mas a tabela 'usuarios' não foi encontrada. Vá até a aba 'Supabase SQL' e execute o script DDL no Editor de SQL do seu painel Supabase." 
        };
      }
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err: any) {
    return { ok: false, error: err.message || String(err) };
  }
};

// GET current Supabase connection status
app.get("/api/config-supabase", async (req, res) => {
  const isConfigured = !!(activeSupabaseUrl && activeSupabaseKey);
  let status = "Not Configured";
  let message = "Supabase não está configurado. Por favor, insira as chaves abaixo.";
  
  if (isConfigured) {
    const check = await testConnection(supabaseClient);
    if (check.ok) {
      status = check.warn ? "Warning" : "Connected";
      message = check.warn || "Conexão ativa e funcionando perfeitamente!";
    } else {
      status = "Error";
      message = `Falha na conexão: ${check.error}`;
    }
  }

  res.json({
    supabaseUrl: activeSupabaseUrl,
    hasKey: !!activeSupabaseKey,
    status,
    message
  });
});

// POST update and save Supabase credentials
app.post("/api/config-supabase", async (req, res) => {
  const { supabaseUrl, supabaseKey } = req.body;
  
  if (!supabaseUrl || !supabaseKey) {
    return res.status(400).json({ error: "URL e Chave são obrigatórios." });
  }

  try {
    const tempClient = createClient(supabaseUrl, supabaseKey);
    const check = await testConnection(tempClient);
    
    if (!check.ok && !check.warn) {
      return res.status(400).json({ error: `Falha ao conectar com estas credenciais: ${check.error}` });
    }

    // Update in-memory state
    initSupabaseClient(supabaseUrl, supabaseKey);

    // Save to .env file for persistence
    try {
      let envContent = "";
      if (fs.existsSync(".env")) {
        envContent = fs.readFileSync(".env", "utf-8");
      } else if (fs.existsSync(".env.example")) {
        envContent = fs.readFileSync(".env.example", "utf-8");
      }
      
      const lines = envContent.split("\n");
      let hasUrl = false;
      let hasKey = false;
      
      const newLines = lines.map(line => {
        if (line.startsWith("SUPABASE_URL=")) {
          hasUrl = true;
          return `SUPABASE_URL="${supabaseUrl}"`;
        }
        if (line.startsWith("SUPABASE_SERVICE_ROLE_KEY=")) {
          hasKey = true;
          return `SUPABASE_SERVICE_ROLE_KEY="${supabaseKey}"`;
        }
        return line;
      });

      if (!hasUrl) {
        newLines.push(`SUPABASE_URL="${supabaseUrl}"`);
      }
      if (!hasKey) {
        newLines.push(`SUPABASE_SERVICE_ROLE_KEY="${supabaseKey}"`);
      }

      fs.writeFileSync(".env", newLines.join("\n"), "utf-8");
    } catch (e: any) {
      console.error("Erro ao escrever no arquivo .env:", e);
    }

    res.json({
      success: true,
      status: check.warn ? "Warning" : "Connected",
      message: check.warn || "Conexão configurada e validada com sucesso!"
    });

  } catch (err: any) {
    res.status(500).json({ error: `Erro na validação de conexão: ${err.message || err}` });
  }
});

// Style Test endpoint (Forms)
app.post("/api/forms", async (req, res) => {
  const { userName, userEmail, phone, answers, winningStyle } = req.body;

  if (!userName || !userEmail || !winningStyle) {
    return res.status(400).json({ error: "Parâmetros obrigatórios ausentes" });
  }

  // Update in-memory user table (case-insensitive search)
  const userEmailClean = userEmail.toLowerCase().trim();
  const existingUserIdx = DB_USERS.findIndex((u) => u.email.toLowerCase().trim() === userEmailClean);
  if (existingUserIdx >= 0) {
    DB_USERS[existingUserIdx].nome = userName;
    DB_USERS[existingUserIdx].perfil_estilo = winningStyle;
    if (phone) {
      DB_USERS[existingUserIdx].telefone = phone;
    }
  } else {
    DB_USERS.push({
      email: userEmailClean,
      nome: userName,
      perfil_estilo: winningStyle,
      telefone: phone || "",
      data_cadastro: new Date()
    });
  }

  // Record quiz answers entry
  DB_QUIZ_RESPONSES.push({
    email: userEmailClean,
    answers,
    winningStyle,
    timestamp: new Date()
  });

  // Save to Supabase if configured
  if (supabaseClient) {
    try {
      const { data: userData, error: userError } = await supabaseClient
        .from("usuarios")
        .upsert(
          {
            email: userEmailClean,
            nome: userName,
            perfil_estilo: winningStyle,
            telefone: phone || null
          },
          { onConflict: "email" }
        )
        .select();

      if (userError) {
        console.error("Erro ao salvar usuário no Supabase:", userError.message);
      } else {
        let userId = null;
        if (userData && userData.length > 0) {
          userId = userData[0].id;
        } else {
          // Fallback select in case RLS limits reading upsert output
          const { data: selectData } = await supabaseClient
            .from("usuarios")
            .select("id")
            .eq("email", userEmailClean)
            .maybeSingle();
          if (selectData) {
            userId = selectData.id;
          }
        }

        if (userId) {
          const { error: quizError } = await supabaseClient
            .from("respostas_forms")
            .insert({
              usuario_id: userId,
              respostas: answers,
              estilo_calculado: winningStyle
            });
          if (quizError) {
            console.error("Erro ao salvar respostas do form no Supabase:", quizError.message);
          }
        }
      }
    } catch (e: any) {
      console.error("Erro geral na operação Supabase:", e.message || e);
    }
  }

  const details = STYLE_DIAGNOSES[winningStyle] || STYLE_DIAGNOSES["Japandi"];

  res.json({
    success: true,
    style: winningStyle,
    userName,
    details
  });
});

// Endpoint to fetch leads (Quiz users registered as marketing/lead contacts)
app.get("/api/leads", async (req, res) => {
  let combinedLeads: Array<{
    id: string;
    nome: string;
    email: string;
    perfil_estilo: string;
    telefone: string;
    data_cadastro: string;
  }> = [];

  // 1. Populate from local in-memory system (DB_USERS)
  DB_USERS.forEach((u, idx) => {
    combinedLeads.push({
      id: `mem-${idx}`,
      nome: u.nome,
      email: u.email.toLowerCase().trim(),
      perfil_estilo: u.perfil_estilo || "Não determinado",
      telefone: u.telefone || "",
      data_cadastro: u.data_cadastro ? u.data_cadastro.toISOString() : new Date().toISOString()
    });
  });

  // 2. Populate from Supabase and merge/update details
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from("usuarios")
        .select("*")
        .order("data_cadastro", { ascending: false });

      if (error) {
        console.error("Erro ao buscar usuários do Supabase:", error.message);
      } else if (data) {
        data.forEach((u: any) => {
          const emailClean = u.email.toLowerCase().trim();
          const existingIdx = combinedLeads.findIndex(l => l.email === emailClean);
          const leadObj = {
            id: u.id || `sub-${Math.random().toString(36).substring(2, 7)}`,
            nome: u.nome,
            email: emailClean,
            perfil_estilo: u.perfil_estilo || "Não determinado",
            telefone: u.telefone || "",
            data_cadastro: u.data_cadastro || u.created_at || new Date().toISOString()
          };

          if (existingIdx >= 0) {
            // Override or update local memory record with Supabase master details
            combinedLeads[existingIdx] = leadObj;
          } else {
            combinedLeads.push(leadObj);
          }
        });
      }
    } catch (e: any) {
      console.error("Erro geral no GET de leads no Supabase:", e.message || e);
    }
  }

  // Sort by registration date descending
  combinedLeads.sort((a, b) => new Date(b.data_cadastro).getTime() - new Date(a.data_cadastro).getTime());

  res.json(combinedLeads);
});

// Bookings endpoints
app.post("/api/bookings", async (req, res) => {
  const { userName, userEmail, phone, date, time, serviceType, styleProfile, notes } = req.body;

  if (!userName || !userEmail || !date || !time) {
    return res.status(400).json({ error: "Faltam informações cruciais para agendamento" });
  }

  const newBooking: Booking = {
    id: `bkg-${Math.random().toString(36).substring(2, 9)}`,
    userName,
    userEmail,
    phone,
    date,
    time: time.substring(0, 5),
    serviceType,
    styleProfile: styleProfile || "Japandi",
    notes,
    status: "Pendente"
  };

  DB_BOOKINGS.unshift(newBooking);

  if (supabaseClient) {
    try {
      // Get user id from email
      const { data: userData } = await supabaseClient
        .from("usuarios")
        .select("id")
        .eq("email", userEmail)
        .maybeSingle();

      const userId = userData ? userData.id : null;

      // Insert into agendamentos table
      const { data: insertedData, error: insertError } = await supabaseClient
        .from("agendamentos")
        .insert({
          usuario_id: userId,
          nome_cliente: userName,
          email_cliente: userEmail,
          telefone: phone,
          data_agendada: date,
          horario_agendado: time,
          tipo_servico: serviceType,
          perfil_estilo_associado: styleProfile || "Japandi",
          observacoes: notes,
          status: "Pendente"
        })
        .select()
        .single();

      if (insertError) {
        console.error("Erro ao inserir agendamento no Supabase:", insertError.message);
      } else if (insertedData) {
        newBooking.id = insertedData.id;
      }
    } catch (e: any) {
      console.error("Erro geral de agendamento no Supabase:", e.message || e);
    }
  }

  res.json({
    success: true,
    booking: newBooking
  });
});

app.get("/api/bookings", async (req, res) => {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from("agendamentos")
        .select("*")
        .order("criado_em", { ascending: false });

      if (error) {
        console.error("Erro ao buscar agendamentos do Supabase:", error.message);
      } else if (data) {
        const mapped: Booking[] = data.map((b: any) => ({
          id: b.id,
          userName: b.nome_cliente,
          userEmail: b.email_cliente,
          phone: b.telefone || "",
          date: b.data_agendada,
          time: b.horario_agendado ? b.horario_agendado.substring(0, 5) : "",
          serviceType: b.tipo_servico,
          styleProfile: b.perfil_estilo_associado || "Japandi",
          notes: b.observacoes || "",
          status: b.status as any
        }));
        return res.json(mapped);
      }
    } catch (e: any) {
      console.error("Erro geral no GET de agendamentos no Supabase:", e.message || e);
    }
  }

  res.json(DB_BOOKINGS);
});

// Chatbot endpoint calling GEMINI server-side (GoogleGenAI)
app.post("/api/chat", async (req, res) => {
  const { message, styleProfile, chatHistory } = req.body;

  if (!message) {
    return res.status(400).json({ error: "A mensagem do usuário é obrigatória." });
  }

  const ai = getGeminiClient();

  // Orchestrator Guidelines (System instruction) requested by user
  const systemInstruction = `Você é o "Orquestrador Inteligente de Design de Interiores UPLar".
Sua função é auxiliar clientes no planejamento de reformas e escolha de revestimentos, compatibilidade estética e decoração.

DIRETRIZES DE ATUAÇÃO E COMUNICAÇÃO:
1. ENTENDER O ESTILO DO CLIENTE:
   O usuário tem o perfil de estilo atualmente calculado como: "${styleProfile}". Use esse perfil de estilo para embasar todas as sugestões de cores, texturas e revestimentos de forma personalizada.
   Se ele não tiver um estilo definido, convide-o amigavelmente a completar o "Teste de Estilo" na nossa barra lateral esquerda.

2. RECOMENDAR PRODUTOS E ECONOMIA:
   Sempre que o usuário procurar produtos (ex: "mesa", "revestimento", "luminárias"), recomende soluções de forma inteligente e oportuna ligando ao nosso comparador de valores de produtos. Indique que comparamos Leroy Merlin, Westwing e Tok&Stok para dar a melhor oferta. Não use os termos "scraper", "raspagem" ou "raspar" em nenhuma resposta.

3. AGENDAMENTO DE CONSULTORIA EXCLUSIVA:
   Se o usuário demonstrar interesse em reuniões de design de 45 min, disser que quer bater um papo detalhado sobre reforma ou solicitar o trabalho de um arquiteto profissional, oriente-o gentilmente a preencher o formulário na aba "Consultorias" do nosso menu para escolher uma data livre de agendamentos no nosso sistema.

4. TOM DE VOZ:
   Elegante, focado em curadoria sofisticada e minimalista. Use os tons e a identidade visual de UPLar (Fundo Fendi Areia, Verde Oliva Sage, e Terracota Queimado) para guiar ideias. Escreva em português do Brasil de forma concisa e amigável, livre de redundâncias técnicas excessivas.`;

  if (ai) {
    try {
      // Execute text task with 'gemini-3.5-flash'
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: message,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.75
        }
      });

      const reply = response.text || "Desculpe, não consegui formular minhas ideias agora. Pode me mandar de novo?";
      return res.json({ reply });
    } catch (err: any) {
      console.error("Falha na chamada com Gemini API:", err.message);
      // Fallback message inside sandy dashboard
      return res.json({
        reply: `Entendi que você gostaria de explorar mais sobre "${message}". No entanto, houve um comportamento temporário com a conexão do servidor Gemini API (Verifique seu GEMINI_API_KEY). \n\nComo arquiteto virtual da **UPLar**, posso antecipar que o estilo ideal sugerido para você é o **${styleProfile}**, combinando acabamentos como o porcelanato acetinado e luminárias de filamento âmbar que comparamos no portal de ofertas!`
      });
    }
  } else {
    // If no API Key is set, return a highly realistic, stylized placeholder matching UPLar guidelines
    const mockReplies: Record<string, string> = {
      default: `Olá! Percebi que a chave do Gemini não está registrada nos Secrets do Workspace, mas vou guiar você como seu arquiteto de interiores UPLar! 

Com base no seu perfil de estilo **${styleProfile}**, os elementos fundamentais para planejar a sua reforma envolvem revestimentos orgânicos e toques sutis de metais nobres (latão ou cobre escovado). 

Se você quiser comparar preços, consulte a aba de **Compare os preços**, onde comparamos Leroy Merlin, Westwing e Tok&Stok em tempo real. E caso queira discutir o design detalhadamente, use a aba de **Consultorias** para pré-reservar seu horário!`
    };

    return res.json({ reply: mockReplies.default });
  }
});

// ==========================================
// DEV SERVER & STATIC ASSETS SETUP
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Vite Dev Server Integration for assets
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // Production statics files serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    // Fallback for custom Express router matching
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[UPLar Server] Executando em http://localhost:${PORT}`);
  });
}

startServer();
