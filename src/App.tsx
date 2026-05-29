/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import Forms, { UserAuth } from "./components/Forms";
import AiAgentChat from "./components/AiAgentChat";
import ProductShowcase from "./components/ProductShowcase";
import ConsultingBooking from "./components/ConsultingBooking";
import DeveloperHub from "./components/DeveloperHub";
import { Compass, Sparkles, Tag, LayoutDashboard, Sliders, Calendar, Cpu } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"quiz" | "scraper" | "booking" | "admin">("quiz");
  const [detectedStyle, setDetectedStyle] = useState<string | undefined>(undefined);
  const [styleDetails, setStyleDetails] = useState<any | undefined>(undefined);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string } | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<UserAuth | null>(null);
  const [headerAuthLoading, setHeaderAuthLoading] = useState<"Google" | "Apple" | "Facebook" | null>(null);

  const handleHeaderLogin = (provider: "Google" | "Apple" | "Facebook") => {
    setHeaderAuthLoading(provider);
    setTimeout(() => {
      setHeaderAuthLoading(null);
      const profile = {
        name: "Milena Maia",
        email: "contato.milenamaia@gmail.com",
        provider,
        avatarUrl: provider === "Google" 
          ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          : provider === "Apple"
            ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            : "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
      };
      setCurrentUser(profile);
    }, 1000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleStyleCalculated = (style: string, details: any, userObj?: { name: string; email: string }) => {
    setDetectedStyle(style);
    setStyleDetails(details);
    if (details) {
      const finalName = userObj?.name || details.userName || "Usuário UPLar";
      const finalEmail = userObj?.email || "contato.milenamaia@gmail.com";
      
      setUserInfo({
        name: finalName,
        email: finalEmail
      });
      // se o usuário enviou o teste de estilo com nome sem estar logado de antemão, cria um perfil correspondente
      if (!currentUser) {
        setCurrentUser({
          name: finalName,
          email: finalEmail,
          provider: "Google",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        });
      }
    }
  };

  const handleNavigateToTab = (tab: string) => {
    if (tab === "booking") setActiveTab("booking");
    if (tab === "scraper") setActiveTab("scraper");
  };

  return (
    <div id="uPlar-app-root" className="min-h-screen bg-[#E5E1D8] text-[#2C2C2C] font-sans antialiased pb-12">
      
      {/* Visual Header Grid & Branding (Vector Recreation of the attached logo) */}
      <header className="bg-[#E5E1D8] border-b border-[#2C2C2C]/10 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 flex flex-col sm:flex-row items-end justify-between gap-4">
          
          {/* UPLar Logo Vector */}
          <div className="flex items-center gap-4">
            <div className="bg-[#D1CCC2] w-14 h-14 rounded-xl flex items-center justify-center border border-[#2C2C2C]/10 shadow-sm">
              {/* Nested CSS Peaks with editorial colors */}
              <div className="relative w-10 h-10 flex items-end justify-center pb-0.5">
                {/* Outer House (Olive Green - #5B6347) */}
                <div 
                  className="absolute bottom-1 w-8 h-7 border border-[#5B6347] rounded-t bg-transparent"
                  style={{
                    clipPath: "polygon(50% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)",
                    backgroundColor: "#5B6347"
                  }}
                >
                  {/* Middle Nested House (Terracotta - #C68B77) */}
                  <div 
                    className="absolute bottom-0 left-[15%] w-[70%] h-[75%] border border-[#C68B77]"
                    style={{
                      clipPath: "polygon(50% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)",
                      backgroundColor: "#C68B77"
                    }}
                  >
                    {/* Inner core (Sand - #E5E1D8) */}
                    <div 
                      className="absolute bottom-0 left-[20%] w-[60%] h-[70%]"
                      style={{
                        clipPath: "polygon(50% 0%, 100% 40%, 100% 100%, 0% 100%, 0% 40%)",
                        backgroundColor: "#E5E1D8"
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-left">
              <h1 className="text-4xl font-serif tracking-tight text-[#2C2C2C] m-0 leading-none">
                UPLar
              </h1>
              <p className="text-xs uppercase tracking-wider font-bold mt-2 opacity-80 text-[#5B6347]">
                Descubra o seu estilo de decoração e compare os preços do produtos selecionados para você
              </p>
            </div>
          </div>

          {/* Auth Capsule & Current Style State Status Badge */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* User Profile / Social Sign In Widget */}
            {currentUser ? (
              <div className="bg-white/70 border border-[#2C2C2C]/10 rounded-xl px-4 py-2 flex items-center gap-3 shadow-sm">
                <img 
                  src={currentUser.avatarUrl} 
                  className="w-8 h-8 rounded-full object-cover border border-[#2C2C2C]/5" 
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <span className="text-[9px] font-mono uppercase text-[#C68B77] block font-semibold leading-none">
                    Entrou via {currentUser.provider}
                  </span>
                  <span className="text-xs font-serif font-bold text-[#2C2C2C] block max-w-[120px] truncate leading-tight mt-0.5">
                    {currentUser.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-[9px] font-mono font-bold uppercase tracking-wider text-red-700 bg-red-100 hover:bg-red-200 px-2.5 py-1 rounded ml-2 cursor-pointer transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <div className="bg-white/50 border border-[#2C2C2C]/10 rounded-xl p-1.5 flex items-center gap-1.5 shadow-sm">
                <span className="text-[9px] font-mono uppercase text-[#5B6347] font-bold px-2 hidden md:inline">ENTRAR:</span>
                
                <button
                  type="button"
                  disabled={headerAuthLoading !== null}
                  onClick={() => handleHeaderLogin("Google")}
                  className="p-1.5 px-2.5 rounded-lg bg-white border border-[#2C2C2C]/5 text-xs font-semibold hover:border-[#C68B77] cursor-pointer transition-colors flex items-center gap-1 disabled:opacity-50"
                  title="Entrar com Google"
                >
                  {headerAuthLoading === "Google" ? (
                    <span className="w-3 h-3 border-2 border-neutral-600 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                  )}
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Google</span>
                </button>

                <button
                  type="button"
                  disabled={headerAuthLoading !== null}
                  onClick={() => handleHeaderLogin("Apple")}
                  className="p-1.5 px-2.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-950 cursor-pointer transition-colors flex items-center gap-1 disabled:opacity-50"
                  title="Entrar com Apple"
                >
                  {headerAuthLoading === "Apple" ? (
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/>
                    </svg>
                  )}
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Apple</span>
                </button>

                <button
                  type="button"
                  disabled={headerAuthLoading !== null}
                  onClick={() => handleHeaderLogin("Facebook")}
                  className="p-1.5 px-2.5 rounded-lg bg-[#1877F2] text-white text-xs font-semibold hover:bg-[#166FE5] cursor-pointer transition-colors flex items-center gap-1 disabled:opacity-50"
                  title="Entrar com Facebook"
                >
                  {headerAuthLoading === "Facebook" ? (
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                    </svg>
                  )}
                  <span className="text-[10px] uppercase font-mono tracking-wider font-bold">Facebook</span>
                </button>
              </div>
            )}

            {detectedStyle && (
              <div className="bg-white/60 border border-[#2C2C2C]/10 rounded-xl px-4 py-2 flex items-center gap-3 text-left shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#C68B77]" />
                <div>
                  <span className="text-[9px] font-mono uppercase text-[#5B6347] block font-bold leading-none tracking-wider">Perfil Calculado</span>
                  <span className="text-xs font-serif font-bold text-[#2C2C2C]">{detectedStyle}</span>
                </div>
                {styleDetails?.colors?.[3] && (
                  <div className="flex items-center gap-1">
                    {styleDetails.colors.slice(0, 4).map((c: any, index: number) => (
                      <div 
                        key={index} 
                        className="w-2.5 h-2.5 rounded-full border border-black/10 flex-shrink-0" 
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      ></div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Main Core Viewport layout */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:px-8">
        
        {/* Welcome Premium Hero Banner */}
        <div className="mb-8 text-left bg-white/40 border border-white p-6 md:p-10 rounded-[32px] shadow-xs relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#C68B77] bg-[#C68B77]/10 px-3 py-1.5 rounded-full inline-block mb-3.5">
              ✨ Curadoria de Ambientes & Boutique de Interiores
            </span>
            <h2 className="text-3xl md:text-4xl font-serif text-[#2C2C2C] tracking-tight leading-tight font-medium">
              Sua atmosfera ideal personalizada em detalhes
            </h2>
            <p className="text-xs md:text-sm font-sans text-[#2C2C2C]/70 mt-3 leading-relaxed max-w-2xl">
              Descubra seu perfil estético através do nosso teste de estilo exclusivo, explore o catálogo de valores e decorações homologadas e reserve uma agenda de consultoria ao vivo com nosso time de especialistas parceiros.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-[#C68B77]/10 to-transparent pointer-events-none hidden md:block"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Active section navigation central panel (Column spans 2) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Elegant Tab Options Selector */}
            <div className="bg-white/60 rounded-3xl p-1.5 border border-[#2C2C2C]/10 flex flex-wrap items-center gap-1 justify-start shadow-sm">
              <button
                id="tab-btn-quiz"
                onClick={() => setActiveTab("quiz")}
                className={`flex items-center gap-2 px-5 py-3 text-[11px] font-semibold uppercase tracking-widest rounded-2xl transition-all cursor-pointer ${
                  activeTab === "quiz"
                    ? "bg-[#5B6347] text-white shadow-sm"
                    : "text-[#2C2C2C]/80 hover:bg-white/60 hover:text-[#2C2C2C]"
                }`}
              >
                <Compass className="w-3.5 h-3.5" /> 01. Teste de Estilo
              </button>

              <button
                id="tab-btn-scraper"
                onClick={() => setActiveTab("scraper")}
                className={`flex items-center gap-2 px-5 py-3 text-[11px] font-semibold uppercase tracking-widest rounded-2xl transition-all cursor-pointer ${
                  activeTab === "scraper"
                    ? "bg-[#5B6347] text-white shadow-sm"
                    : "text-[#2C2C2C]/80 hover:bg-white/60 hover:text-[#2C2C2C]"
                }`}
              >
                <Tag className="w-3.5 h-3.5" /> 02. Compare os preços
              </button>

              <button
                id="tab-btn-booking"
                onClick={() => setActiveTab("booking")}
                className={`flex items-center gap-2 px-5 py-3 text-[11px] font-semibold uppercase tracking-widest rounded-2xl transition-all cursor-pointer ${
                  activeTab === "booking"
                    ? "bg-[#5B6347] text-white shadow-sm"
                    : "text-[#2C2C2C]/80 hover:bg-white/60 hover:text-[#2C2C2C]"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" /> 03. Consultorias
              </button>

              <button
                id="tab-btn-admin"
                onClick={() => setActiveTab("admin")}
                className={`flex items-center gap-2 px-5 py-3 text-[11px] font-semibold uppercase tracking-widest rounded-2xl transition-all cursor-pointer ${
                  activeTab === "admin"
                    ? "bg-[#C68B77] text-white shadow-sm"
                    : "text-[#2C2C2C]/80 hover:bg-[#C68B77]/10 hover:text-[#C68B77]"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> 04. Área Admin (CRM)
              </button>
            </div>

            {/* Render selected Content Pane */}
            <div className="transition-all duration-200">
              {activeTab === "quiz" && (
                <Forms 
                  onStyleCalculated={handleStyleCalculated} 
                  savedStyle={detectedStyle}
                  currentUser={currentUser}
                  onLogin={setCurrentUser}
                />
              )}
              {activeTab === "scraper" && (
                <ProductShowcase 
                  currentStyleProfile={detectedStyle}
                />
              )}
              {activeTab === "booking" && (
                <ConsultingBooking 
                  currentStyleProfile={detectedStyle} 
                  userName={userInfo?.name}
                  userEmail={userInfo?.email}
                />
              )}
              {activeTab === "admin" && (
                <DeveloperHub />
              )}
            </div>

          </div>

          {/* Persistent AI Copilot Side Companion Column (Column spans 1) */}
          <div className="space-y-6">
            <div className="bg-white/50 p-6 rounded-3xl border border-white text-left space-y-2 shadow-sm">
              <h3 className="text-xs uppercase text-[#C68B77] font-bold tracking-widest">
                💡 Assistência Estética Contínua
              </h3>
              <p className="text-xs text-[#2C2C2C]/80 leading-relaxed font-sans">
                Converse com o Agente de IA abaixo para harmonizar os móveis raspados, obter sugestões para as obras ou tirar dúvidas sobre o seu estilo!
              </p>
            </div>

            <AiAgentChat 
              currentStyleProfile={detectedStyle}
              onNavigateToTab={handleNavigateToTab}
            />

          </div>

        </div>
      </main>

      {/* Global Minimal Footer */}
      <footer className="mt-20 border-t border-[#2C2C2C]/10 bg-[#2C2C2C] py-8 text-white/50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-left space-y-1">
            <p className="font-serif text-[#E5E1D8] text-sm tracking-wide">UPLar Digital Ecosystem</p>
            <p className="text-[10px] tracking-wider text-white/30 font-mono">SUPABASE • LEROY MERLIN • WESTWING • TOK&STOK</p>
          </div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-[#C68B77]">
            Orchestrator: Studio IA Active
          </p>
        </div>
      </footer>

    </div>
  );
}
