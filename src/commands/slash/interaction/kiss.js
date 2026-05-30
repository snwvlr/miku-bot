const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');
const nekos = require('../../../services/nekosService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('💋 Beijar alguém')
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
            const gif = await nekos.getGif('kiss');
            const messages = ["deu um beijinho em","beijou","deu um beijo carinhoso em"];
            const msg = messages[Math.floor(Math.random() * messages.length)];

            const embed = EmbedUtils.interaction({
                description: `**${author.username}** ${msg} **${target.username}**! 💋`,
                gif: gif.url,
                color: EmbedUtils.colors.love,
                footer: { text: `💋 Kiss • ${gif.anime_name || 'Anime'}` }
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Não consegui fazer isso... 😅', ephemeral: true });
        }
    }
};
