-- 
-- UPLar - Supabase Database Schema
-- Generated as an architectural delivery for Supabase integration.
--

-- Enable UUID Extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. TABELA DE USUÁRIOS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    perfil_estilo VARCHAR(100), -- Ex: Japandi, Boho Chic, Rústico Contemporâneo, Industrial Moderno
    telefone VARCHAR(50), -- Contato direto / WhatsApp do Lead para n8n
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.usuarios IS 'Cadastro de usuários do ecossistema UPLar.';
COMMENT ON COLUMN public.usuarios.perfil_estilo IS 'Resultado consolidado do teste de estilo (Forms).';

-- ==========================================
-- 2. TABELA DE RESPOSTAS DO FORMULÁRIO (Style Quiz)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.respostas_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE CASCADE,
    respostas JSONB NOT NULL, -- Armazena as respostas brutas {cozinha: 'A', cores: 'B', ...}
    estilo_calculado VARCHAR(100) NOT NULL, -- Resultado da pontuação ponderada do quiz
    gerado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.respostas_forms IS 'Histórico de testes de estilo preenchidos pelos usuários.';

-- ==========================================
-- 3. TABELA DE PRODUTOS RASPADOS (Produtos Scraped)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.produtos_scraped (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(255) NOT NULL,
    preco NUMERIC(10, 2) NOT NULL,
    preco_original NUMERIC(10, 2), -- Para fins de comparação ou promoção
    loja VARCHAR(150) NOT NULL, -- Ex: Leroy Merlin, Westwing, Tok&Stok
    categoria VARCHAR(100) NOT NULL, -- Ex: Revestimento, Mobiliário, Iluminação, Decoração
    image_url TEXT,
    link_produto TEXT NOT NULL,
    compatibilidade_estilo TEXT[] NOT NULL, -- Array de estilos compatíveis: ['Japandi', 'Industrial']
    rating NUMERIC(3, 2) DEFAULT 5.0, -- Nota de avaliação do produto (0 a 5)
    raspado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_produtos_scraped_categoria ON public.produtos_scraped(categoria);
CREATE INDEX IF NOT EXISTS idx_produtos_scraped_compatibilidade ON public.produtos_scraped USING gin (compatibilidade_estilo);

COMMENT ON TABLE public.produtos_scraped IS 'Produtos de reforma e decoração filtrados e comparados pelo Scraper.';

-- ==========================================
-- 4. TABELA DE AGENDAMENTOS DE CONSULTORIA
-- ==========================================
CREATE TABLE IF NOT EXISTS public.agendamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES public.usuarios(id) ON DELETE SET NULL,
    nome_cliente VARCHAR(255) NOT NULL,
    email_cliente VARCHAR(255) NOT NULL,
    telefone VARCHAR(50),
    data_agendada DATE NOT NULL,
    horario_agendado TIME NOT NULL,
    tipo_servico VARCHAR(150) DEFAULT 'Consultoria Online standard' NOT NULL, -- Ex: Consultoria de Cozinha, Iluminação, Layout Geral
    perfil_estilo_associado VARCHAR(100),
    observacoes TEXT,
    status VARCHAR(50) DEFAULT 'Pendente' NOT NULL, -- Pendente, Confirmado, Cancelado, Concluído
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.agendamentos IS 'Agendamentos de consultoria de design de interiores com profissionais parceiros.';

-- ==========================================
-- 5. POLÍTICAS DE SEGURANÇA (Row Level Security - RLS)
-- ==========================================
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.respostas_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos_scraped ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Políticas Públicas Simplificadas para Demonstração / MVP
-- (Em produção, idealmente restringir para auth.uid())

CREATE POLICY "Acesso total aos usuários pela API" 
    ON public.usuarios FOR ALL USING (true);

CREATE POLICY "Acesso total às respostas pela API" 
    ON public.respostas_forms FOR ALL USING (true);

CREATE POLICY "Leitura pública de produtos scraped" 
    ON public.produtos_scraped FOR SELECT USING (true);

CREATE POLICY "Acesso total aos agendamentos pela API" 
    ON public.agendamentos FOR ALL USING (true);


-- ==========================================
-- 6. DADOS INICIAIS DE EXEMPLO (SEED DATA)
-- ==========================================
INSERT INTO public.produtos_scraped (titulo, preco, preco_original, loja, categoria, image_url, link_produto, compatibilidade_estilo, rating)
VALUES 
('Piso Vinílico Carvalho Natural - Durafloor', 119.90, 149.00, 'Leroy Merlin', 'Revestimento', 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?w=600', 'https://www.leroymerlin.com.br', ARRAY['Japandi', 'Boho Chic', 'Rústico Contemporâneo'], 4.8),
('Sofá Orquidea 3 Lugares Terracota', 2499.00, 2999.00, 'Westwing', 'Mobiliário', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600', 'https://club.westwing.com.br', ARRAY['Japandi', 'Boho Chic'], 4.9),
('Pendente de Palha Trançada Artesanal', 289.00, 350.00, 'MadeiraMadeira', 'Iluminação', 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600', 'https://www.madeiramadeira.com.br', ARRAY['Boho Chic', 'Rústico Contemporâneo'], 4.5),
('Luminária Industrial de Cobre e Ferro', 189.90, NULL, 'Leroy Merlin', 'Iluminação', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600', 'https://www.leroymerlin.com.br', ARRAY['Industrial Moderno'], 4.6),
('Revestimento Monoporoso Retificado Tijolinho Terracota', 89.90, 99.90, 'Cobasi Home', 'Revestimento', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=600', 'https://www.leroymerlin.com.br', ARRAY['Industrial Moderno', 'Rústico Contemporâneo'], 4.7),
('Poltrona de Coro Marrom Mid-Century', 1350.00, 1500.00, 'Tok&Stok', 'Mobiliário', 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600', 'https://www.tokstok.com.br', ARRAY['Industrial Moderno', 'Japandi'], 4.9),
('Vaso Terracota Minimalista Artesanal', 75.00, NULL, 'Mundo Verde Decor', 'Decoração', 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=600', 'https://www.westwing.com.br', ARRAY['Japandi', 'Boho Chic', 'Rústico Contemporâneo'], 4.4);
