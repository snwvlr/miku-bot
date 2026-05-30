const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('softban')
        .setDescription('🔨 Softban (ban + unban = limpar msgs)')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(opt => opt.setName('usuario').setDescription('Usuário').setRequired(true))
        .addStringOption(opt => opt.setName('motivo').setDescription('Motivo')),
    category: 'moderation',
    cooldown: 5,
    guildOnly: true,
    userPermissions: ['BanMembers'],
    botPermissions: ['BanMembers'],
    async execute(interaction) {
        const target = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('motivo') || 'Softban';
        const member = interaction.guild.members.cache.get(target.id);
        
        if (member && !member.bannable) return interaction.reply({ content: 'Não posso banir esse usuário!', ephemeral: true });
        
        await interaction.guild.members.ban(target, { deleteMessageSeconds: 7 * 86400, reason: `[SOFTBAN] ${reason}` });
        await interaction.guild.members.unban(target.id);
        
        await interaction.reply({ embeds: [EmbedUtils.moderation('Softban', { user: target, moderator: interaction.user, reason })] });
    }
};
