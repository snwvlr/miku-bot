# 🤝 Guia de Contribuição

Obrigado por querer contribuir com o Miku Bot! Este guia explica como participar do projeto da melhor forma.

---

## 📋 Índice

- [Como reportar bugs](#como-reportar-bugs)
- [Como sugerir features](#como-sugerir-features)
- [Como contribuir com código](#como-contribuir-com-código)
- [Padrões de código](#padrões-de-código)
- [Padrão de commits](#padrão-de-commits)

---

## Como reportar bugs

1. Verifique se o bug já foi reportado nas [Issues](https://github.com/snwvlr/miku-bot/issues)
2. Se não encontrou, abra uma nova issue usando o template **Bug Report**
3. Inclua o máximo de detalhes: versão do Node, mensagem de erro, passos para reproduzir

---

## Como sugerir features

1. Abra uma issue usando o template **Feature Request**
2. Explique o problema que a feature resolve e como ela funcionaria
3. Aguarde discussão antes de implementar

---

## Como contribuir com código

```bash
# 1. Fork o repositório
# 2. Clone o seu fork
git clone https://github.com/SEU-USUARIO/miku-bot.git
cd miku-bot

# 3. Crie uma branch descritiva
git checkout -b feat/nome-da-feature
# ou
git checkout -b fix/descricao-do-bug

# 4. Instale as dependências
cd discord-bot && npm install

# 5. Faça suas alterações e commit (veja padrão abaixo)
git commit -m "feat: adiciona comando /weather"

# 6. Push para o seu fork
git push origin feat/nome-da-feature

# 7. Abra um Pull Request para a branch main
```

---

## Padrões de código

- Use `const`/`let`, nunca `var`
- Nomes de variáveis em `camelCase`, arquivos em `kebab-case`
- Trate todos os erros com `try/catch` e log adequado
- Novos comandos devem seguir a estrutura dos existentes em `src/commands/slash/`
- Não commite `.env`, tokens, ou credenciais de nenhum tipo
- Use `axios@1.14.0` — **não atualize** até nova instrução explícita (ver [SECURITY.md](SECURITY.md))

### Estrutura de um slash command

```js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('comando')
    .setDescription('Descrição do comando'),

  async execute(interaction) {
    // implementação
  }
};
```

---

## Padrão de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

| Tipo | Uso |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Apenas documentação |
| `refactor` | Refatoração sem mudança de comportamento |
| `chore` | Tarefas de manutenção (deps, config) |
| `security` | Correção de vulnerabilidade |

Exemplos:
```
feat: adiciona comando /weather com suporte a cidades
fix: corrige crash no aiService quando todos os providers falham
docs: atualiza README com novos exemplos de uso
security: fixa axios para 1.14.0 (supply chain attack)
```

---

Dúvidas? Abra uma [Discussion](https://github.com/snwvlr/miku-bot/discussions) ou entre em contato pelo GitHub.
