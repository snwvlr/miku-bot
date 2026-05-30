const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('⚠️ Avisar membro')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .addUserOption(opt => opt.setName('usuario').setDescription('Usuário').setRequired(true))
        .addStringOption(opt => opt.setName('motivo').setDescription('Motivo').setRequired(true).setMaxLength(500)),
    category: 'moderation',
    cooldown: 3,
    guildOnly: true,
    userPermissions: ['ModerateMembers'],
    async execute(interaction) {
        const target = interaction.options.getUser('usuario');
        const reason = interaction.options.getString('motivo');
        const member = interaction.guild.members.cache.get(target.id);
        if (!member) return interaction.reply({ content: 'Usuário não está no servidor!', ephemeral: true });
        if (target.bot) return interaction.reply({ content: 'Não pode avisar bots!', ephemeral: true });
        
        let dmSent = false;
        try { await target.send({ embeds: [EmbedUtils.warning('Você recebeu um aviso!', `Servidor: **${interaction.guild.name}**\n\n**Motivo:** ${reason}`)] }); dmSent = true; } catch {}
        
        const embed = EmbedUtils.moderation('Aviso Aplicado', { user: target, moderator: interaction.user, reason });
        if (!dmSent) embed.addFields({ name: '📬 DM', value: 'Não enviada', inline: true });
        await interaction.reply({ embeds: [embed] });
    }
};
