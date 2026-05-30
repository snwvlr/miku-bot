const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');
const nekos = require('../../../services/nekosService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('husbando')
        .setDescription('💕 Ver um husbando aleatório'),
    category: 'fun',
    cooldown: 3,
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const image = await nekos.getImage('husbando');
            const embed = EmbedUtils.anime({
                title: '💕 Husbando',
                image: image.url,
                color: EmbedUtils.colors.info,
                footer: { text: image.artist_name ? '🎨 ' + image.artist_name : 'Husbando' }
            });
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply('Não encontrei um husbando... 😢');
        }
    }
};
