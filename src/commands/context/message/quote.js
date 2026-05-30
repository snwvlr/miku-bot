const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('💬 Citar')
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {
        const message = interaction.targetMessage;
        if (!message.content && message.attachments.size === 0) return interaction.reply({ content: 'Mensagem vazia!', ephemeral: true });
        
        const embed = EmbedUtils.create({
            author: { name: message.author.tag, iconURL: message.author.displayAvatarURL({ dynamic: true }) },
            description: message.content || '*Sem texto*',
            color: EmbedUtils.colors.info,
            timestamp: message.createdAt,
            footer: { text: `Em #${message.channel.name}` }
        });
        if (message.attachments.size > 0) {
            const img = message.attachments.find(a => a.contentType?.startsWith('image/'));
            if (img) embed.setImage(img.url);
        }
        embed.addFields({ name: '🔗', value: `[Original](${message.url})` });
        await interaction.reply({ content: `${interaction.user} citou:`, embeds: [embed] });
    }
};
