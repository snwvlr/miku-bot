const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('🔨 Banir usuário')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(opt => opt.setName('usuario').setDescription('Usuário').setRequired(true))
        .addStringOption(opt => opt.setName('motivo').setDescription('Motivo').setMaxLength(500))
        .addIntegerOption(opt => opt.setName('deletar').setDescription('Deletar mensagens (dias)').setMinValue(0).setMaxValue(7)),
    category: 'moderation',
    cooldown: 5,
    guildOnly: true,
    userPermissions: ['BanMembers'],
    botPermissions: ['BanMembers'],
    async execute(interaction) {
        const target = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('motivo') || 'Sem motivo';
        const days = interaction.options.getInteger('deletar') || 0;
        const member = interaction.guild.members.cache.get(target.id);
        
        if (target.id === interaction.user.id) return interaction.reply({ content: 'Você não pode se banir!', ephemeral: true });
        if (member) {
            if (!member.bannable) return interaction.reply({ content: 'Não posso banir esse usuário!', ephemeral: true });
            if (member.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
                return interaction.reply({ content: 'Você não pode banir alguém com cargo igual ou superior!', ephemeral: true });
            }
        }
        
        try { await target.send({ embeds: [EmbedUtils.moderation('Você foi banido!', { reason }).setDescription(`Você foi banido de **${interaction.guild.name}**`)] }); } catch {}
        await interaction.guild.members.ban(target, { deleteMessageSeconds: days * 86400, reason: `${reason} | Por: ${interaction.user.tag}` });
        await interaction.reply({ embeds: [EmbedUtils.moderation('Usuário Banido', { user: target, moderator: interaction.user, reason })] });
    }
};
