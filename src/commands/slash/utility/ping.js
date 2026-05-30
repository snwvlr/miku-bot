const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('🏓 Ver latência'),
    category: 'utility',
    cooldown: 5,
    async execute(interaction, client) {
        const sent = await interaction.reply({ content: '🏓 Calculando...', fetchReply: true });
        const latency = sent.createdTimestamp - interaction.createdTimestamp;
        const wsLatency = client.ws.ping;
        
        let status = '🟢 Excelente';
        let color = EmbedUtils.colors.success;
        if (latency > 200 || wsLatency > 200) { status = '🟡 Normal'; color = EmbedUtils.colors.warning; }
        if (latency > 500 || wsLatency > 500) { status = '🔴 Lento'; color = EmbedUtils.colors.error; }
        
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        
        const embed = EmbedUtils.create({
            title: '🏓 Pong!',
            color,
            fields: [
                { name: '📡 Latência', value: `${latency}ms`, inline: true },
                { name: '💓 WebSocket', value: `${wsLatency}ms`, inline: true },
                { name: '📊 Status', value: status, inline: true },
                { name: '⏱️ Uptime', value: `${days}d ${hours}h ${minutes}m`, inline: true },
            ],
            timestamp: true
        });
        await interaction.editReply({ content: null, embeds: [embed] });
    }
};
