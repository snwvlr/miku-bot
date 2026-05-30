const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

class EmbedUtils {
    constructor() {
        // Cores padrão
        this.colors = {
            primary: 0x5865F2,      // Discord Blurple
            success: 0x57F287,      // Verde
            error: 0xED4245,        // Vermelho
            warning: 0xFEE75C,      // Amarelo
            info: 0x5865F2,         // Azul
            
            // Cores especiais
            love: 0xFF6B9D,         // Rosa amor
            happy: 0xFFD93D,        // Amarelo feliz
            sad: 0x5865F2,          // Azul triste
            angry: 0xED4245,        // Vermelho raiva
            kawaii: 0xFF9FF3,       // Rosa kawaii
            neko: 0xFECA57,         // Laranja neko
            waifu: 0xF8B500,        // Dourado waifu
            purple: 0x9B59B6,       // Roxo
            teal: 0x1ABC9C,         // Verde água
            orange: 0xE67E22,       // Laranja
            pink: 0xFD79A8,         // Rosa
            cyan: 0x00CED1,         // Ciano
            gold: 0xFFD700,         // Dourado
            silver: 0xC0C0C0,       // Prata
            bronze: 0xCD7F32,       // Bronze
        };
    }

    create(options = {}) {
        const embed = new EmbedBuilder();

        if (options.title) embed.setTitle(options.title);
        if (options.description) embed.setDescription(options.description);
        if (options.color) embed.setColor(options.color);
        if (options.url) embed.setURL(options.url);
        if (options.timestamp) embed.setTimestamp();
        if (options.thumbnail) embed.setThumbnail(options.thumbnail.url || options.thumbnail);
        if (options.image) embed.setImage(options.image.url || options.image);
        if (options.footer) {
            embed.setFooter({
                text: options.footer.text || options.footer,
                iconURL: options.footer.iconURL
            });
        }
        if (options.author) {
            embed.setAuthor({
                name: options.author.name,
                iconURL: options.author.iconURL,
                url: options.author.url
            });
        }
        if (options.fields && Array.isArray(options.fields)) {
            embed.addFields(options.fields);
        }

        return embed;
    }

    // Embeds pré-definidos
    success(title, description) {
        return this.create({
            title: `✅ ${title}`,
            description,
            color: this.colors.success,
            timestamp: true
        });
    }

    error(title, description) {
        return this.create({
            title: `❌ ${title}`,
            description,
            color: this.colors.error,
            timestamp: true
        });
    }

    warning(title, description) {
        return this.create({
            title: `⚠️ ${title}`,
            description,
            color: this.colors.warning,
            timestamp: true
        });
    }

    info(title, description) {
        return this.create({
            title: `ℹ️ ${title}`,
            description,
            color: this.colors.info,
            timestamp: true
        });
    }

    loading(message = 'Carregando...') {
        return this.create({
            description: `⏳ ${message}`,
            color: this.colors.info
        });
    }

    // Embed de interação (hug, kiss, etc)
    interaction(options = {}) {
        const embed = this.create({
            description: options.description,
            color: options.color || this.colors.kawaii,
            image: options.gif,
            timestamp: true
        });

        if (options.footer) {
            embed.setFooter({ text: options.footer.text || options.footer });
        }

        return embed;
    }

    // Embed de anime (waifu, neko, etc)
    anime(options = {}) {
        return this.create({
            title: options.title,
            color: options.color || this.colors.waifu,
            image: options.image,
            footer: options.footer,
            timestamp: true
        });
    }

    // Embed de moderação
    moderation(title, options = {}) {
        const embed = this.create({
            title: `🛡️ ${title}`,
            color: this.colors.error,
            timestamp: true
        });

        const fields = [];

        if (options.user) {
            fields.push({
                name: '👤 Usuário',
                value: `${options.user.tag || options.user}\n\`${options.user.id || 'N/A'}\``,
                inline: true
            });
        }

        if (options.moderator) {
            fields.push({
                name: '🛡️ Moderador',
                value: `${options.moderator.tag || options.moderator}`,
                inline: true
            });
        }

        if (options.reason) {
            fields.push({
                name: '📝 Motivo',
                value: options.reason,
                inline: false
            });
        }

        if (options.duration) {
            fields.push({
                name: '⏱️ Duração',
                value: options.duration,
                inline: true
            });
        }

        if (fields.length > 0) {
            embed.addFields(fields);
        }

        return embed;
    }

    // Embed de perfil/userinfo
    profile(user, member = null) {
        const embed = this.create({
            title: `👤 ${user.tag}`,
            color: member?.displayColor || this.colors.primary,
            thumbnail: user.displayAvatarURL({ dynamic: true, size: 256 }),
            timestamp: true
        });

        return embed;
    }

    // Criar botões de link
    linkButton(label, url, emoji = null) {
        const button = new ButtonBuilder()
            .setLabel(label)
            .setStyle(ButtonStyle.Link)
            .setURL(url);

        if (emoji) button.setEmoji(emoji);
        return button;
    }

    // Criar row de botões
    createButtonRow(...buttons) {
        return new ActionRowBuilder().addComponents(...buttons);
    }

    // Paginação simples
    paginate(items, page = 1, perPage = 10) {
        const totalPages = Math.ceil(items.length / perPage);
        const start = (page - 1) * perPage;
        const end = start + perPage;
        
        return {
            items: items.slice(start, end),
            page,
            totalPages,
            total: items.length,
            hasNext: page < totalPages,
            hasPrev: page > 1
        };
    }

    // Formatar número
    formatNumber(num) {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    }

    // Barra de progresso
    progressBar(current, max, length = 10, filled = '█', empty = '░') {
        const percentage = Math.min(current / max, 1);
        const filledLength = Math.round(length * percentage);
        const emptyLength = length - filledLength;
        return filled.repeat(filledLength) + empty.repeat(emptyLength);
    }

    // Truncar texto
    truncate(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }
}

module.exports = new EmbedUtils();
