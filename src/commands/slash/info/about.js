const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');
const aiService = require('../../../services/aiService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('about')
        .setDescription('ℹ️ Sobre o bot'),
    category: 'info',
    cooldown: 5,
    async execute(interaction, client) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        const memUsage = process.memoryUsage();
        const memUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
        
        const aiStatus = aiService.getAvailableProviders();
        
        const embed = EmbedUtils.create({
            title: `✨ ${client.user.username}`,
            description: `Olá! Eu sou a **${process.env.BOT_NAME || client.user.username}**, sua assistente fofa de Discord! 💕\n\nMe mencione para conversar comigo!`,
            color: EmbedUtils.colors.kawaii,
            thumbnail: client.user.displayAvatarURL({ dynamic: true, size: 256 }),
            fields: [
                { name: '🏠 Servidores', value: `${client.guilds.cache.size}`, inline: true },
                { name: '👥 Usuários', value: `${client.users.cache.size}`, inline: true },
                { name: '⌨️ Comandos', value: `${client.commands.size}`, inline: true },
                { name: '⏱️ Uptime', value: `${days}d ${hours}h ${minutes}m`, inline: true },
                { name: '💾 RAM', value: `${memUsedMB} MB`, inline: true },
                { name: '📡 Ping', value: `${client.ws.ping}ms`, inline: true },
                { name: '🤖 IAs', value: aiStatus.length > 0 ? aiStatus.join(', ') : 'Nenhuma', inline: true },
                { name: '📦 Discord.js', value: require('discord.js').version, inline: true },
                { name: '🟢 Node.js', value: process.version, inline: true },
            ],
            footer: { text: 'Feito com 💕' },
            timestamp: true
        });
        
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('Me Adicione!').setStyle(ButtonStyle.Link).setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`).setEmoji('🤖')
        );
        
        await interaction.reply({ embeds: [embed], components: [buttons] });
    }
};
