const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');
const nekos = require('../../../services/nekosService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sleep')
        .setDescription('😴 Dormir'),

    category: 'interaction',
    cooldown: 5,

    async execute(interaction) {
        const author = interaction.user;


        try {
            const gif = await nekos.getGif('sleep');
            const soloMessages = ["foi dormir... zzZ","está dormindo...","pegou no sono..."];
            const msg = soloMessages[Math.floor(Math.random() * soloMessages.length)];
            const description = `**${author.username}** ${msg} 😴`;

            const embed = EmbedUtils.interaction({
                description,
                gif: gif.url,
                color: EmbedUtils.colors.purple,
                footer: { text: `😴 Sleep • ${gif.anime_name || 'Anime'}` }
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Não consegui fazer isso... 😅', ephemeral: true });
        }
    }
};
