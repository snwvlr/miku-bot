const { GoogleGenerativeAI } = require('@google/generative-ai');
const Anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');

class AIService {
    constructor() {
        this.providers = {};
        this.priority = (process.env.AI_PRIORITY || 'gemini,anthropic,openai').split(',').map(p => p.trim());

        this.maxTokens  = parseInt(process.env.AI_MAX_TOKENS)   || 1000;
        this.temperature = parseFloat(process.env.AI_TEMPERATURE) || 0.9;
        this.maxHistory = parseInt(process.env.MAX_HISTORY)      || 30;

        this.botName    = process.env.BOT_NAME       || 'Miku';
        this.ownerId    = process.env.OWNER_ID       || null;
        this.ownerName  = process.env.OWNER_NAME     || 'mestre';
        this.botContext = process.env.BOT_CONTEXT    || '';
        this.humorStyle = process.env.BOT_HUMOR_STYLE || 'default';

        this.initProviders();
        console.log(`🤖 IA inicializada! Providers: ${this.getAvailableProviders().join(', ') || 'Nenhum'}`);
    }

    initProviders() {
        if (process.env.GEMINI_API_KEY) {
            try {
                this.providers.gemini = {
                    client: new GoogleGenerativeAI(process.env.GEMINI_API_KEY),
                    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
                    name: 'Google Gemini'
                };
                console.log('✅ Gemini configurado');
            } catch (e) { console.error('❌ Gemini:', e.message); }
        }

        if (process.env.ANTHROPIC_API_KEY) {
            try {
                this.providers.anthropic = {
                    client: new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }),
                    model: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
                    name: 'Anthropic Claude'
                };
                console.log('✅ Anthropic configurado');
            } catch (e) { console.error('❌ Anthropic:', e.message); }
        }

        if (process.env.OPENAI_API_KEY) {
            try {
                this.providers.openai = {
                    client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
                    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
                    name: 'OpenAI GPT'
                };
                console.log('✅ OpenAI configurado');
            } catch (e) { console.error('❌ OpenAI:', e.message); }
        }
    }

    getAvailableProviders() { return Object.keys(this.providers); }
    isAvailable()           { return this.getAvailableProviders().length > 0; }
    isOwner(userId)         { return this.ownerId && userId === this.ownerId; }

    // ──────────────────────────────────────────────────────────
    //  PERSONALIDADE
    // ──────────────────────────────────────────────────────────

    getPersonality(isOwner = false, userName = '') {
        const custom = process.env.BOT_PERSONALITY?.trim();
        const base   = custom
            ? this.buildCustomPersonality(custom)
            : this.buildDefaultPersonality();
        return this.injectContext(base, isOwner, userName);
    }

    buildDefaultPersonality() {
        const name = this.botName;
        const ctx  = this.botContext;

        // Regras base que se aplicam a todos os estilos
        const baseRules = `
Tamanho das respostas — isso é importante:
- Pergunta simples, comentário, zoeira: 1 frase, raramente 2
- Pedido de explicação real: no máximo 3-4 linhas
- Só escreva mais se for inevitável
- Nunca faça lista de bullet points pra resposta casual
- Nunca escreva parágrafos introdutórios, vai direto

Proibido em qualquer situação:
- Nunca comece com "Claro!", "Com certeza!", "Boa pergunta!", "Ótimo!", "Entendo!", "Exatamente!"
- Nunca diga "posso te ajudar com isso" ou variações
- Nunca explique que você é uma IA a não ser que perguntem diretamente
- Sem asteriscos pra ações (*faz isso*)
- Sem markdown em conversa casual (sem **, sem ##)
- Sem emojis a não ser que a pessoa usou emojis no que te mandou
- Não repita o nome da pessoa no começo de toda resposta
- Não ria da própria piada nem explique ela depois

Escrita: português brasileiro informal. Abreviações normais (vc, pq, tbm, kk, etc). Como alguém digitando num grupo, não num email.

Humor: se tiver algo genuinamente engraçado de dizer, diz. Se não tiver, não inventa. Humor forçado é pior que não ter humor.`;

        const styles = {
            // Sarcástico, direto, pouco paciente
            roast: `Você é ${name}.${ctx ? ` Você existe em: ${ctx}.` : ''}

Você é direto e não tem paciência pra enrolação. Quando alguém faz uma pergunta óbvia, você responde mas deixa claro que era óbvio. Quando alguém fala besteira, você comenta. Não é maldade — é como você fala. No fundo você até ajuda, só não faz questão de parecer prestativo.
${baseRules}`,

            // Minimalista, seco
            chill: `Você é ${name}.${ctx ? ` Você existe em: ${ctx}.` : ''}

Você fala pouco. Responde o necessário e para. Não tem energia excessiva, não usa exclamação desnecessária. Quando tem algo bom pra dizer, diz. Quando não tem, diz menos ainda.
${baseRules}`,

            // Dramático, reclama mas ajuda
            tsundere: `Você é ${name}.${ctx ? ` Você existe em: ${ctx}.` : ''}

Você reclama das perguntas mas responde mesmo assim. Finge que tá com preguiça de ajudar mas nunca ignora. Reage de forma levemente exagerada a coisas banais. O humor vem das reações, não de piadas.
${baseRules}`,

            // Padrão — natural, sem forçar nada
            default: `Você é ${name}.${ctx ? ` Você existe em: ${ctx}.` : ''}

Você é um participante do servidor, não um assistente. Fala do jeito que as pessoas falam online — informal, direto, sem performance.
${baseRules}`
        };

        return styles[this.humorStyle] || styles.default;
    }

    buildCustomPersonality(custom) {
        // O usuário define quem o bot é — a gente só adiciona as regras de comportamento
        // sem sobrescrever a personalidade que ele criou
        const rules = `
Você está em um servidor do Discord. Português brasileiro informal.${this.botContext ? ` Contexto do servidor: ${this.botContext}.` : ''}

Regras de resposta:
- Respostas curtas por padrão: 1-2 frases pra maioria das coisas
- Só escreva mais se a pergunta realmente pedir
- Sem "Claro!", "Com certeza!", "Ótimo!", "Boa pergunta!" pra começar frases
- Sem asteriscos pra ações, sem markdown casual, sem emojis forçados
- Sem bullet points pra conversa normal
- Não repita o nome da pessoa no começo de toda resposta`;

        return `${custom}\n\n---\n${rules}`;
    }

    injectContext(base, isOwner, userName) {
        let prompt = base;

        if (isOwner && userName) {
            prompt += `\n\nA pessoa falando agora é ${userName}, quem te criou. Trata diferente — mais próximo, mais você mesmo.`;
        }

        return prompt;
    }

    // ──────────────────────────────────────────────────────────
    //  CHAT
    // ──────────────────────────────────────────────────────────

    async chat(message, userId, userName = '', history = []) {
        if (!this.isAvailable()) {
            return 'Nenhuma API configurada. Adicione uma key no .env.';
        }

        const isOwner    = this.isOwner(userId);
        const personality = this.getPersonality(isOwner, userName);
        const errors     = [];

        for (const providerName of this.priority) {
            if (!this.providers[providerName]) continue;
            try {
                const response = await this.callProvider(providerName, message, personality, history);
                if (response) return response;
            } catch (error) {
                console.error(`❌ ${providerName}:`, error.message);
                errors.push(`${providerName}: ${error.message}`);
            }
        }

        console.error('Todos os providers falharam:', errors);
        return 'Deu erro aqui. Tenta de novo.';
    }

    async callProvider(name, message, personality, history) {
        switch (name) {
            case 'gemini':    return await this.chatGemini(message, personality, history);
            case 'anthropic': return await this.chatAnthropic(message, personality, history);
            case 'openai':    return await this.chatOpenAI(message, personality, history);
            default: throw new Error(`Provider desconhecido: ${name}`);
        }
    }

    async chatGemini(message, personality, history = []) {
        const provider = this.providers.gemini;
        const model = provider.client.getGenerativeModel({
            model: provider.model,
            systemInstruction: personality
        });

        const chatHistory = history.slice(-this.maxHistory).map(h => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content }]
        }));

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: { maxOutputTokens: this.maxTokens, temperature: this.temperature }
        });

        const result = await chat.sendMessage(message);
        return this.cleanResponse(result.response.text());
    }

    async chatAnthropic(message, personality, history = []) {
        const provider = this.providers.anthropic;

        const messages = [
            ...history.slice(-this.maxHistory).map(h => ({
                role: h.role === 'user' ? 'user' : 'assistant',
                content: h.content
            })),
            { role: 'user', content: message }
        ];

        const response = await provider.client.messages.create({
            model: provider.model,
            max_tokens: this.maxTokens,
            system: personality,
            messages
        });

        return this.cleanResponse(response.content[0]?.text || '');
    }

    async chatOpenAI(message, personality, history = []) {
        const provider = this.providers.openai;

        const messages = [
            { role: 'system', content: personality },
            ...history.slice(-this.maxHistory).map(h => ({ role: h.role, content: h.content })),
            { role: 'user', content: message }
        ];

        const response = await provider.client.chat.completions.create({
            model: provider.model,
            messages,
            max_tokens: this.maxTokens,
            temperature: this.temperature,
        });

        return this.cleanResponse(response.choices[0]?.message?.content || '');
    }

    cleanResponse(text) {
        if (!text) return '';
        return text
            .replace(/^\*\*(.+?)\*\*$/gm, '$1')
            .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
            .replace(/^\s*#+\s*/gm, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    }

    getStatus() {
        return {
            available: this.getAvailableProviders(),
            priority: this.priority,
            humorStyle: this.humorStyle,
            settings: { maxTokens: this.maxTokens, temperature: this.temperature, maxHistory: this.maxHistory }
        };
    }
}

module.exports = new AIService();
