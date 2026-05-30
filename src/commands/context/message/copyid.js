const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('🆔 Copiar IDs')
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {
        const message = interaction.targetMessage;
        const embed = EmbedUtils.create({
            title: '🆔 IDs',
            color: EmbedUtils.colors.info,
            fields: [
                { name: 'Mensagem', value: `\`${message.id}\``, inline: true },
                { name: 'Autor', value: `\`${message.author.id}\``, inline: true },
                { name: 'Canal', value: `\`${message.channel.id}\``, inline: true },
            ]
        });
        if (interaction.guild) embed.addFields({ name: 'Servidor', value: `\`${interaction.guild.id}\``, inline: true });
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
