const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');
const nekos = require('../../../services/nekosService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tickle')
        .setDescription('🤭 Fazer cócegas alguém')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Quem?')
                .setRequired(true)),

    category: 'interaction',
    cooldown: 5,

    async execute(interaction) {
        const target = interaction.options.getUser('usuario');
        const author = interaction.user;

        if (target.id === author.id) {
            return interaction.reply({ content: 'Você não pode fazer isso em si mesmo! 😅', ephemeral: true });
        }

        try {
            const gif = await nekos.getGif('tickle');
            const messages = ["fez cócegas em","atacou com cócegas","não parou de fazer cócegas em"];
            const msg = messages[Math.floor(Math.random() * messages.length)];

            const embed = EmbedUtils.interaction({
                description: `**${author.username}** ${msg} **${target.username}**! 🤭`,
                gif: gif.url,
                color: EmbedUtils.colors.happy,
                footer: { text: `🤭 Tickle • ${gif.anime_name || 'Anime'}` }
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Não consegui fazer isso... 😅', ephemeral: true });
        }
    }
};
