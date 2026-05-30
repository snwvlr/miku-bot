const { ContextMenuCommandBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('🔨 Banir')
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    userPermissions: ['BanMembers'],
    botPermissions: ['BanMembers'],
    async execute(interaction) {
        const target = interaction.targetUser;
        const member = interaction.guild.members.cache.get(target.id);
        if (member) {
            if (!member.bannable) return interaction.reply({ content: 'Não posso banir!', ephemeral: true });
            if (member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ content: 'Cargo muito alto!', ephemeral: true });
        }
        
        const modal = new ModalBuilder().setCustomId(`ban_${target.id}`).setTitle(`Banir ${target.tag}`);
        modal.addComponents(
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('reason').setLabel('Motivo').setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(500)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('days').setLabel('Deletar msgs (dias 0-7)').setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(1).setPlaceholder('0'))
        );
        await interaction.showModal(modal);
        
        try {
            const modalInt = await interaction.awaitModalSubmit({ filter: i => i.customId === `ban_${target.id}`, time: 60000 });
            const reason = modalInt.fields.getTextInputValue('reason') || 'Sem motivo';
            let days = parseInt(modalInt.fields.getTextInputValue('days')) || 0;
            days = Math.min(Math.max(days, 0), 7);
            try { await target.send({ embeds: [EmbedUtils.moderation('Você foi banido!', { reason }).setDescription(`De **${interaction.guild.name}**`)] }); } catch {}
            await interaction.guild.members.ban(target, { deleteMessageSeconds: days * 86400, reason: `${reason} | ${interaction.user.tag}` });
            await modalInt.reply({ embeds: [EmbedUtils.moderation('Banido', { user: target, moderator: interaction.user, reason })] });
        } catch {}
    }
};
