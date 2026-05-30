const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('🔒 Bloquear canal')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(opt => opt.setName('canal').setDescription('Canal'))
        .addStringOption(opt => opt.setName('motivo').setDescription('Motivo')),
    category: 'moderation',
    cooldown: 5,
    guildOnly: true,
    userPermissions: ['ManageChannels'],
    botPermissions: ['ManageChannels'],
    async execute(interaction) {
        const channel = interaction.options.getChannel('canal') || interaction.channel;
        const reason = interaction.options.getString('motivo') || 'Sem motivo';
        try {
            await channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false });
            await interaction.reply({ embeds: [EmbedUtils.create({ title: '🔒 Canal Bloqueado', description: `${channel} foi bloqueado`, color: EmbedUtils.colors.error, fields: [{ name: 'Motivo', value: reason }] })] });
        } catch { await interaction.reply({ content: 'Erro ao bloquear!', ephemeral: true }); }
    }
};
