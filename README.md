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
