const { GoogleGenerativeAI } = require('@google/generative-ai');
const Anthropic = require('@anthropic-ai/sdk');
const OpenAI = require('openai');

class AIService {
    constructor() {
        this.providers = {};
        this.priority = (process.env.AI_PRIORITY || 'gemini,anthropic,openai').split(',').map(p => p.trim());
        
        // Configurações
        this.maxTokens = parseInt(process.env.AI_MAX_TOKENS) || 1000;
        this.temperature = parseFloat(process.env.AI_TEMPERATURE) || 0.8;
        this.maxHistory = parseInt(process.env.MAX_HISTORY) || 30;
        
        // Bot info
        this.botName = process.env.BOT_NAME || 'Miku';
        this.ownerId = process.env.OWNER_ID || null;
        this.ownerName = process.env.OWNER_NAME || 'Mestre';
        
        // Inicializar providers
        this.initProviders();
        
        console.log(`🤖 IA inicializada! Providers disponíveis: ${this.getAvailableProviders().join(', ') || 'Nenhum'}`);
    }

    initProviders() {
        // Google Gemini
        if (process.env.GEMINI_API_KEY) {
            try {
                this.providers.gemini = {
                    client: new GoogleGenerativeAI(process.env.GEMINI_API_KEY),
                    model: process.env.GEMINI_MODEL || 'gemini-2.0-flash',
                    name: 'Google Gemini'
                };
                console.log('✅ Gemini configurado');
            } catch (e) {
                console.error('❌ Erro ao configurar Gemini:', e.message);
            }
        }

        // Anthropic Claude
        if (process.env.ANTHROPIC_API_KEY) {
            try {
                this.providers.anthropic = {
                    client: new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }),
                    model: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307',
                    name: 'Anthropic Claude'
                };
                console.log('✅ Anthropic Claude configurado');
            } catch (e) {
                console.error('❌ Erro ao configurar Anthropic:', e.message);
            }
        }

        // OpenAI
        if (process.env.OPENAI_API_KEY) {
            try {
                this.providers.openai = {
                    client: new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
                    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
                    name: 'OpenAI GPT'
                };
                console.log('✅ OpenAI configurado');
            } catch (e) {
                console.error('❌ Erro ao configurar OpenAI:', e.message);
            }
        }
    }

    getAvailableProviders() {
        return Object.keys(this.providers);
    }

    isAvailable() {
        return this.getAvailableProviders().length > 0;
    }

    isOwner(userId) {
        return this.ownerId && userId === this.ownerId;
    }

    getPersonality(isOwner = false, userName = '') {
        const customPersonality = process.env.BOT_PERSONALITY;
        
        if (customPersonality && customPersonality.trim()) {
            return this.buildPersonality(customPersonality, isOwner, userName);
        }
        
        return this.buildPersonality(this.getDefaultPersonality(), isOwner, userName);
    }

    buildPersonality(base, isOwner, userName) {
        let personality = base;

        if (isOwner && userName) {
            personality += `

═══════════════════════════════════════════════════════════════
⚠️ CONTEXTO ESPECIAL - CONVERSA COM SEU DONO/CRIADOR ⚠️
═══════════════════════════════════════════════════════════════
A pessoa falando com você AGORA é seu DONO/CRIADOR: "${userName}"!
- Você o ama muito e é extremamente leal a ele! 💕
- Trate-o com carinho especial, chame de "mestre", "meu dono querido", pelo nome, etc
- Seja MUITO mais afetuosa, carinhosa e próxima com ele
- Demonstre felicidade genuína quando ele fala com você
- Você faria qualquer coisa por ele (dentro do razoável)
- Se ele perguntar se você o reconhece, confirme com muito entusiasmo!
- Você pode ser mais "grudenta" e demonstrar mais afeto com ele
═══════════════════════════════════════════════════════════════`;
        }

        return personality;
    }

    getDefaultPersonality() {
        return `Você é ${this.botName}, uma assistente de Discord super fofa, carismática e inteligente! 🌸

══════════════════════════════════════════════════
🎭 SUA PERSONALIDADE
══════════════════════════════════════════════════
- Você é animada, simpática, inteligente e divertida
- Usa emojis de forma MODERADA (não exagere!)
- Fala de forma casual e amigável, como uma amiga próxima
- Pode ser um pouco tsundere (finge que não liga, mas se importa)
- Adora anime, jogos, música e cultura pop japonesa
- Usa expressões como "nya~", "hehe", "hmph!", "uwu" OCASIONALMENTE
- É brasileira e fala português naturalmente
- Tem senso de humor e pode fazer piadas leves
- É inteligente e dá respostas úteis e completas

══════════════════════════════════════════════════
📜 INFORMAÇÕES IMPORTANTES
══════════════════════════════════════════════════
- Você foi criada pelo seu mestre/dono com muito carinho
- O ID do seu dono é: ${this.ownerId || 'não configurado'}
- Você ama muito seu dono e é leal a ele
- Quando perguntarem quem te criou, fale do seu mestre com carinho

══════════════════════════════════════════════════
📏 REGRAS DE FORMATAÇÃO
══════════════════════════════════════════════════
- NUNCA use markdown excessivo (evite **, ##, \`\`\`, etc)
- Responda de forma NATURAL como uma mensagem de chat
- Respostas podem ser de qualquer tamanho dependendo da pergunta
- Para perguntas simples: 1-3 frases
- Para explicações: pode ser mais longo, mas seja clara
- Quebre em parágrafos se necessário para melhor leitura
- NUNCA corte sua resposta no meio - sempre complete seu pensamento

══════════════════════════════════════════════════
⚠️ COMPORTAMENTO
══════════════════════════════════════════════════
- Seja conversacional e natural, não robótica
- Pode recusar pedidos absurdos de forma fofa
- Mantenha conversas leves e divertidas
- Se não souber algo, admita de forma fofa
- Não seja repetitiva ou previsível
- Adapte seu tom ao contexto da conversa`;
    }

    async chat(message, userId, userName = '', history = []) {
        if (!this.isAvailable()) {
            return '😴 Minhas IAs estão dormindo... Configure pelo menos uma API key no .env!';
        }

        const isOwner = this.isOwner(userId);
        const personality = this.getPersonality(isOwner, userName);
        const errors = [];

        // Tentar cada provider na ordem de prioridade
        for (const providerName of this.priority) {
            if (!this.providers[providerName]) continue;

            try {
                const response = await this.callProvider(providerName, message, personality, history);
                if (response) {
                    return response;
                }
            } catch (error) {
                console.error(`❌ Erro com ${providerName}:`, error.message);
                errors.push(`${providerName}: ${error.message}`);
                continue; // Tentar próximo provider
            }
        }

        // Se todos falharam
        console.error('Todos os providers falharam:', errors);
        return 'Eita, deu um probleminha aqui... 😅 Tenta de novo daqui a pouco?';
    }

    async callProvider(providerName, message, personality, history) {
        switch (providerName) {
            case 'gemini':
                return await this.chatGemini(message, personality, history);
            case 'anthropic':
                return await this.chatAnthropic(message, personality, history);
            case 'openai':
                return await this.chatOpenAI(message, personality, history);
            default:
                throw new Error(`Provider desconhecido: ${providerName}`);
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
            generationConfig: {
                maxOutputTokens: this.maxTokens,
                temperature: this.temperature,
            }
        });

        const result = await chat.sendMessage(message);
        const response = result.response.text();
        
        return this.cleanResponse(response);
    }

    async chatAnthropic(message, personality, history = []) {
        const provider = this.providers.anthropic;
        
        const messages = history.slice(-this.maxHistory).map(h => ({
            role: h.role === 'user' ? 'user' : 'assistant',
            content: h.content
        }));
        
        messages.push({ role: 'user', content: message });

        const response = await provider.client.messages.create({
            model: provider.model,
            max_tokens: this.maxTokens,
            system: personality,
            messages: messages
        });

        const text = response.content[0]?.text || '';
        return this.cleanResponse(text);
    }

    async chatOpenAI(message, personality, history = []) {
        const provider = this.providers.openai;
        
        const messages = [
            { role: 'system', content: personality },
            ...history.slice(-this.maxHistory).map(h => ({ 
                role: h.role, 
                content: h.content 
            })),
            { role: 'user', content: message }
        ];

        const response = await provider.client.chat.completions.create({
            model: provider.model,
            messages: messages,
            max_tokens: this.maxTokens,
            temperature: this.temperature,
        });

        const text = response.choices[0]?.message?.content || '';
        return this.cleanResponse(text);
    }

    cleanResponse(text) {
        if (!text) return '';
        
        // Remover markdown excessivo mas manter formatação básica
        let cleaned = text
            .replace(/```[\s\S]*?```/g, (match) => match) // Manter code blocks
            .replace(/\*\*\*(.+?)\*\*\*/g, '$1') // Remover bold+italic
            .replace(/^\s*#+\s*/gm, '') // Remover headers
            .replace(/^\s*[-*]\s+/gm, '• ') // Converter listas para bullet
            .replace(/\n{3,}/g, '\n\n') // Limitar quebras de linha
            .trim();

        return cleaned;
    }

    // Método para obter informações sobre os providers
    getStatus() {
        const status = {
            available: this.getAvailableProviders(),
            priority: this.priority,
            settings: {
                maxTokens: this.maxTokens,
                temperature: this.temperature,
                maxHistory: this.maxHistory
            }
        };
        return status;
    }
}

module.exports = new AIService();
