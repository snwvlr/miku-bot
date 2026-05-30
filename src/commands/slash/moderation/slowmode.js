const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('🐌 Modo lento')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addIntegerOption(opt => opt.setName('segundos').setDescription('Segundos (0=desativar)').setRequired(true).setMinValue(0).setMaxValue(21600)),
    category: 'moderation',
    cooldown: 5,
    guildOnly: true,
    userPermissions: ['ManageChannels'],
    botPermissions: ['ManageChannels'],
    async execute(interaction) {
        const seconds = interaction.options.getInteger('segundos');
        await interaction.channel.setRateLimitPerUser(seconds);
        if (seconds === 0) {
            await interaction.reply({ embeds: [EmbedUtils.success('Slowmode Desativado', 'Modo lento foi desativado.')] });
        } else {
            const time = seconds >= 3600 ? `${seconds/3600}h` : seconds >= 60 ? `${seconds/60}m` : `${seconds}s`;
            await interaction.reply({ embeds: [EmbedUtils.success('Slowmode Ativado', `Intervalo: **${time}**`)] });
        }
    }
};
