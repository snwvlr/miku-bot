const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');
const nekos = require('../../../services/nekosService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wave')
        .setDescription('👋 Acenar')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Com quem? (opcional)')
                .setRequired(false)),

    category: 'interaction',
    cooldown: 5,

    async execute(interaction) {
        const author = interaction.user;
        const target = interaction.options.getUser('usuario');

        try {
            const gif = await nekos.getGif('wave');
            const soloMessages = ["está acenando!","acenou!","deu tchau!"];
            const targetMessages = ["acenou para","deu oi para","cumprimentou"];
            
            let description;
            if (target && target.id !== author.id) {
                const msg = targetMessages[Math.floor(Math.random() * targetMessages.length)];
                description = `**${author.username}** ${msg} **${target.username}**! 👋`;
            } else {
                const msg = soloMessages[Math.floor(Math.random() * soloMessages.length)];
                description = `**${author.username}** ${msg} 👋`;
            }

            const embed = EmbedUtils.interaction({
                description,
                gif: gif.url,
                color: EmbedUtils.colors.happy,
                footer: { text: `👋 Wave • ${gif.anime_name || 'Anime'}` }
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Não consegui fazer isso... 😅', ephemeral: true });
        }
    }
};
