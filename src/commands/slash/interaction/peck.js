const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');
const nekos = require('../../../services/nekosService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('peck')
        .setDescription('😘 Dar um selinho alguém')
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
            const gif = await nekos.getGif('peck');
            const messages = ["deu um selinho em","beijou rapidinho","fez um muac em"];
            const msg = messages[Math.floor(Math.random() * messages.length)];

            const embed = EmbedUtils.interaction({
                description: `**${author.username}** ${msg} **${target.username}**! 😘`,
                gif: gif.url,
                color: EmbedUtils.colors.love,
                footer: { text: `😘 Peck • ${gif.anime_name || 'Anime'}` }
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Não consegui fazer isso... 😅', ephemeral: true });
        }
    }
};
