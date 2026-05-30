const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('🔓 Desbloquear canal')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(opt => opt.setName('canal').setDescription('Canal')),
    category: 'moderation',
    cooldown: 5,
    guildOnly: true,
    userPermissions: ['ManageChannels'],
    botPermissions: ['ManageChannels'],
    async execute(interaction) {
        const channel = interaction.options.getChannel('canal') || interaction.channel;
        try {
            await channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: null });
            await interaction.reply({ embeds: [EmbedUtils.success('Canal Desbloqueado', `${channel} foi desbloqueado!`)] });
        } catch { await interaction.reply({ content: 'Erro ao desbloquear!', ephemeral: true }); }
    }
};
