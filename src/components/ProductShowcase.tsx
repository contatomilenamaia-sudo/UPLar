/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ScrapedProduct } from "../types";
import { runUPLarProductScraper } from "../services/scraper";
import { RefreshCw, ExternalLink, Star, Sliders, Building, Compass, ArrowRight, Tag } from "lucide-react";

interface ProductShowcaseProps {
  currentStyleProfile?: string;
}

export default function ProductShowcase({ currentStyleProfile }: ProductShowcaseProps) {
  const [products, setProducts] = useState<ScrapedProduct[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("Todos");
  const [styleFilter, setStyleFilter] = useState<string>("Todos");
  const [loading, setLoading] = useState(false);
  const [systemLog, setSystemLog] = useState<string[]>([]);

  const fetchProducts = async (style: string = "todos") => {
    setLoading(true);
    setSystemLog((prev) => [
      `Iniciando coletor de preços e ofertas UPLar...`,
      ...prev
    ]);

    try {
      // Simulate launching crawler processes
      const scraped = await runUPLarProductScraper(style === "Todos" ? "todos" : style);
      setProducts(scraped);

      // Add status console logs
      setSystemLog((prev) => [
        `Atualização bem sucedida! Comparados ${scraped.length} produtos de Leroy Merlin, Westwing e Tok&Stok.`,
        `Filtro consolidado de estilo: "${style}"`,
        `Dados sincronizados localmente.`,
        ...prev
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch matching user style if established, else all
    fetchProducts(currentStyleProfile || "Todos");
  }, [currentStyleProfile]);

  const handleTriggerScraper = () => {
    fetchProducts(styleFilter);
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = categoryFilter === "Todos" || p.category === categoryFilter;
    const matchesStyle =
      styleFilter === "Todos" ||
      p.styleCompatibility.some((style) => style.toLowerCase() === styleFilter.toLowerCase());
    return matchesCategory && matchesStyle;
  });

  return (
    <div id="uPlar-decor-products" className="space-y-6">
      {/* Control Bar & Scraping Manual Launch Trigger */}
      <div className="bg-white/40 border border-white p-6 rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="text-sm uppercase tracking-widest font-bold text-[#2C2C2C]">
            Mapeamento de Marcas • Comparação Ativa
          </h3>
          <p className="text-xs text-[#525B56] mt-1 pr-4 font-sans leading-relaxed">
            Compare ofertas coletadas automaticamente de Leroy Merlin, Westwing e Tok&Stok. Clique para atualizar os valores.
          </p>
        </div>

        <button
          id="btn-run-manual-scraper"
          onClick={handleTriggerScraper}
          disabled={loading}
          className="flex-shrink-0 flex items-center gap-2 bg-[#5B6347] hover:bg-[#464D36] text-white px-5 py-3 text-xs font-semibold uppercase tracking-widest rounded-xl transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Coletando ofertas...
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" /> Atualizar Valores
            </>
          )}
        </button>
      </div>

      {/* Grid of filters and results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Filters Rail */}
        <div className="space-y-4">
          <div className="bg-white/50 p-5 rounded-3xl border border-white space-y-4 shadow-sm">
            <div className="flex items-center gap-1.5 pb-2 border-b border-[#2C2C2C]/10">
              <Sliders className="w-3.5 h-3.5 text-[#C68B77]" />
              <h4 className="text-[10px] font-mono uppercase text-[#2C2C2C] font-bold tracking-widest">
                Parâmetros de Curadoria
              </h4>
            </div>

            {/* Category selection */}
            <div className="space-y-2">
              <label className="text-[9px] font-mono text-[#5B6347] font-bold uppercase tracking-wider">
                Categoria do Item
              </label>
              <div className="flex flex-col gap-1">
                {["Todos", "Revestimento", "Mobiliário", "Iluminação", "Decoração"].map((cat) => (
                  <button
                    id={`filter-cat-${cat}`}
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`text-left text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                      categoryFilter === cat
                        ? "bg-[#5B6347] text-white font-medium"
                        : "text-[#2C2C2C]/80 hover:bg-[#D1CCC2]/40"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Style selection */}
            <div className="space-y-2 pt-2">
              <label className="text-[9px] font-mono text-[#5B6347] font-bold uppercase tracking-wider">
                Harmonização Estética
              </label>
              <div className="flex flex-col gap-1">
                {["Todos", "Japandi", "Industrial Moderno", "Boho Chic", "Rústico Contemporâneo"].map((sty) => (
                  <button
                    id={`filter-sty-${sty}`}
                    key={sty}
                    onClick={() => setStyleFilter(sty)}
                    className={`text-left text-xs px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                      styleFilter === sty
                        ? "bg-[#C68B77] text-white font-medium"
                        : "text-[#2C2C2C]/80 hover:bg-[#D1CCC2]/40"
                    }`}
                  >
                    {sty}
                  </button>
                ))}
              </div>
            </div>
          </div>


        </div>

        {/* Right Products Feed Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="bg-white/40 border border-white rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-sm">
              <RefreshCw className="w-8 h-8 animate-spin text-[#C68B77]" />
              <p className="text-sm font-serif text-[#2C2C2C] font-medium">Coletando precificações de ofertas brasileiras...</p>
              <p className="text-xs text-[#5B6347]">Analisando tags, estoques e ofertas disponíveis em tempo real.</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white/40 border border-white rounded-3xl p-12 text-center shadow-sm">
              <Compass className="w-8 h-8 text-[#C68B77]/60 mx-auto mb-3" />
              <p className="text-xs font-semibold text-[#2C2C2C]/80 uppercase tracking-widest">Nenhuma combinação mapeada</p>
              <p className="text-xs text-[#5B6347] mt-1">Experimente mudar o filtro de curadoria ou atualize os valores.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((p) => {
                const savings = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                return (
                  <div
                    id={`product-card-${p.id}`}
                    key={p.id}
                    className="bg-white rounded-3xl border border-[#2C2C2C]/10 hover:border-[#C68B77] transition-all overflow-hidden flex flex-col group shadow-sm hover:shadow-md"
                  >
                    {/* Badge and image */}
                    <div className="relative aspect-video bg-[#E5E1D8]/10 overflow-hidden flex-shrink-0">
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-[#2C2C2C] text-[#E5E1D8] text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm">
                        {p.store}
                      </span>
                      {savings > 0 && (
                        <span className="absolute top-2.5 right-2.5 bg-[#C68B77] text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-sm">
                          -{savings}% OFF
                        </span>
                      )}
                    </div>

                    {/* Content area */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-[#5B6347] block uppercase font-bold tracking-wider">
                          {p.category}
                        </span>
                        <h4 className="text-xs font-medium text-[#2C2C2C] leading-snug line-clamp-2">
                          {p.title}
                        </h4>
                      </div>

                      {/* Store specifications */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-[#C68B77]">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="text-xs font-sans font-semibold">{p.rating.toFixed(1)}</span>
                          </div>
                          
                          <div className="text-right">
                            {p.originalPrice && (
                              <span className="text-[10px] text-[#2C2C2C]/40 line-through block font-sans">
                                R$ {p.originalPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </span>
                            )}
                            <span className="text-sm font-serif font-bold text-[#2C2C2C] block">
                              R$ {p.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        {/* Compatibility features */}
                        <div className="flex flex-wrap gap-1">
                          {p.styleCompatibility.map((style, idx) => (
                            <span
                              key={idx}
                              className="text-[9px] bg-[#E5E1D8] text-[#5B6347] px-2 py-0.5 rounded font-medium"
                            >
                              {style}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Buy Anchor */}
                      <a
                        id={`btn-visit-store-${p.id}`}
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#D1CCC2]/40 hover:bg-[#5B6347] hover:text-white text-[#2C2C2C] text-xs font-semibold uppercase tracking-widest py-2.5 rounded-xl text-center transition-colors block cursor-pointer"
                      >
                        <span className="flex items-center justify-center gap-1">
                          Ir para o Site <ExternalLink className="w-3.5 h-3.5" />
                        </span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
