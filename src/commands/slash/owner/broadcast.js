const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('broadcast')
        .setDescription('📢 Enviar mensagem para todos os servidores')
        .addStringOption(opt => opt.setName('mensagem').setDescription('Mensagem').setRequired(true)),
    category: 'owner',
    cooldown: 60,
    ownerOnly: true,
    async execute(interaction, client) {
        const message = interaction.options.getString('mensagem');
        await interaction.deferReply({ ephemeral: true });
        
        let sent = 0;
        let failed = 0;
        
        for (const guild of client.guilds.cache.values()) {
            try {
                const channel = guild.channels.cache.find(c => c.type === 0 && c.permissionsFor(guild.members.me).has(['SendMessages', 'ViewChannel']));
                if (channel) {
                    await channel.send({ embeds: [EmbedUtils.create({
                        title: '📢 Anúncio',
                        description: message,
                        color: EmbedUtils.colors.info,
                        footer: { text: `De: ${interaction.user.tag}` },
                        timestamp: true
                    })] });
                    sent++;
                } else failed++;
            } catch { failed++; }
        }
        
        await interaction.editReply({ content: `📢 Enviado para **${sent}** servidores (${failed} falharam)` });
    }
};
