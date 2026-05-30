const { ContextMenuCommandBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');
const ms = require('ms');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('🔇 Silenciar')
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    userPermissions: ['ModerateMembers'],
    botPermissions: ['ModerateMembers'],
    async execute(interaction) {
        const target = interaction.targetUser;
        const member = interaction.guild.members.cache.get(target.id);
        if (!member) return interaction.reply({ content: 'Não está no servidor!', ephemeral: true });
        if (!member.moderatable) return interaction.reply({ content: 'Não posso silenciar!', ephemeral: true });
        
        const modal = new ModalBuilder().setCustomId(`timeout_${target.id}`).setTitle(`Silenciar ${target.tag}`);
        modal.addComponents(
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('duration').setLabel('Duração (ex: 10m, 1h, 1d)').setStyle(TextInputStyle.Short).setRequired(true)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('reason').setLabel('Motivo').setStyle(TextInputStyle.Short).setRequired(false))
        );
        await interaction.showModal(modal);
        
        try {
            const modalInt = await interaction.awaitModalSubmit({ filter: i => i.customId === `timeout_${target.id}`, time: 60000 });
            const durationStr = modalInt.fields.getTextInputValue('duration');
            const reason = modalInt.fields.getTextInputValue('reason') || 'Sem motivo';
            let duration;
            try { duration = ms(durationStr); } catch { return modalInt.reply({ content: 'Duração inválida!', ephemeral: true }); }
            if (!duration || duration < 1000 || duration > 28 * 24 * 60 * 60 * 1000) return modalInt.reply({ content: 'Duração inválida (min 1s, max 28d)', ephemeral: true });
            await member.timeout(duration, `${reason} | ${interaction.user.tag}`);
            await modalInt.reply({ embeds: [EmbedUtils.moderation('Silenciado', { user: target, moderator: interaction.user, reason, duration: ms(duration, { long: true }) })] });
        } catch {}
    }
};
