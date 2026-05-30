const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('🔇 Silenciar membro')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(opt => opt.setName('usuario').setDescription('Usuário').setRequired(true))
        .addStringOption(opt => opt.setName('duracao').setDescription('Duração (ex: 10m, 1h, 1d)').setRequired(true))
        .addStringOption(opt => opt.setName('motivo').setDescription('Motivo')),
    category: 'moderation',
    cooldown: 5,
    guildOnly: true,
    userPermissions: ['ModerateMembers'],
    botPermissions: ['ModerateMembers'],
    async execute(interaction) {
        const target = interaction.options.getUser('usuario');
        const durationStr = interaction.options.getString('duracao');
        const reason = interaction.options.getString('motivo') || 'Sem motivo';
        const member = interaction.guild.members.cache.get(target.id);
        
        if (!member) return interaction.reply({ content: 'Usuário não está no servidor!', ephemeral: true });
        if (!member.moderatable) return interaction.reply({ content: 'Não posso silenciar esse usuário!', ephemeral: true });
        if (member.roles.highest.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
            return interaction.reply({ content: 'Você não pode silenciar alguém com cargo igual ou superior!', ephemeral: true });
        }
        
        let duration;
        try { duration = ms(durationStr); } catch { return interaction.reply({ content: 'Duração inválida!', ephemeral: true }); }
        if (!duration || duration < 1000) return interaction.reply({ content: 'Duração muito curta!', ephemeral: true });
        if (duration > 28 * 24 * 60 * 60 * 1000) return interaction.reply({ content: 'Máximo: 28 dias', ephemeral: true });
        
        try { await target.send({ embeds: [EmbedUtils.moderation('Você foi silenciado!', { reason, duration: ms(duration, { long: true }) }).setDescription(`Você foi silenciado em **${interaction.guild.name}**`)] }); } catch {}
        await member.timeout(duration, `${reason} | Por: ${interaction.user.tag}`);
        await interaction.reply({ embeds: [EmbedUtils.moderation('Usuário Silenciado', { user: target, moderator: interaction.user, reason, duration: ms(duration, { long: true }) })] });
    }
};
