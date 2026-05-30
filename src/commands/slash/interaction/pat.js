const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');
const nekos = require('../../../services/nekosService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pat')
        .setDescription('🥰 Fazer carinho na cabeça alguém')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Quem?')
                .setRequired(true)),

    category: 'interaction',
    cooldown: 5,

    async execute(interaction) {
        const target = interaction.options.getUser('usuario');
        const author = interaction.user;

        try {
            const gif = await nekos.getGif('pat');
            const messages = ["fez carinho na cabeça de","acariciou","deu um pat pat em"];
            const msg = messages[Math.floor(Math.random() * messages.length)];

            const embed = EmbedUtils.interaction({
                description: `**${author.username}** ${msg} **${target.username}**! 🥰`,
                gif: gif.url,
                color: EmbedUtils.colors.kawaii,
                footer: { text: `🥰 Pat • ${gif.anime_name || 'Anime'}` }
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Não consegui fazer isso... 😅', ephemeral: true });
        }
    }
};
