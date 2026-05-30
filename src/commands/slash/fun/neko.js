const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');
const nekos = require('../../../services/nekosService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('neko')
        .setDescription('🐱 Ver uma neko aleatória'),
    category: 'fun',
    cooldown: 3,
    async execute(interaction) {
        await interaction.deferReply();
        try {
            const image = await nekos.getImage('neko');
            const embed = EmbedUtils.anime({
                title: '🐱 Neko',
                image: image.url,
                color: EmbedUtils.colors.neko,
                footer: { text: image.artist_name ? '🎨 ' + image.artist_name : 'Neko' }
            });
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            await interaction.editReply('Não encontrei uma neko... 😢');
        }
    }
};
