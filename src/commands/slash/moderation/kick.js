const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('🦶 Expulsar membro')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
        .addUserOption(opt => opt.setName('usuario').setDescription('Usuário').setRequired(true))
        .addStringOption(opt => opt.setName('motivo').setDescription('Motivo').setMaxLength(500)),
    category: 'moderation',
    cooldown: 5,
    guildOnly: true,
    userPermissions: ['KickMembers'],
    botPermissions: ['KickMembers'],
    async execute(interaction) {
        const target = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('motivo') || 'Sem motivo';
        const member = interaction.guild.members.cache.get(target.id);
        
        if (!member) return interaction.reply({ content: 'Usuário não está no servidor!', ephemeral: true });
        if (!member.kickable) return interaction.reply({ content: 'Não posso expulsar esse usuário!', ephemeral: true });
        if (member.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
            return interaction.reply({ content: 'Você não pode expulsar alguém com cargo igual ou superior!', ephemeral: true });
        }
        
        try { await target.send({ embeds: [EmbedUtils.moderation('Você foi expulso!', { reason }).setDescription(`Você foi expulso de **${interaction.guild.name}**`)] }); } catch {}
        await member.kick(`${reason} | Por: ${interaction.user.tag}`);
        await interaction.reply({ embeds: [EmbedUtils.moderation('Usuário Expulso', { user: target, moderator: interaction.user, reason })] });
    }
};
