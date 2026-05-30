# 🔒 Política de Segurança

---

## Versões Suportadas

| Versão | Suportada |
|---|---|
| 4.x (main) | ✅ |
| < 4.0 | ❌ |

---

## ⚠️ Aviso Crítico: axios Supply Chain Attack (Março 2026)

Em **31 de março de 2026**, as versões `axios@1.14.1` e `axios@0.30.4` foram publicadas com código malicioso por um atacante que comprometeu a conta do mantenedor principal. Essas versões continham a dependência `plain-crypto-js@4.2.1`, um RAT (Remote Access Trojan) multiplataforma atribuído ao grupo norte-coreano **UNC1069 / Sapphire Sleet**.

### Versões afetadas

| Versão | Status |
|---|---|
| `axios@1.14.1` | ☠️ **COMPROMETIDA — não use** |
| `axios@0.30.4` | ☠️ **COMPROMETIDA — não use** |
| `axios@1.14.0` | ✅ Segura (última versão legítima 1.x) |
| `axios@0.30.3` | ✅ Segura (última versão legítima 0.x) |

### Status neste projeto

Este projeto usa **`axios@1.14.0`** (pinado sem `^`), garantindo que um `npm install` não instale automaticamente uma versão comprometida.

### Se você instalou 1.14.1

1. **Rotacione imediatamente** todos os tokens e credenciais no `.env`
2. Faça downgrade: `npm install axios@1.14.0`
3. Verifique logs do sistema por conexões suspeitas
4. Consulte o [advisory oficial](https://github.com/axios/axios/issues/10636)

### Referências

- [Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/04/01/mitigating-the-axios-npm-supply-chain-compromise/)
- [Huntress Analysis](https://www.huntress.com/blog/supply-chain-compromise-axios-npm-package)
- [Google Cloud / Mandiant](https://cloud.google.com/blog/topics/threat-intelligence/north-korea-threat-actor-targets-axios-npm-package)
- [CISA Advisory](https://www.cisa.gov/news-events/alerts/2026/04/20/supply-chain-compromise-impacts-axios-node-package-manager)
- [axios Post Mortem Issue #10636](https://github.com/axios/axios/issues/10636)

---

## Reportar uma Vulnerabilidade

**Não abra uma issue pública para vulnerabilidades de segurança.**

Para reportar uma vulnerabilidade neste projeto:

1. Envie um e-mail privado ou abra uma [GitHub Security Advisory](https://github.com/snwvlr/miku-bot/security/advisories/new)
2. Inclua: descrição detalhada, passos para reproduzir, impacto potencial
3. Você receberá uma resposta em até **72 horas**
4. Vulnerabilidades confirmadas serão corrigidas e um advisory público será publicado

Agradecemos quem contribui responsavelmente com a segurança do projeto. 🙏
