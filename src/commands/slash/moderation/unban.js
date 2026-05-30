const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('🔓 Desbanir usuário')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addStringOption(opt => opt.setName('userid').setDescription('ID do usuário').setRequired(true)),
    category: 'moderation',
    cooldown: 5,
    guildOnly: true,
    userPermissions: ['BanMembers'],
    botPermissions: ['BanMembers'],
    async execute(interaction) {
        const userId = interaction.options.getString('userid');
        try {
            const ban = await interaction.guild.bans.fetch(userId);
            await interaction.guild.members.unban(userId);
            await interaction.reply({ embeds: [EmbedUtils.success('Usuário Desbanido', `**${ban.user.tag}** foi desbanido!`)] });
        } catch (error) {
            if (error.code === 10026) return interaction.reply({ content: 'Esse usuário não está banido!', ephemeral: true });
            await interaction.reply({ content: 'ID inválido ou erro ao desbanir!', ephemeral: true });
        }
    }
};
