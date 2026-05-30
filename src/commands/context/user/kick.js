const { ContextMenuCommandBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('🦶 Expulsar')
        .setType(ApplicationCommandType.User)
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    userPermissions: ['KickMembers'],
    botPermissions: ['KickMembers'],
    async execute(interaction) {
        const target = interaction.targetUser;
        const member = interaction.guild.members.cache.get(target.id);
        if (!member) return interaction.reply({ content: 'Não está no servidor!', ephemeral: true });
        if (!member.kickable) return interaction.reply({ content: 'Não posso expulsar!', ephemeral: true });
        if (member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ content: 'Cargo muito alto!', ephemeral: true });
        
        const modal = new ModalBuilder().setCustomId(`kick_${target.id}`).setTitle(`Expulsar ${target.tag}`);
        modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('reason').setLabel('Motivo').setStyle(TextInputStyle.Short).setRequired(false).setMaxLength(500)));
        await interaction.showModal(modal);
        
        try {
            const modalInt = await interaction.awaitModalSubmit({ filter: i => i.customId === `kick_${target.id}`, time: 60000 });
            const reason = modalInt.fields.getTextInputValue('reason') || 'Sem motivo';
            try { await target.send({ embeds: [EmbedUtils.moderation('Você foi expulso!', { reason }).setDescription(`De **${interaction.guild.name}**`)] }); } catch {}
            await member.kick(`${reason} | ${interaction.user.tag}`);
            await modalInt.reply({ embeds: [EmbedUtils.moderation('Expulso', { user: target, moderator: interaction.user, reason })] });
        } catch {}
    }
};
