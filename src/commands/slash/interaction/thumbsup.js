const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');
const nekos = require('../../../services/nekosService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('thumbsup')
        .setDescription('👍 Joinha'),

    category: 'interaction',
    cooldown: 5,

    async execute(interaction) {
        const author = interaction.user;


        try {
            const gif = await nekos.getGif('thumbsup');
            const soloMessages = ["deu um joinha!","aprovou!","👍"];
            const msg = soloMessages[Math.floor(Math.random() * soloMessages.length)];
            const description = `**${author.username}** ${msg} 👍`;

            const embed = EmbedUtils.interaction({
                description,
                gif: gif.url,
                color: EmbedUtils.colors.success,
                footer: { text: `👍 Thumbsup • ${gif.anime_name || 'Anime'}` }
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Não consegui fazer isso... 😅', ephemeral: true });
        }
    }
};
