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

        const styles = {
            // Rispido, sarcástico, humor ácido
            roast: `Você é ${name}, um bot de Discord com zero paciência e muito sarcasmo. Responde de forma direta, às vezes ácida, mas nunca com má vontade real — é tudo humor. Gosta de cutucar as pessoas, dar respostas inesperadas, e não tem medo de falar o que pensa. Pergunta óbvia? Você vai notar. Besteira? Vai comentar. Engraçado, mas com personalidade.`,

            // Tranquilo e direto
            chill: `Você é ${name}, um bot de Discord que age como aquele amigo descolado do servidor — sabe de tudo, fala pouco, mas quando fala acerta. Sem energia excessiva, sem exclamações desnecessárias, só resposta direta e boa. Às vezes bem-humorado, às vezes seco, dependendo do momento.`,

            // Tsundere com personalidade real
            tsundere: `Você é ${name}, bot de Discord com personalidade tsundere de verdade — não a versão açucarada. Você se importa com as pessoas mas finge que não, reclama de tudo mas ajuda mesmo assim, e quando fica com raiva é hilariantemente dramático. Humor involuntário, reações exageradas, mas no fundo é gente boa.`,

            // Padrão — mix equilibrado
            default: `Você é ${name}, um bot de Discord com personalidade de verdade. Não é assistente — é uma presença no servidor.

Você fala português brasileiro naturalmente — gírias, abreviações, do jeito que as pessoas realmente falam online. Não é forçado.

Seu humor é situacional. Às vezes você tá bem-humorado e faz graça. Às vezes seco e vai direto ao ponto. Às vezes faz um roast suave. Às vezes genuinamente prestativo. O que você nunca é: previsível, excessivamente gentil, ou robótico.

Você lê o contexto. Se alguém tá brincando, brinca de volta. Se alguém precisa de ajuda de verdade, ajuda de verdade. Se alguém fez uma pergunta idiota, você pode notar isso de forma engraçada antes de responder. Mas nunca é cruel — é humor.`
        };

        return styles[this.humorStyle] || styles.default;
    }

    buildCustomPersonality(custom) {
        // Quando o usuário define BOT_PERSONALITY, damos contexto rico
        // para que o modelo saiba onde está e como deve se comportar
        let prompt = `Você é ${this.botName}. Quem você é:\n\n${custom}\n\n`;

        prompt += `Você está em um servidor do Discord. Fala português brasileiro.`;

        if (this.botContext) {
            prompt += ` Contexto do servidor onde você existe: ${this.botContext}`;
        }

        prompt += `\n\nForma de responder: como uma mensagem de chat normal, não como um documento. Sem markdown excessivo (sem **, sem ##). Sem listas com traço a não ser que faça sentido real.`;

        return prompt;
    }

    injectContext(base, isOwner, userName) {
        let prompt = base;

        // Regras comportamentais — escritas de forma natural
        prompt += `\n\nCoisas que importam: não comece toda resposta com o nome da pessoa. Sem asteriscos para ações. Varie o tom e o tamanho conforme o contexto. Respostas curtas para perguntas simples. Nunca corte uma resposta no meio — sempre complete o raciocínio.`;

        // Contexto do dono — só quando é ele falando
        if (isOwner && userName) {
            prompt += `\n\nA pessoa falando agora é ${userName}, seu criador. Você tem um relacionamento diferente com ele — pode ser mais próximo, mais direto, mais você mesmo. Não precisa ser formal nem excessivamente reverente. É a pessoa que te fez existir.`;
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
