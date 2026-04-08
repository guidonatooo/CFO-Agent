# CFO Agent — Financial Intelligence System

Sistema de inteligência financeira para gestores e empresários. Dashboards profissionais, alertas automáticos e análises com IA — sem precisar de uma equipe financeira.

## Estrutura do Projeto

```
cfo-agent/
├── landing-page/
│   └── index.html          # Site de vendas
├── login/
│   └── index.html          # Tela de acesso (por convite)
├── planilha/
│   └── CFO_Agent_Planilha.xlsx  # Planilha de preenchimento mensal
├── dashboard/
│   └── index.html          # Dashboard completo (10 seções)
└── README.md
```

## Stack

- HTML + CSS + JavaScript puro (zero dependências de build)
- Charts: [Chart.js 4.4](https://www.chartjs.org/) via CDN
- Fontes: Cormorant Garamond + Plus Jakarta Sans (Google Fonts)
- Planilha: Excel (.xlsx) gerado com openpyxl
- Sem backend — dados mockados, pronto para integração

## Páginas

### Landing Page (`landing-page/index.html`)
- Navbar fixa com logo
- Hero com mockup do dashboard
- Seção de problemas (pain points)
- 9 funcionalidades em grid
- Timeline "Como funciona" (3 etapas)
- Pricing (3 planos: R$997 / R$2.497 / R$497/mês)
- Depoimentos, FAQ com accordion, CTA final e Footer

### Login (`login/index.html`)
- Layout split: visual/branding à esquerda, formulário à direita
- Acesso restrito (por convite/admin)
- Toggle de senha, "lembrar de mim", link "esqueci minha senha"
- Redirect para dashboard após autenticação

### Planilha (`planilha/CFO_Agent_Planilha.xlsx`)
5 abas:
1. **INSTRUCOES** — guia de preenchimento
2. **FATURAMENTO** — bruto, deduções, líquido por mês
3. **CUSTOS** — 17 categorias × 12 meses com totais automáticos
4. **BANCOS_SALDOS** — 5 instituições × 12 meses
5. **TRANSACOES** — 30+ transações exemplo com filtros automáticos

### Dashboard (`dashboard/index.html`)
10 seções navegáveis via sidebar:

| # | Seção | Descrição |
|---|-------|-----------|
| 1 | Visão Geral | 8 KPIs + evolução + alertas ativos |
| 2 | Evolução Temporal | Barras agrupadas + área por banco + margem |
| 3 | Breakdown de Custos | Donut top 10 + barras jan vs fev + tabela |
| 4 | Fluxo de Caixa | Entradas vs saídas + distribuição por banco |
| 5 | Tabela de Custos | 17 categorias com variação % e total |
| 6 | Transações | 30 transações com filtros e paginação |
| 7 | Tendências | Projeção 3M + cenários otimista/base/pessimista |
| 8 | Alertas Financeiros | 3 críticos · 4 avisos · 3 informativos |
| 9 | Assistente CFO com IA | Chat com respostas baseadas nos dados |
| 10 | Relatórios | Exportar PDF (print) e CSV |

## Paleta de Cores

| Token | Hex | Uso |
|-------|-----|-----|
| `--royal` | `#0E2F7A` | Primária escura |
| `--royal-mid` | `#1A4BBF` | Primária média |
| `--royal-light` | `#2D63E0` | Interações |
| `--gold` | `#C9971C` | CTAs e destaques |
| `--gold-light` | `#F0C040` | Destaques hover |
| `--dark` | `#08163A` | Background principal |

## Como usar localmente

Basta abrir qualquer `index.html` diretamente no browser — não requer servidor.

```bash
# Clonar
git clone https://github.com/guidonatooo/CFO-Agent.git
cd CFO-Agent

# Abrir direto no browser (Windows)
start landing-page/index.html

# Ou com um servidor local simples
npx serve .
```

## Deploy

### Visão geral da arquitetura

```
GitHub (código)
    ↓  push para main
Vercel (hospedagem — auto-deploy)
    ↓  variáveis de ambiente
Supabase (banco de dados + autenticação)
```

---

### 1. Criar projeto no Supabase

1. Acesse [supabase.com](https://supabase.com) e faça login (ou crie uma conta gratuita).
2. Clique em **New project**.
3. Preencha:
   - **Name:** `cfo-agent`
   - **Database Password:** escolha uma senha forte e guarde — você vai precisar dela.
   - **Region:** South America (São Paulo) — menor latência para usuários no Brasil.
4. Clique em **Create new project** e aguarde o provisionamento (~1 min).

---

### 2. Executar o schema.sql no Supabase

No painel do projeto criado:

1. No menu lateral, clique em **SQL Editor**.
2. Clique em **+ New query**.
3. Cole e execute o conteúdo do arquivo `supabase/schema.sql` (quando criado).

O schema cria as tabelas principais:

```sql
-- Exemplo do que o schema.sql conterá:

-- Tabela de clientes (cada cliente tem seu próprio conjunto de dados)
create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text unique not null,
  plano text default 'produto',
  criado_em timestamptz default now()
);

-- Tabela de faturamento
create table public.faturamento (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references public.clientes(id) on delete cascade,
  mes text not null,
  descricao text,
  valor numeric(12,2) not null,
  categoria text,
  criado_em timestamptz default now()
);

-- Tabela de custos
create table public.custos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references public.clientes(id) on delete cascade,
  mes text not null,
  categoria text not null,
  descricao text,
  valor numeric(12,2) not null,
  criado_em timestamptz default now()
);

-- Tabela de saldos bancários
create table public.saldos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references public.clientes(id) on delete cascade,
  mes text not null,
  instituicao text not null,
  saldo_inicial numeric(12,2),
  saldo_final numeric(12,2),
  criado_em timestamptz default now()
);

-- Tabela de transações
create table public.transacoes (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid references public.clientes(id) on delete cascade,
  data date,
  mes text,
  banco text,
  descricao text,
  tipo text check (tipo in ('Crédito','Débito')),
  valor numeric(12,2),
  categoria text,
  criado_em timestamptz default now()
);

-- Row Level Security: cada usuário só vê os próprios dados
alter table public.faturamento enable row level security;
alter table public.custos enable row level security;
alter table public.saldos enable row level security;
alter table public.transacoes enable row level security;
```

4. Clique em **Run** (ou `Ctrl+Enter`). Confirme que aparece `Success. No rows returned`.

---

### 3. Coletar as variáveis de ambiente do Supabase

No painel do projeto Supabase:

1. Menu lateral → **Project Settings** → **API**.
2. Copie e guarde os dois valores:

| Variável | Onde encontrar |
|----------|----------------|
| `SUPABASE_URL` | Campo **Project URL** (ex: `https://xyzxyz.supabase.co`) |
| `SUPABASE_ANON_KEY` | Campo **anon / public** em *Project API keys* |

> **Nunca** commite essas chaves no repositório. O `.gitignore` já está configurado para ignorar arquivos `.env`.

---

### 4. Conectar o repositório ao Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta GitHub.
2. Clique em **Add New… → Project**.
3. Na lista de repositórios, selecione **guidonatooo/CFO-Agent** e clique em **Import**.
4. Configure o projeto:
   - **Framework Preset:** Other (sem framework)
   - **Root Directory:** `.` (raiz do repositório)
   - **Build Command:** *(deixar vazio)*
   - **Output Directory:** `.` (raiz)
   - **Install Command:** *(deixar vazio)*
5. Clique em **Deploy** — o primeiro deploy usará os arquivos estáticos sem backend.

A partir daí, todo `git push origin main` dispara um novo deploy automaticamente.

---

### 5. Configurar variáveis de ambiente no Vercel

Após o primeiro deploy:

1. No painel do projeto no Vercel, clique em **Settings → Environment Variables**.
2. Adicione as seguintes variáveis (selecione todos os ambientes: Production, Preview, Development):

| Nome | Valor |
|------|-------|
| `SUPABASE_URL` | `https://seu-projeto.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGc...` (chave anon do Supabase) |

3. Clique em **Save** e depois em **Deployments → Redeploy** para aplicar as variáveis.

> Quando o frontend for migrado para Next.js ou usar Supabase JS diretamente no browser, use o prefixo `NEXT_PUBLIC_` ou referencie as variáveis via script de servidor.

---

### 6. Adicionar o primeiro usuário

O sistema usa **acesso por convite** — não há cadastro público. Para criar o primeiro acesso:

1. No painel do Supabase, clique em **Authentication** → **Users**.
2. Clique em **Invite user**.
3. Informe o **e-mail** do usuário e clique em **Send invite**.
4. O usuário receberá um e-mail com link para definir a senha e acessar o sistema.

> **Alternativa (criar sem convite):** Em **Authentication → Users**, clique em **Add user → Create new user**, informe e-mail e senha manualmente e marque *Auto Confirm User*.

Para vincular o usuário ao painel de um cliente específico após a implementação do backend, execute no **SQL Editor**:

```sql
insert into public.clientes (nome, email, plano)
values ('Nome do Cliente', 'cliente@email.com', 'implantacao');
```

---

### 7. Domínio personalizado (opcional)

1. No Vercel → **Settings → Domains**.
2. Clique em **Add Domain** e insira seu domínio (ex: `app.cfoagent.com.br`).
3. Siga as instruções para adicionar o registro CNAME ou A no seu provedor de DNS.

---

## Roadmap

- [ ] Integração com Google Sheets (leitura automática da planilha)
- [ ] Backend com Supabase (autenticação real)
- [ ] Integração Asaas API (dados bancários reais)
- [ ] Assistente IA com Claude API (anthropic)
- [ ] Notificações por WhatsApp (alertas automáticos)
- [ ] App mobile (PWA)

## Planos Comerciais

| Plano | Valor | Inclui |
|-------|-------|--------|
| Produto | R$ 997 (único) | Dashboard + planilha + 1 mês suporte email |
| Implantação + Suporte | R$ 2.497 (3 meses) | Tudo + onboarding + reuniões mensais + WhatsApp |
| Assinatura Mensal | R$ 497/mês | Suporte contínuo + novas features |

---

© 2026 CFO Agent · Todos os direitos reservados.
