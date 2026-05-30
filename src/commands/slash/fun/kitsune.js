const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');
const nekos = require('../../../services/nekosService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kitsune')
        .setDescription('🦊 Ver uma kitsune aleatória'),
    category: 'fun',
    cooldown: 3,
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const image = await nekos.getImage('kitsune');
            const embed = EmbedUtils.anime({
                title: '🦊 Kitsune',
                image: image.url,
                color: EmbedUtils.colors.orange,
                footer: { text: image.artist_name ? '🎨 ' + image.artist_name : 'Kitsune' }
            });
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply('Não encontrei uma kitsune... 😢');
        }
    }
};
