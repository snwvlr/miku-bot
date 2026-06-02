const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('🌐 Traduzir')
        .setType(ApplicationCommandType.Message),
    async execute(interaction) {
        const message = interaction.targetMessage;
        if (!message.content) return interaction.reply({ content: 'Sem texto!', ephemeral: true });

        await interaction.deferReply({ ephemeral: true });

        try {
            // Usando API gratuita de tradução
            const axios = require('axios');
            const response = await axios.get(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(message.content)}&langpair=autodetect|pt`);
            const translated = response.data.responseData.translatedText;

            const embed = EmbedUtils.create({
                title: '🌐 Tradução',
                fields: [
                    { name: 'Original', value: message.content.substring(0, 1000) },
                    { name: 'Traduzido', value: translated.substring(0, 1000) }
                ],
                color: EmbedUtils.colors.info
            });
            await interaction.editReply({ embeds: [embed] });
        } catch {
            await interaction.editReply('Erro ao traduzir!');
        }
    }
};
