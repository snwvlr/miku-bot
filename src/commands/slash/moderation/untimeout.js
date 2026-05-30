const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('🔊 Remover silenciamento')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(opt => opt.setName('usuario').setDescription('Usuário').setRequired(true)),
    category: 'moderation',
    cooldown: 5,
    guildOnly: true,
    userPermissions: ['ModerateMembers'],
    botPermissions: ['ModerateMembers'],
    async execute(interaction) {
        const target = interaction.options.getUser('usuario');
        const member = interaction.guild.members.cache.get(target.id);
        if (!member) return interaction.reply({ content: 'Usuário não está no servidor!', ephemeral: true });
        if (!member.isCommunicationDisabled()) return interaction.reply({ content: 'Usuário não está silenciado!', ephemeral: true });
        await member.timeout(null);
        await interaction.reply({ embeds: [EmbedUtils.success('Silenciamento Removido', `**${target.tag}** pode falar novamente!`)] });
    }
};
