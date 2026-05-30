<div align="center">

# 🌸 Miku Bot

**A feature-rich Discord bot with multi-provider AI, personality customization, 100+ slash commands, moderation, and more.**

[![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=flat-square&logo=discord&logoColor=white)](https://discord.js.org)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square&logo=node.js)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Open Source](https://img.shields.io/badge/open%20source-❤-red?style=flat-square)](https://github.com/snwvlr/miku-bot)

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-snwvlr-FFDD00?style=flat-square&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/snwvlr)

[**Instalação**](#-instalação) · [**Configuração**](#-configuração) · [**Comandos**](#-comandos) · [**IA**](#-inteligência-artificial) · [**Contribuir**](CONTRIBUTING.md)

</div>

---

## ✨ Visão Geral

Miku Bot é um bot Discord completo, open source, desenvolvido com **discord.js v14**. Ele conta com integração de múltiplos provedores de IA (Gemini, Claude e GPT), personalidade customizável, sistema de moderação robusto, comandos de interação com GIFs e muito mais.

> ⚠️ **Nota de segurança:** Este projeto utiliza `axios@1.14.0` (versão segura). As versões `1.14.1` e `0.30.4` do axios foram comprometidas em um supply chain attack em Março de 2026 — veja [SECURITY.md](SECURITY.md) para mais detalhes.

---

## 🤖 Inteligência Artificial

- **3 provedores**: Google Gemini · Anthropic Claude · OpenAI GPT
- **Fallback automático**: se um provedor falhar, o próximo é usado
- **Personalidade customizável** via `/personality` ou variável de ambiente
- **Histórico por canal** com limite configurável
- **Reconhece o dono** com tratamento especial

```
@Miku oi!
> Oiê! 💕 Tudo bem?

@Miku me explica como funciona uma API
> Uma API é basicamente um contrato entre sistemas...
```

> Configure a ordem dos provedores via `AI_PRIORITY=gemini,anthropic,openai`

---

## 🚀 Instalação

### Pré-requisitos

- Node.js >= 18
- Uma aplicação criada no [Discord Developer Portal](https://discord.com/developers/applications)
- Pelo menos **uma** API key de IA (Gemini é gratuito)

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/snwvlr/miku-bot.git
cd miku-bot/discord-bot

# 2. Instale as dependências
npm install

# 3. Configure o ambiente
cp .env.example .env
# Edite o .env com suas chaves

# 4. Registre os slash commands
npm run deploy

# 5. Inicie o bot
npm start
```

---

## ⚙️ Configuração

Copie `.env.example` para `.env` e preencha os valores. Exemplo mínimo:

```env
# Discord (obrigatório)
DISCORD_TOKEN=seu_token
CLIENT_ID=seu_client_id
GUILD_ID=seu_guild_id
OWNER_ID=seu_user_id

# IA — configure pelo menos uma
GEMINI_API_KEY=        # gratuito em aistudio.google.com
ANTHROPIC_API_KEY=     # console.anthropic.com
OPENAI_API_KEY=        # platform.openai.com
```

Veja o arquivo [`.env.example`](discord-bot/.env.example) para todas as opções disponíveis.

---

## 📋 Comandos

| Categoria | Qtd | Exemplos |
|---|---|---|
| 🎭 Interação | 45 | `hug` `kiss` `pat` `slap` `bonk` `dance` `cuddle` `bite` |
| 🎮 Diversão | 16 | `waifu` `neko` `8ball` `ship` `roll` `coinflip` `joke` |
| 🛡️ Moderação | 13 | `ban` `kick` `clear` `timeout` `warn` `lock` `softban` |
| 🔧 Utilidade | 7 | `ping` `avatar` `userinfo` `serverinfo` `emoji` |
| ⚙️ Config | 2 | `welcome` `autorole` |
| ℹ️ Info | 2 | `about` `invite` |
| 👑 Owner | 6 | `personality` `broadcast` `status` `reload` |
| **Total Slash** | **91** | |
| 🖱️ Context Menus | 9 | Deletar · Fixar · Citar · Banir · Silenciar · Traduzir |
| **Total Geral** | **100+** | |

---

## 📁 Estrutura

```
miku-bot/
├── discord-bot/           # código principal
│   ├── src/
│   │   ├── commands/
│   │   │   ├── slash/     # comandos slash por categoria
│   │   │   └── context/   # menus de contexto
│   │   ├── events/        # ready, interactionCreate, messageCreate, guildMemberAdd
│   │   ├── handlers/      # carregamento automático de comandos e eventos
│   │   ├── services/
│   │   │   ├── aiService.js     # integração multi-provider de IA
│   │   │   └── nekosService.js  # GIFs de interação
│   │   ├── utils/               # embed helper, logger
│   │   └── data/                # persistência local (welcome, autorole)
│   ├── .env.example
│   └── package.json
├── CONTRIBUTING.md
├── SECURITY.md
├── CODE_OF_CONDUCT.md
├── LICENSE
└── README.md
```

---

## 📦 Tecnologias

| Pacote | Versão | Uso |
|---|---|---|
| [discord.js](https://discord.js.org) | v14 | Framework principal |
| [@google/generative-ai](https://ai.google.dev) | latest | Gemini AI |
| [@anthropic-ai/sdk](https://docs.anthropic.com) | latest | Claude AI |
| [openai](https://platform.openai.com) | latest | GPT |
| [axios](https://axios-http.com) | **1.14.0** ⚠️ | Requisições HTTP (ver SECURITY.md) |
| [dotenv](https://github.com/motdotla/dotenv) | latest | Variáveis de ambiente |

---

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Veja o guia completo em [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 🔒 Segurança

Encontrou uma vulnerabilidade? Veja [SECURITY.md](SECURITY.md) para saber como reportar de forma responsável.

---

## 📄 Licença

Distribuído sob a licença MIT. Veja [LICENSE](LICENSE) para mais informações.

---

<div align="center">

Feito com 💕 e muito café ☕

Se o projeto te ajudou, considere apoiar:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-snwvlr-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/snwvlr)

</div>
