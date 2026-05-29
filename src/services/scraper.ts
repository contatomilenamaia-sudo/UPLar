/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScrapedProduct } from "../types";

// Base database of crawler sources to represent live marketplace catalog
const CATALOG_BASE = [
  // JAPANDI
  {
    title: "Mesa de Jantar de Madeira Clara Japandi",
    priceSources: [
      { store: "Tok&Stok", price: 1899.00, link: "https://www.tokstok.com.br/mesa-japandi" },
      { store: "Westwing", price: 1750.00, link: "https://www.westwing.com.br/mesa-madeira-clara" },
      { store: "MadeiraMadeira", price: 1950.00, link: "https://www.madeiramadeira.com.br/mesa-nordica" }
    ],
    category: "Mobiliário",
    imageUrl: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=600",
    styleCompatibility: ["Japandi", "Minimalista"],
    rating: 4.8
  },
  {
    title: "Lustre Esférico de Papel de Arroz Washis",
    priceSources: [
      { store: "Westwing", price: 349.90, link: "https://www.westwing.com.br/lustre-arroz" },
      { store: "Leroy Merlin", price: 389.00, link: "https://www.leroymerlin.com.br/pendente-oriental" }
    ],
    category: "Iluminação",
    imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600",
    styleCompatibility: ["Japandi"],
    rating: 4.7
  },
  {
    title: "Piso Porcelanato Acetinado Areia Fedi 90x90",
    priceSources: [
      { store: "Leroy Merlin", price: 89.90, link: "https://www.leroymerlin.com.br/porcelanato-acetinado-areia" },
      { store: "Cassol", price: 95.50, link: "https://www.cassol.com.br/porcelanato-areia" }
    ],
    category: "Revestimento",
    imageUrl: "https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=600",
    styleCompatibility: ["Japandi", "Minimalista", "Industrial Moderno"],
    rating: 4.9
  },

  // INDUSTRIAL MODERNO
  {
    title: "Estante de Ferro e Crema Nogueira",
    priceSources: [
      { store: "Tok&Stok", price: 1199.00, link: "https://www.tokstok.com.br/estante-ferro" },
      { store: "MadeiraMadeira", price: 1049.00, link: "https://www.madeiramadeira.com.br/estante-industrial" },
      { store: "Mobly", price: 1099.00, link: "https://www.mobly.com.br/estante-ferro-madeira" }
    ],
    category: "Mobiliário",
    imageUrl: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600",
    styleCompatibility: ["Industrial Moderno"],
    rating: 4.6
  },
  {
    title: "Pendente Aramado Preto de Carbono Triplo",
    priceSources: [
      { store: "Leroy Merlin", price: 159.90, link: "https://www.leroymerlin.com.br/pendente-aramado" },
      { store: "MadeiraMadeira", price: 145.00, link: "https://www.madeiramadeira.com.br/pendente-industrial-triplo" }
    ],
    category: "Iluminação",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600",
    styleCompatibility: ["Industrial Moderno"],
    rating: 4.5
  },
  {
    title: "Revestimento Metro White de Cerâmica Chanfrado",
    priceSources: [
      { store: "Leroy Merlin", price: 62.90, link: "https://www.leroymerlin.com.br/metro-white-porcelosa" },
      { store: "Telhanorte", price: 59.90, link: "https://www.telhanorte.com.br/revestimento-metro-white" }
    ],
    category: "Revestimento",
    imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600",
    styleCompatibility: ["Industrial Moderno", "Minimalista"],
    rating: 4.8
  },

  // BOHO CHIC
  {
    title: "Poltrona Rattan Tecida à Mão",
    priceSources: [
      { store: "Westwing", price: 899.00, link: "https://www.westwing.com.br/poltrona-rattan" },
      { store: "Tok&Stok", price: 999.00, link: "https://www.tokstok.com.br/poltrona-vime" }
    ],
    category: "Mobiliário",
    imageUrl: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600",
    styleCompatibility: ["Boho Chic", "Rústico Contemporâneo"],
    rating: 4.9
  },
  {
    title: "Luminária de Palha Natural Trançada",
    priceSources: [
      { store: "Westwing", price: 299.90, link: "https://www.westwing.com.br/luminaria-palha" },
      { store: "MadeiraMadeira", price: 340.00, link: "https://www.madeiramadeira.com.br/pendente-rustico-palha" }
    ],
    category: "Iluminação",
    imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600",
    styleCompatibility: ["Boho Chic", "Rústico Contemporâneo"],
    rating: 4.6
  },
  {
    title: "Tapete Macramê Terracota Algodão Orgânico",
    priceSources: [
      { store: "Westwing", price: 420.00, link: "https://www.westwing.com.br/tapete-boho" },
      { store: "Leroy Merlin", price: 479.00, link: "https://www.leroymerlin.com.br/tapete-croche" }
    ],
    category: "Decoração",
    imageUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600",
    styleCompatibility: ["Boho Chic"],
    rating: 4.7
  },

  // RÚSTICO CONTEMPORÂNEO
  {
    title: "Aparador Estilo Rústico de Madeira Maciça de Demolição",
    priceSources: [
      { store: "MadeiraMadeira", price: 1450.00, link: "https://www.madeiramadeira.com.br/aparador-rustico" },
      { store: "Westwing", price: 1390.00, link: "https://www.westwing.com.br/aparador-madeira-demolicao" }
    ],
    category: "Mobiliário",
    imageUrl: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600",
    styleCompatibility: ["Rústico Contemporâneo"],
    rating: 4.8
  },
  {
    title: "Lustre Rústico Retro Vigas Acabamento Ferro Envelhecido",
    priceSources: [
      { store: "Leroy Merlin", price: 549.90, link: "https://www.leroymerlin.com.br/viga-retro" },
      { store: "Cassol", price: 580.00, link: "https://www.cassol.com.br/viga-ferro" }
    ],
    category: "Iluminação",
    imageUrl: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600",
    styleCompatibility: ["Rústico Contemporâneo", "Industrial Moderno"],
    rating: 4.5
  },
  {
    title: "Ladrilho Hidráulico Artesanal Decorativo Terracota",
    priceSources: [
      { store: "Leroy Merlin", price: 149.90, link: "https://www.leroymerlin.com.br/ladrilho-terracota" },
      { store: "Telhanorte", price: 139.00, link: "https://www.telhanorte.com.br/ladrilho-artesanal" }
    ],
    category: "Revestimento",
    imageUrl: "https://images.unsplash.com/photo-1502005229762-fc1b2b812ca5?w=600",
    styleCompatibility: ["Rústico Contemporâneo", "Boho Chic"],
    rating: 4.9
  }
];

/**
 * Simulador de Scraper de Produtos da UPLar. It mimics crawling high quality
 * products in real-time, fetching several price points, sorting them to find the
 * absolute lowest price among competitive stores, and outputting JSON formats
 * compatible with the Supabase `produtos_scraped` table.
 */
export async function runUPLarProductScraper(styleProfile: string): Promise<ScrapedProduct[]> {
  // Simulate network latency of crawling and parsing page DOM trees (750ms)
  await new Promise((resolve) => setTimeout(resolve, 750));

  const scrapedResult: ScrapedProduct[] = [];

  // Match corresponding keywords/styles
  const targetStyle = styleProfile.toLowerCase();

  // Pick suitable products from the base catalog
  for (const item of CATALOG_BASE) {
    const isCompatible = item.styleCompatibility.some(
      (style) => style.toLowerCase() === targetStyle || targetStyle.includes(style.toLowerCase())
    );

    // If matches style or general demo
    if (isCompatible || targetStyle === "todos" || targetStyle === "") {
      // Find the best price (lowest source)
      const sortedSources = [...item.priceSources].sort((a, b) => a.price - b.price);
      
      // Best offer is index 0
      const bestOffer = sortedSources[0];
      // Original price is simulated as slightly higher for display
      const nextOfferPrice = sortedSources[1]?.price || bestOffer.price * 1.15;

      scrapedResult.push({
        id: `scraped-${Math.random().toString(36).substring(2, 9)}`,
        title: item.title,
        price: bestOffer.price,
        originalPrice: Math.round(nextOfferPrice),
        store: bestOffer.store,
        category: item.category as any,
        imageUrl: item.imageUrl,
        link: bestOffer.link,
        styleCompatibility: item.styleCompatibility,
        rating: item.rating
      });
    }
  }

  // If style list is empty, default return all items
  if (scrapedResult.length === 0) {
    return runUPLarProductScraper("todos");
  }

  return scrapedResult;
}

/**
 * Dev raw node scraper script string.
 * This is the exact code that would run on a cron job server or a Cloud Function,
 * which will be shown on the screen in our copyable Code Playground Hub!
 */
export const NODE_JS_SCRAPER_CODE_TEMPLATE = `/**
 * UPLar - Robô de Web Scraping & Comparação de Preços de Materiais e Mobiliário
 * Desenvolvido usando Puppeteer e Cheerio para rodar em Cloud Functions / Cron Jobs.
 * Salva os resultados diretamente no Supabase PostgreSQL.
 */

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { createClient } = require('@supabase/supabase-js');

// Inicialização do Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Lojas mapeadas para Raspagem
const PARTNER_STORES = [
  {
    name: "Leroy Merlin",
    searchUrl: "https://www.leroymerlin.com.br/busca?term=",
    selectors: {
      item: ".product-card",
      title: ".product-card__title",
      price: ".product-card__price-value",
      image: ".product-card__img",
      link: ".product-card__link"
    }
  },
  {
    name: "Westwing",
    searchUrl: "https://www.westwing.com.br/busca/?q=",
    selectors: {
      item: ".item-card",
      title: ".item-title",
      price: ".item-price",
      image: ".item-image img",
      link: ".card-anchor"
    }
  }
];

/**
 * Função Core do Scraper para rastrear produtos por palavra-chave
 */
async function crawlStoreProducts(storeConfig, keyword) {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  try {
    const page = await browser.newPage();
    // Bloquear recursos lentos para otimizar velocidade
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    const url = \`\${storeConfig.searchUrl}\${encodeURIComponent(keyword)}\`;
    console.log(\`[\${storeConfig.name}] Raspando: \${url}\`);
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const html = await page.content();
    const $ = cheerio.load(html);
    const products = [];

    \$(storeConfig.selectors.item).slice(0, 5).each((index, element) => {
      const title = \$(element).find(storeConfig.selectors.title).text().trim();
      const rawPrice = \$(element).find(storeConfig.selectors.price).text().trim();
      const imageUrl = \$(element).find(storeConfig.selectors.image).attr('src') || 
                       \$(element).find(storeConfig.selectors.image).attr('data-src');
      const productPath = \$(element).find(storeConfig.selectors.link).attr('href');

      if (title && rawPrice) {
        // Conversão de preço (R$ 1.250,50 -> 1250.50)
        const price = parseFloat(rawPrice.replace(/[^0-9,]/g, '').replace(',', '.'));
        const link = productPath.startsWith('http') ? productPath : \`https://\${storeConfig.name.split(' ')[0].toLowerCase()}.com.br\${productPath}\`;

        products.push({
          titulo: title,
          preco: price,
          loja: storeConfig.name,
          image_url: imageUrl,
          link_produto: link,
          compatibilidade_estilo: detectStyleCompatibility(title)
        });
      }
    });

    return products;
  } catch (err) {
    console.error(\`Falha ao raspar a loja \${storeConfig.name}:\`, err.message);
    return [];
  } finally {
    await browser.close();
  }
}

/**
 * Classificação inteligente baseada em palavras-chave no título do produto
 */
function detectStyleCompatibility(title) {
  const t = title.toLowerCase();
  const tags = [];
  if (t.includes('madeira') || t.includes('palha') || t.includes('bambu')) tags.push('Boho Chic');
  if (t.includes('ferro') || t.includes('cobre') || t.includes('industrial') || t.includes('cimento')) tags.push('Industrial Moderno');
  if (t.includes('natural') || t.includes('palha') || t.includes('rústico')) tags.push('Rústico Contemporâneo');
  if (t.includes('minimalista') || t.includes('nordic') || t.includes('japandi') || t.includes('bambu')) tags.push('Japandi');
  
  if (tags.length === 0) tags.push('Geral');
  return tags;
}

/**
 * Orquestrador principal responsável por raspar e atualizar o Supabase
 */
async function runScraperOrchestration(keyword = "luminária") {
  console.log(\`Iniciando ciclo de raspagem para: "\${keyword}"\`);
  let allScrapedProducts = [];

  for (const store of PARTNER_STORES) {
    const products = await crawlStoreProducts(store, keyword);
    allScrapedProducts = allScrapedProducts.concat(products);
  }

  console.log(\`Total de \${allScrapedProducts.length} produtos coletados de todas as fontes.\`);

  // Organizar para salvar no banco de dados Supabase
  for (const prod of allScrapedProducts) {
    // Upsert para não duplicar de forma indevida
    const { data, error } = await supabase
      .from('produtos_scraped')
      .upsert({
        titulo: prod.titulo,
        preco: prod.preco,
        loja: prod.loja,
        image_url: prod.image_url,
        link_produto: prod.link_produto,
        compatibilidade_estilo: prod.compatibilidade_estilo,
        categoria: "Iluminação" -- Padrão simplificado do cron
      }, { onConflict: 'link_produto' });

    if (error) console.error("Erro ao salvar no Supabase:", error.message);
  }

  console.log("Ciclo de raspagem completado com sucesso!");
}

module.exports = { runScraperOrchestration };
`;
