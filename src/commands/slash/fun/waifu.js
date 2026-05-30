const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');
const nekos = require('../../../services/nekosService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('💕 Ver uma waifu aleatória'),
    category: 'fun',
    cooldown: 3,
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const image = await nekos.getImage('waifu');
            const embed = EmbedUtils.anime({
                title: '💕 Waifu',
                image: image.url,
                color: EmbedUtils.colors.waifu,
                footer: { text: image.artist_name ? '🎨 ' + image.artist_name : 'Waifu' }
            });
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply('Não encontrei uma waifu... 😢');
        }
    }
};
