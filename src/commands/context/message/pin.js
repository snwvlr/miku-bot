const { ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('📌 Fixar/Desafixar')
        .setType(ApplicationCommandType.Message)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    userPermissions: ['ManageMessages'],
    botPermissions: ['ManageMessages'],
    async execute(interaction) {
        const message = interaction.targetMessage;
        try {
            if (message.pinned) {
                await message.unpin();
                await interaction.reply({ content: '📌 Desafixada!', ephemeral: true });
            } else {
                await message.pin();
                await interaction.reply({ content: '📌 Fixada!', ephemeral: true });
            }
        } catch (e) {
            if (e.code === 30003) return interaction.reply({ content: 'Limite de 50 fixadas!', ephemeral: true });
            await interaction.reply({ content: 'Erro!', ephemeral: true });
        }
    }
};
