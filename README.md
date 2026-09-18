# 🇧🇷 Pauta Brasil

> **Informação, transparência e democracia.**

Portal de informação política brasileira: mapa eleitoral interativo, perfis de candidatos, comparador de propostas, notícias e ferramentas de análise.

🌐 **Site no ar:** [pauta-brasil.vercel.app](https://pauta-brasil.vercel.app)

---

## ✨ Funcionalidades

- 🗺️ **Mapa interativo** dos 27 estados brasileiros
- 👤 **Perfil do candidato** com propostas, histórico, patrimônio e redes sociais
- ⚖️ **Comparador de propostas** lado a lado (até 4 candidatos)
- 🔍 **Busca** por nome, partido, cargo ou tema
- 📰 **Notícias** com compartilhamento social
- 🏛️ **Modo Portal** — home alternativa para fora de época de eleição
- 📊 **Ranking de popularidade** dos governadores
- 🌙 **Dark mode** completo
- 📱 **100% responsivo** (mobile-first)
- 🚀 **SEO otimizado** com OG images dinâmicas

---

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) |
| Estilo | [Tailwind CSS v4](https://tailwindcss.com/) |
| Tipagem | [TypeScript](https://www.typescriptlang.org/) |
| Ícones | [Lucide](https://lucide.dev/) + SVGs próprios para marcas |
| Mapa | [@svg-maps/brazil](https://www.npmjs.com/package/@svg-maps/brazil) |

---

## 🚀 Rodar localmente

```bash
# Clone o repositório
git clone https://github.com/Pablosillva/pauta-brasil.git
cd pauta-brasil

# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev

Acesse http://localhost:3000.

📁 Estrutura

src/
├── app/                 # Rotas (App Router)
│   ├── candidatos/      # Lista + perfil individual
│   ├── comparador/      # Comparador de propostas
│   ├── ferramentas/     # Hub de ferramentas
│   ├── mapa/            # Mapa interativo
│   ├── noticias/        # Notícias + detalhe
│   ├── planos/          # Planos de governo
│   ├── portal/          # Modo Portal
│   ├── busca/           # Busca global
│   └── sobre/           # Institucional
├── components/
│   ├── home/            # Seções da home
│   ├── portal/          # Seções do Modo Portal
│   ├── mapa/            # Mapa + painel lateral
│   ├── comparador/      # Seletor + tabela
│   ├── candidatos/      # Filtros
│   ├── layout/          # Header + Footer
│   ├── icons/           # SVGs de marcas (Facebook, etc.)
│   └── ui/              # Componentes base (Button, SearchBar...)
├── data/                # Dados mockados (candidatos, notícias)
└── lib/                 # Utilitários
🎨 Design
Cores: Azul institucional #0A2540, Verde Brasil #009B3A

Tipografia: Inter

Dark mode: alternável manualmente, persistido em localStorage

📄 Licença
MIT — sinta-se livre para usar como base para seus próprios projetos.

Feito com 💚 para a democracia brasileira.