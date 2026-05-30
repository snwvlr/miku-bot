const { ContextMenuCommandBuilder, ApplicationCommandType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('🗑️ Deletar')
        .setType(ApplicationCommandType.Message)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    userPermissions: ['ManageMessages'],
    botPermissions: ['ManageMessages'],
    async execute(interaction) {
        const message = interaction.targetMessage;
        try {
            await message.delete();
            await interaction.reply({ content: '🗑️ Mensagem deletada!', ephemeral: true });
        } catch {
            await interaction.reply({ content: 'Não consegui deletar!', ephemeral: true });
        }
    }
};
