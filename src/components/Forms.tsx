/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FormAnswers, HomeStyleInfo } from "../types";
import { Sparkles, Check, ChevronRight, ChevronLeft, RefreshCw, Compass, Sliders } from "lucide-react";

export interface UserAuth {
  name: string;
  email: string;
  provider: "Google" | "Apple" | "Facebook";
  avatarUrl: string;
}

interface FormsProps {
  onStyleCalculated: (style: string, info: any, userObj?: { name: string; email: string }) => void;
  savedStyle?: string;
  currentUser?: UserAuth | null;
  onLogin?: (user: UserAuth) => void;
}

const QUESTIONS = [
  {
    id: "cozinha",
    title: "1. Como seria a cozinha dos seus sonhos?",
    category: "Cozinha",
    options: [
      {
        key: "A",
        text: "Armários de madeira clara, bancada em quartzo branco e detalhes minimalistas livres de puxadores.",
        image: "https://s2.glbimg.com/chSR2cFhs_HYW7rT7-PL2y6E2fY=/smart/e.glbimg.com/og/ed/f/original/2021/02/18/decor-do-dia-cozinha-minimalista-reune-praticidade-toques-cor_1.jpg",
        styles: { Japandi: 3, Minimalista: 2 }
      },
      {
        key: "B",
        text: "Móveis escuros com puxadores em ferro preto fundido, luminárias aramadas e tijolinhos aparentes.",
        image: "https://planner5d.com/blog/content/images/2025/03/estilo-industrial-na-decoracao-6.jpg",
        styles: { "Industrial Moderno": 3 }
      },
      {
        key: "C",
        text: "Prateleiras abertas exibindo potes de cerâmica artesanal, cestas de vime e plantas penduradas pelas janelas.",
        image: "https://www.selfstorageembh.com.br/wp-content/uploads/2024/01/cozinha-rustica03.jpg",
        styles: { "Boho Chic": 3, "Rústico Contemporâneo": 1 }
      },
      {
        key: "D",
        text: "Móveis de madeira rústica entalhada, pia em pedra natural esculpida e fogão à lenha ou estilo clássico de ferro.",
        image: "https://lh4.googleusercontent.com/IDoSZ7jkvyMOtpDjjGblZeYxMtSIQ1VnUgJmD5ZXx5NrmvFcZOycF1Sjcdd5Snt8TR0GfLhT61lTnV8dcXqixvf2qS8oCr5E7I8RsEINPxXsh3hflcDu-ig4ZV5K7BImkFCc85J1rIo_oJeXpChe4tYgdM0rLbrcZ-RQYbnRDxVO80ag5jKZ1_9BCqIlPnP3JpnH6AkRMQ",
        styles: { "Rústico Contemporâneo": 3, "Boho Chic": 1 }
      }
    ]
  },
  {
    id: "cores",
    title: "2. Qual paleta de cores para sala de estar fala direto ao seu coração?",
    category: "Cores",
    options: [
      {
        key: "A",
        text: "Tons areia, algodão cru, cinza suave e toques sutis de madeira clara japonesa.",
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=400&q=80",
        styles: { Japandi: 3, Minimalista: 2 }
      },
      {
        key: "B",
        text: "Cimento queimado, cinza grafite escuro, detalhes em aço galvanizado e preto fosco.",
        image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=400&q=80",
        styles: { "Industrial Moderno": 3 }
      },
      {
        key: "C",
        text: "Terracota queimado, bege quente, mostarda terrosa e verde sage mediterrâneo.",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=400&q=80",
        styles: { "Boho Chic": 3, "Rústico Contemporâneo": 1 }
      },
      {
        key: "D",
        text: "Marrom tabaco, couro caramelo natural, pedra rústica fendi e tijolo de barro cozido.",
        image: "https://images.unsplash.com/photo-1615876234886-fd9a39faa97f?auto=format&fit=crop&w=400&q=80",
        styles: { "Rústico Contemporâneo": 3, "Industrial Moderno": 1 }
      }
    ]
  },
  {
    id: "revestimento",
    title: "3. Qual é sua preferência absoluta para o revestimento do piso?",
    category: "Revestimento",
    options: [
      {
        key: "A",
        text: "Piso de madeira natural em tom carvalho bem claro e toque acetinado.",
        image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80",
        styles: { Japandi: 3, "Rústico Contemporâneo": 1 }
      },
      {
        key: "B",
        text: "Concreto usinado polido ou porcelanato cinza imitando cimento queimado.",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80",
        styles: { "Industrial Moderno": 3, Minimalista: 1 }
      },
      {
        key: "C",
        text: "Ladrilhos hidráulicos coloridos artesanais ou cerâmicas geométricas foscas.",
        image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=400&q=80",
        styles: { "Boho Chic": 3 }
      },
      {
        key: "D",
        text: "Tábua corrida rústica de demolição com veios marcantes e nós naturais.",
        image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=400&q=80",
        styles: { "Rústico Contemporâneo": 3, "Boho Chic": 1 }
      }
    ]
  },
  {
    id: "iluminacao",
    title: "4. Como você imagina a iluminação ideal do seu quarto?",
    category: "Iluminação",
    options: [
      {
        key: "A",
        text: "Iluminação indireta e difusa embutida por sancas, com pendentes circulares minimalistas.",
        image: "https://images.unsplash.com/photo-1565538810643-b5abd3cb82f2?auto=format&fit=crop&w=400&q=80",
        styles: { Japandi: 3, Minimalista: 2 }
      },
      {
        key: "B",
        text: "Spots em trilhos metálicos direcionáveis pretos e lâmpadas de filamento decorativas em tom âmbar.",
        image: "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=400&q=80",
        styles: { "Industrial Moderno": 3 }
      },
      {
        key: "C",
        text: "Arandelas artesanais de fibras naturais (palha ou vime) que criam padrões de sombra aconchegantes.",
        image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=400&q=80",
        styles: { "Boho Chic": 3, "Rústico Contemporâneo": 1 }
      },
      {
        key: "D",
        text: "Luminárias robustas de bronze antigo ou ferro forjado com cúpulas de linho grosso texturizado.",
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=400&q=80",
        styles: { "Rústico Contemporâneo": 3 }
      }
    ]
  },
  {
    id: "moveis",
    title: "5. Na sua opinião, qual estilo de mobiliário é indispensável?",
    category: "Mobiliário",
    options: [
      {
        key: "A",
        text: "Móveis baixos rente ao chão, linhas retas limpas combinadas com materiais orgânicos leves.",
        image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=400&q=80",
        styles: { Japandi: 3, Minimalista: 2 }
      },
      {
        key: "B",
        text: "Mesa pesada com tampo grosso e pernas trapezoidais de aço industrial cortado a laser.",
        image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=400&q=80",
        styles: { "Industrial Moderno": 3 }
      },
      {
        key: "C",
        text: "Sofá super confortável em linho amassado, poltronas em crochê e peças Mid-Century retrô garimpadas.",
        image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=400&q=80",
        styles: { "Boho Chic": 3, Japandi: 1 }
      },
      {
        key: "D",
        text: "Móveis robustos de madeira maciça de reflorestamento, baús antigos e banquetas de ferro escovado.",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80",
        styles: { "Rústico Contemporâneo": 3, "Industrial Moderno": 1 }
      }
    ]
  },
  {
    id: "personalidade",
    title: "6. Qual frase melhor traduz a sua relação pessoal com a sua casa?",
    category: "Personalidade",
    options: [
      {
        key: "A",
        text: "'Um verdadeiro santuário de paz interior, onde a simplicidade acalma os sentidos.'",
        image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80",
        styles: { Japandi: 3, Minimalista: 1 }
      },
      {
        key: "B",
        text: "'Um loft urbano vibrante, cheio de expressão arquitetônica autêntica e conectada.'",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80",
        styles: { "Industrial Moderno": 3 }
      },
      {
        key: "C",
        text: "'Um refúgio livre, quente e despojado, que reflete as minhas viagens, plantas e espontaneidade.'",
        image: "https://images.unsplash.com/photo-1464979681340-1261d42908a3?auto=format&fit=crop&w=400&q=80",
        styles: { "Boho Chic": 3 }
      },
      {
        key: "D",
        text: "'Um abrigo sólido e nostálgico que abraça a natureza pura e as marcas do tempo.'",
        image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=400&q=80",
        styles: { "Rústico Contemporâneo": 3 }
      }
    ]
  }
];

export default function Forms({ 
  onStyleCalculated, 
  savedStyle,
  currentUser,
  onLogin
}: FormsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<FormAnswers>>({});
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(currentUser?.name || "");
  const [userEmail, setUserEmail] = useState(currentUser?.email || "");
  const [userPhone, setUserPhone] = useState("");
  const [authLoading, setAuthLoading] = useState<"Google" | "Apple" | "Facebook" | null>(null);

  const handleSocialLogin = (provider: "Google" | "Apple" | "Facebook") => {
    setAuthLoading(provider);
    setTimeout(() => {
      setAuthLoading(null);
      const mockProfiles = {
        Google: {
          name: "Milena Maia",
          email: "contato.milenamaia@gmail.com",
          provider: "Google" as const,
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        Apple: {
          name: "Milena Maia",
          email: "contato.milenamaia@gmail.com",
          provider: "Apple" as const,
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        },
        Facebook: {
          name: "Milena Maia",
          email: "contato.milenamaia@gmail.com",
          provider: "Facebook" as const,
          avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        }
      };
      const selectedProfile = mockProfiles[provider];
      setUserName(selectedProfile.name);
      setUserEmail(selectedProfile.email);
      if (onLogin) {
        onLogin(selectedProfile);
      }
    }, 1000);
  };
  
  // Sincroniza campos se o usuário autenticar remotamente
  React.useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.name);
      setUserEmail(currentUser.email);
    }
  }, [currentUser]);
  const [completed, setCompleted] = useState(false);
  const [styleResult, setStyleResult] = useState<any>(null);

  const handleSelectOption = (questionId: string, optionKey: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey
    }));
  };

  const handleNext = () => {
    if (!answers[QUESTIONS[currentStep].id]) {
      alert("Por favor, selecione uma opção antes de prosseguir.");
      return;
    }
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Prompt for user identification at the end of quiz
      setCurrentStep(QUESTIONS.length);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const calculateStyleScore = () => {
    const scores: Record<string, number> = {
      Japandi: 0,
      "Industrial Moderno": 0,
      "Boho Chic": 0,
      "Rústico Contemporâneo": 0
    };

    QUESTIONS.forEach((q) => {
      const selectedKey = answers[q.id];
      const selectedOption = q.options.find((o) => o.key === selectedKey);
      if (selectedOption) {
        Object.entries(selectedOption.styles).forEach(([style, weight]) => {
          scores[style] = (scores[style] || 0) + weight;
        });
      }
    });

    // Find the style with the highest score
    let winningStyle = "Japandi";
    let highestScore = -1;
    Object.entries(scores).forEach(([style, val]) => {
      if (val > highestScore) {
        highestScore = val;
        winningStyle = style;
      }
    });

    return winningStyle;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || !userPhone) {
      alert("Por favor, preencha todos os campos obrigatórios (*), incluindo seu telefone/WhatsApp.");
      return;
    }

    setLoading(true);
    const winningStyle = calculateStyleScore();

    // Prepare quiz bundle
    const quizPayload = {
      userName,
      userEmail,
      phone: userPhone,
      answers,
      winningStyle
    };

    try {
      // Post style answers to the local server orchestrator API
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizPayload)
      });

      if (!response.ok) {
        throw new Error("Falha ao registrar formulário de estilo");
      }

      const backendResult = await response.json();
      setStyleResult(backendResult);
      setCompleted(true);
      onStyleCalculated(backendResult.style, backendResult.details, { name: userName, email: userEmail });
    } catch (err) {
      console.error(err);
      // Fallback local calculations in case server fails
      const fallbackResult = {
        style: winningStyle,
        userName,
        details: getStyleInfoLocal(winningStyle)
      };
      setStyleResult(fallbackResult);
      setCompleted(true);
      onStyleCalculated(winningStyle, fallbackResult.details, { name: userName, email: userEmail });
    } finally {
      setLoading(false);
    }
  };

  const handleResetQuiz = () => {
    setAnswers({});
    setCurrentStep(0);
    setCompleted(false);
    setStyleResult(null);
  };

  // Helper local style descriptions in case of offline fallback
  const getStyleInfoLocal = (style: string): HomeStyleInfo => {
    const defaultStyles: Record<string, HomeStyleInfo> = {
      Japandi: {
        id: "japandi",
        name: "Japandi",
        tagline: "O encontro perfeito entre o minimalismo escandinavo e a paz zen japonesa.",
        description: "Seu estilo valoriza a paz, a pureza e a conexão espiritual com o lar. Espaços limpos, luz natural abundante, plantas e móveis rústicos baixos definem o ambiente ideal. O aconchego é trazido por texturas naturais, cerâmica artesanal e madeiras claras refinadas.",
        colors: [
          { name: "Off-white", hex: "#F3F1ED" },
          { name: "Areia Fendi", hex: "#DFD8CE" },
          { name: "Carvalho Claro", hex: "#D6C7B7" },
          { name: "Cinza Linho", hex: "#A8A29A" },
          { name: "Carvão Suave", hex: "#2E3331" }
        ],
        elements: ["Luz natural abundante", "Cerâmica wabi-sabi irregular", "Madeiras claras e bambu", "Móveis baixos e funcionais"],
        productFocus: ["Porcelanatos acetinados areia", "Painéis de freijó ripado", "Lustres de papel de arroz washis", "Móveis com estrutura rente ao chão"]
      },
      "Industrial Moderno": {
        id: "industrial",
        name: "Industrial Moderno",
        tagline: "Estética urbana crua de Nova York integrada a detalhes arquitetônicos polidos.",
        description: "Adora a força do tijolo aparente, do cimento queimado e de estruturas metálicas expostas. O contraste entre o preto do ferro, cinza-grafite e a madeira de demolição dá o tom rústico sofisticado que exala autenticidade dos antigos lofts.",
        colors: [
          { name: "Cimento Escovado", hex: "#9E9E9E" },
          { name: "Ferro Fundido", hex: "#1A1D1C" },
          { name: "Tijolo Rústico", hex: "#A05A4A" },
          { name: "Cobre Escovado", hex: "#CD7F32" }
        ],
        elements: ["Paredes de concreto texturizado", "Tubulação e vigas expostas", "Estruturas em ferro preto fosco", "Contraste de couro envelhecido marrom"],
        productFocus: ["Revestimento de tijolinhos de argila", "Lâmpadas de filamento de carbono", "Spots direcionáveis em trilhos pretos", "Prateleiras suspensas de vergalhão"]
      },
      "Boho Chic": {
        id: "boho",
        name: "Boho Chic",
        tagline: "Uma celebração calorosa de texturas étnicas, tecidos naturais e muitas plantas.",
        description: "Livre, convidativo e com muita alma. Seu lar ideal é repleto de peças de artesanato local, palha trançada, tapetes de algodão cru, texturas macrame e tons terrosos quentes como terracota e mostarda, que convidam ao repouso e à criatividade.",
        colors: [
          { name: "Terracota Queimado", hex: "#B2856F" },
          { name: "Mostarda Terrosa", hex: "#E3A857" },
          { name: "Algodão Cru", hex: "#ECE7E1" },
          { name: "Verde Oliva Sage", hex: "#596A5F" }
        ],
        elements: ["Mobiliário de Rattan e Vime entalhado", "Plantas ornamentais de folhas largas", "Macramê trançado e tapetes orientais", "Paredes em pintura de argila ensolarada"],
        productFocus: ["Pisos cerâmicos terracota", "Vasos de barro moldados à mão", "Pendentes de palha natural trançada", "Poltronas aconchegantes com almofadas tecidas"]
      },
      "Rústico Contemporâneo": {
        id: "rustico",
        name: "Rústico Contemporâneo",
        tagline: "O aconchego acolhedor do campo equilibrado com o conforto moderno.",
        description: "Seu coração pertence a espaços robustos que contam histórias. Grandes vigas de madeira no teto, pedras fendi naturais nas paredes, couro caramelo macio e peças Vintage restauradas são harmonizadas perfeitamente com eletrodomésticos elegantes de alta tecnologia.",
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
    return defaultStyles[style] || defaultStyles["Japandi"];
  };

  const activeQuestion = QUESTIONS[currentStep];

  return (
    <div id="uPlar-forms-root" className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white shadow-sm">
      {/* Title & Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#2C2C2C]/10">
        <div className="flex items-center gap-2">
          <Compass className="text-[#C68B77] w-5 h-5 animate-pulse" />
          <h2 className="text-xl font-serif text-[#2C2C2C] tracking-tight">
            Estilo ideal
          </h2>
        </div>
        {!completed && currentStep < QUESTIONS.length && (
          <span className="text-[10px] font-mono text-[#5B6347] bg-[#D1CCC2]/30 px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
            Passo {currentStep + 1} de {QUESTIONS.length}
          </span>
        )}
      </div>

      {!completed ? (
        currentStep < QUESTIONS.length ? (
          <div>
            {/* Progress Bar */}
            <div className="w-full bg-[#D1CCC2]/30 h-1 rounded-full mb-8 overflow-hidden">
              <div
                className="bg-[#5B6347] h-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              ></div>
            </div>

            {/* Question Box */}
            <div className="mb-8">
              <span className="text-[#C68B77] text-[10px] font-bold uppercase tracking-[0.2em]">01. Teste de Estilo</span>
              <h3 className="text-xl font-serif text-[#2C2C2C] mt-1 mb-6 leading-relaxed">
                {activeQuestion.title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeQuestion.options.map((option: any) => {
                  const isSelected = answers[activeQuestion.id] === option.key;
                  return (
                    <button
                      id={`option-${activeQuestion.id}-${option.key}`}
                      key={option.key}
                      type="button"
                      onClick={() => handleSelectOption(activeQuestion.id, option.key)}
                      className={`text-left rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full group ${
                        isSelected
                          ? "bg-[#5B6347] border-[#5B6347] text-white shadow-md ring-2 ring-offset-2 ring-[#5B6347]/40 scale-[1.01]"
                          : "bg-white/70 border-[#2C2C2C]/10 text-[#2C2C2C]/80 hover:bg-white hover:border-[#C68B77] hover:shadow-sm"
                      }`}
                    >
                      {option.image && (
                        <div className="relative aspect-video w-full overflow-hidden bg-[#D1CCC2]/20 border-b border-[#2C2C2C]/5">
                          <img 
                            src={option.image} 
                            alt={option.text}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      )}
                      
                      <div className="p-4 flex items-start gap-3 flex-1">
                        <span
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold border transition-colors ${
                            isSelected
                              ? "bg-white text-[#5B6347] border-white"
                              : "bg-[#E5E1D8] text-[#2C2C2C] border-[#2C2C2C]/10 group-hover:bg-[#C68B77]/10 group-hover:text-[#C68B77]"
                          }`}
                        >
                          {option.key}
                        </span>
                        <span className="text-xs font-medium font-sans leading-relaxed">{option.text}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Controls */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t border-[#2C2C2C]/10">
              <button
                id="btn-prev-step"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-[#2C2C2C]/20 text-[#2C2C2C]/60 text-xs font-semibold uppercase tracking-widest rounded-xl hover:bg-white/55 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Voltar
              </button>
              <button
                id="btn-next-step"
                onClick={handleNext}
                className="flex items-center gap-1.5 bg-[#2C2C2C] hover:bg-[#C68B77] text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-xl transition-all cursor-pointer"
              >
                Prosseguir <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Identification Form before compiling final calculated style profile */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-5 bg-[#D1CCC2]/30 rounded-2xl border border-[#2C2C2C]/5 space-y-3 mb-4">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-wider text-[#5B6347]">
                <Sparkles className="w-4 h-4 text-[#C68B77] animate-spin-slow" />
                <span>RESPOSTAS CAPTURADAS</span>
              </div>
              <p className="text-xs text-[#2C2C2C]/80 leading-relaxed font-sans">
                Nós cruzamos os dados do seu formulário com as regras estéticas das marcas parceiras do UPLar. Identifique-se para gerar a sua curadoria personalizada instantaneamente.
              </p>
            </div>

            {/* Social Log In Panel */}
            <div className="p-5 bg-white/40 border border-[#2C2C2C]/5 rounded-2xl space-y-4">
              <span className="block text-[10px] font-mono text-[#5B6347] uppercase tracking-widest font-bold">
                Acesso com Provedor (Google, Apple, Facebook)
              </span>
              
              {currentUser ? (
                <div className="bg-emerald-55/60 border border-emerald-500/10 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={currentUser.avatarUrl} 
                      className="w-9 h-9 rounded-full object-cover border border-[#2C2C2C]/10" 
                      alt={currentUser.name} 
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-left">
                      <p className="text-xs font-bold text-[#2C2C2C] flex items-center gap-1.5 uppercase font-mono tracking-wider">
                        Conectado com {currentUser.provider} 
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      </p>
                      <p className="text-[11px] text-[#2C2C2C]/70">Perfil {currentUser.name} ativo</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-black bg-[#5B6347] text-white px-2.5 py-1 rounded">ATIVO</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    disabled={authLoading !== null}
                    onClick={() => handleSocialLogin("Google")}
                    className="flex items-center justify-center gap-2 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 rounded-xl px-3 py-2.5 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {authLoading === "Google" ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-neutral-600" />
                    ) : (
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    )}
                    <span>{authLoading === "Google" ? "Acessando..." : "Google"}</span>
                  </button>

                  <button
                    type="button"
                    disabled={authLoading !== null}
                    onClick={() => handleSocialLogin("Apple")}
                    className="flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-950 text-white rounded-xl px-3 py-2.5 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {authLoading === "Apple" ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/>
                      </svg>
                    )}
                    <span>{authLoading === "Apple" ? "Acessando..." : "Apple"}</span>
                  </button>

                  <button
                    type="button"
                    disabled={authLoading !== null}
                    onClick={() => handleSocialLogin("Facebook")}
                    className="flex items-center justify-center gap-2 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-xl px-3 py-2.5 text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                  >
                    {authLoading === "Facebook" ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                      </svg>
                    )}
                    <span>{authLoading === "Facebook" ? "Acessando..." : "Facebook"}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono text-[#5B6347] uppercase tracking-widest font-bold mb-2">
                  Seu Nome Inteiro *
                </label>
                <input
                  id="user-fullname-input"
                  type="text"
                  required
                  placeholder="Ex: Milena Maia"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-white border border-[#2C2C2C]/10 rounded-2xl px-4 py-3 text-xs text-[#2C2C2C] focus:ring-1 focus:ring-[#5B6347] focus:border-[#5B6347] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#5B6347] uppercase tracking-widest font-bold mb-2">
                  Seu E-mail *
                </label>
                <input
                  id="user-email-input"
                  type="email"
                  required
                  placeholder="contato.milenamaia@gmail.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-white border border-[#2C2C2C]/10 rounded-2xl px-4 py-3 text-xs text-[#2C2C2C] focus:ring-1 focus:ring-[#5B6347] focus:border-[#5B6347] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#5B6347] uppercase tracking-widest font-bold mb-2 flex items-center justify-between">
                  <span>Seu Telefone / WhatsApp *</span>
                  <span className="text-[9px] font-normal text-emerald-700 capitalize">Receba novidades automáticas</span>
                </label>
                <input
                  id="user-phone-input"
                  type="tel"
                  required
                  placeholder="Ex: (11) 99999-9999"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full bg-white border border-[#2C2C2C]/10 rounded-2xl px-4 py-3 text-xs text-[#2C2C2C] focus:ring-1 focus:ring-[#5B6347] focus:border-[#5B6347] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-[#2C2C2C]/10">
              <button
                id="btn-back-to-quiz"
                type="button"
                onClick={() => setCurrentStep(QUESTIONS.length - 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-[#2C2C2C]/20 text-[#2C2C2C]/60 text-xs font-semibold uppercase tracking-widest rounded-xl hover:bg-white/55"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Voltar ao Teste
              </button>
              <button
                id="btn-submit-quiz"
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-[#C68B77] hover:bg-[#B77D69] text-white px-6 py-3.5 text-xs font-semibold uppercase tracking-widest rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processando...
                  </>
                ) : (
                  <>
                    Gerar Meu Perfil <Sparkles className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )
      ) : (
        /* Results View */
        <div id="quiz-result-card" className="space-y-6">
          <div className="text-center py-6">
            <span className="text-[10px] font-mono bg-[#5B6347] text-white px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block font-semibold">
              Estilo Diagnosticado com Sucesso
            </span>
            <h3 className="text-3xl font-serif text-[#2C2C2C] font-semibold mt-1">
              {styleResult?.style || "Seu Estilo Único"}
            </h3>
            <p className="text-xs font-serif italic text-[#5B6347] mt-2">
              "{styleResult?.details?.tagline || "Harmonia perfeita para o seu lar."}"
            </p>
          </div>

          <p className="text-xs text-[#2C2C2C]/80 leading-relaxed bg-[#D1CCC2]/20 p-5 rounded-2xl border border-[#2C2C2C]/10">
            {styleResult?.details?.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Palette */}
            <div className="space-y-3.5">
              <h4 className="text-[10px] font-mono uppercase text-[#2C2C2C] tracking-widest font-bold">
                🎨 Paleta Homologada UPLar
              </h4>
              <div className="space-y-2">
                {styleResult?.details?.colors?.map((color: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className="w-10 h-7 rounded-lg border border-[#2C2C2C]/10 shadow-xs flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <div className="text-xs">
                      <p className="font-sans font-medium text-[#2C2C2C]">{color.name}</p>
                      <p className="font-mono text-[9px] text-[#5B6347] uppercase font-bold">{color.hex}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core focus fields */}
            <div className="space-y-4">
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-mono uppercase text-[#2C2C2C] tracking-widest font-bold">
                  🌿 Elementos Relevantes
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {styleResult?.details?.elements?.map((item: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-white text-[#2C2C2C]/80 px-2.5 py-1.5 rounded-xl border border-[#2C2C2C]/10 flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-[#5B6347]" /> {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-[10px] font-mono uppercase text-[#2C2C2C] tracking-widest font-bold">
                  📌 Foco em Materiais
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {styleResult?.details?.productFocus?.map((item: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-[#D1CCC2]/30 text-[#2C2C2C] px-2.5 py-1.5 rounded-xl border border-[#2C2C2C]/5 font-semibold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#2C2C2C]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-[11px] text-[#5B6347]">
              💡 Você pode perguntar dicas personalizadas dadas pelo Agente de IA ao lado!
            </span>
            <button
              id="btn-restart-quiz"
              onClick={handleResetQuiz}
              className="flex items-center gap-1.5 bg-[#5B6347] hover:bg-[#464D36] text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-widest rounded-xl transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refazer Teste
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
