const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');
const nekos = require('../../../services/nekosService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nom')
        .setDescription('😋 Nom nom alguém')
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
            const gif = await nekos.getGif('nom');
            const messages = ["fez nom nom em","mordiscou","nhom nhom em"];
            const msg = messages[Math.floor(Math.random() * messages.length)];

            const embed = EmbedUtils.interaction({
                description: `**${author.username}** ${msg} **${target.username}**! 😋`,
                gif: gif.url,
                color: EmbedUtils.colors.happy,
                footer: { text: `😋 Nom • ${gif.anime_name || 'Anime'}` }
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Não consegui fazer isso... 😅', ephemeral: true });
        }
    }
};
