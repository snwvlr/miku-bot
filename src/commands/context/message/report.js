const { ContextMenuCommandBuilder, ApplicationCommandType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('🚨 Reportar')
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {
        const message = interaction.targetMessage;
        if (message.author.id === interaction.user.id) return interaction.reply({ content: 'Não pode reportar você mesmo!', ephemeral: true });
        
        const modal = new ModalBuilder().setCustomId(`report_${message.id}`).setTitle('Reportar Mensagem');
        modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('reason').setLabel('Motivo').setStyle(TextInputStyle.Paragraph).setRequired(true).setMaxLength(1000)));
        await interaction.showModal(modal);
        
        try {
            const modalInt = await interaction.awaitModalSubmit({ filter: i => i.customId === `report_${message.id}`, time: 120000 });
            const reason = modalInt.fields.getTextInputValue('reason');
            
            const embed = EmbedUtils.create({
                title: '🚨 Report',
                color: EmbedUtils.colors.error,
                fields: [
                    { name: 'Por', value: `${interaction.user.tag}`, inline: true },
                    { name: 'Autor', value: `${message.author.tag}`, inline: true },
                    { name: 'Canal', value: `${interaction.channel}`, inline: true },
                    { name: 'Motivo', value: reason },
                    { name: 'Conteúdo', value: (message.content || '*vazio*').substring(0, 1000) },
                    { name: 'Link', value: `[Ir](${message.url})` },
                ],
                timestamp: true
            });
            
            const logChannel = interaction.guild.channels.cache.find(c => c.name.includes('log') || c.name.includes('report'));
            if (logChannel) {
                await logChannel.send({ embeds: [embed] });
                await modalInt.reply({ content: '✅ Reportado!', ephemeral: true });
            } else {
                try {
                    const owner = await interaction.guild.fetchOwner();
                    await owner.send({ embeds: [embed] });
                    await modalInt.reply({ content: '✅ Enviado ao dono!', ephemeral: true });
                } catch {
                    await modalInt.reply({ content: '⚠️ Sem canal de logs!', ephemeral: true });
                }
            }
        } catch {}
    }
};
