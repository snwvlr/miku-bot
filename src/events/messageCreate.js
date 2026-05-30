const aiService = require('../services/aiService');
const logger = require('../utils/logger');

module.exports = {
    name: 'messageCreate',

    async execute(message, client) {
        // Ignorar bots
        if (message.author.bot) return;

        // Verificar se a IA está disponível
        if (!aiService.isAvailable()) return;

        // Verificar se o bot foi mencionado ou se é resposta
        const mentioned = message.mentions.has(client.user);
        const isReply = message.reference && 
            (await message.channel.messages.fetch(message.reference.messageId).catch(() => null))?.author?.id === client.user.id;

        if (!mentioned && !isReply) return;

        // Obter conteúdo da mensagem (remover menção)
        let content = message.content
            .replace(new RegExp(`<@!?${client.user.id}>`, 'g'), '')
            .trim();

        // Se mencionou sem texto, cumprimentar
        if (!content && mentioned) {
            const greetings = [
                `Oiê ${message.author}! 💕 Chamou?`,
                `Oi oi! ✨ Posso ajudar em algo?`,
                `Yay, ${message.author.username}! 🌸 O que foi?`,
                `Hmm? Me chamou? 👀`,
                `Olá! 💫 Tô aqui~`,
            ];
            const isOwner = aiService.isOwner(message.author.id);
            if (isOwner) {
                const ownerGreetings = [
                    `Mestre! 💕💕💕 Que bom que me chamou!`,
                    `Meu dono querido! ✨ Estava com saudades~`,
                    `Ahh, mestre! 🌸 Tô feliz em te ver!`,
                    `Oii mestre! 💖 No que posso ajudar?`,
                ];
                return message.reply(ownerGreetings[Math.floor(Math.random() * ownerGreetings.length)]);
            }
            return message.reply(greetings[Math.floor(Math.random() * greetings.length)]);
        }

        // Iniciar histórico se não existir
        if (!client.chatHistory) client.chatHistory = new Map();
        
        const historyKey = message.channel.id;
        if (!client.chatHistory.has(historyKey)) {
            client.chatHistory.set(historyKey, []);
        }

        const history = client.chatHistory.get(historyKey);

        try {
            // Mostrar que está digitando
            await message.channel.sendTyping();

            // Manter typing enquanto processa
            const typingInterval = setInterval(() => {
                message.channel.sendTyping().catch(() => {});
            }, 5000);

            // Contexto com nome do usuário
            const userContext = `[${message.author.username}]: ${content}`;

            // Chamar IA
            const response = await aiService.chat(
                userContext, 
                message.author.id, 
                message.author.username, 
                history
            );

            clearInterval(typingInterval);

            if (!response) {
                return message.reply('Hmm, não consegui pensar em nada... 😅');
            }

            // Atualizar histórico
            history.push({ role: 'user', content: userContext });
            history.push({ role: 'assistant', content: response });

            // Limitar histórico
            const maxHistory = parseInt(process.env.MAX_HISTORY) || 30;
            while (history.length > maxHistory) {
                history.shift();
            }

            // Enviar resposta (dividir se muito longa)
            await sendLongMessage(message, response);

        } catch (error) {
            logger.error('Erro na IA:', error);
            
            const errorMessages = [
                'Eita, deu um bug aqui... 😅 Tenta de novo?',
                'Ops, minha cabeça travou! 🤯 Fala de novo?',
                'Aaah, algo deu errado... 😓',
                'Hmm, não consegui processar... tenta mais uma vez? 🙏',
            ];
            
            await message.reply(errorMessages[Math.floor(Math.random() * errorMessages.length)]).catch(() => {});
        }
    }
};

// Função para enviar mensagens longas
async function sendLongMessage(message, content) {
    const maxLength = 1900; // Margem de segurança

    if (content.length <= maxLength) {
        return message.reply(content);
    }

    // Dividir a mensagem em partes
    const parts = [];
    let remaining = content;

    while (remaining.length > 0) {
        if (remaining.length <= maxLength) {
            parts.push(remaining);
            break;
        }

        // Tentar quebrar em um ponto natural
        let breakPoint = maxLength;
        
        // Procurar quebra de parágrafo
        const paragraphBreak = remaining.lastIndexOf('\n\n', maxLength);
        if (paragraphBreak > maxLength * 0.5) {
            breakPoint = paragraphBreak;
        } else {
            // Procurar quebra de linha
            const lineBreak = remaining.lastIndexOf('\n', maxLength);
            if (lineBreak > maxLength * 0.5) {
                breakPoint = lineBreak;
            } else {
                // Procurar espaço
                const spaceBreak = remaining.lastIndexOf(' ', maxLength);
                if (spaceBreak > maxLength * 0.5) {
                    breakPoint = spaceBreak;
                }
            }
        }

        parts.push(remaining.substring(0, breakPoint));
        remaining = remaining.substring(breakPoint).trim();
    }

    // Enviar primeira parte como reply
    await message.reply(parts[0]);

    // Enviar partes restantes como mensagens normais
    for (let i = 1; i < parts.length; i++) {
        await message.channel.send(parts[i]);
    }
}
