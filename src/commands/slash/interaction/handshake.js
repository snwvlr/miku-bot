const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');
const nekos = require('../../../services/nekosService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('handshake')
        .setDescription('🤝 Aperto de mão')
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
            const gif = await nekos.getGif('handshake');
            const soloMessages = ["ofereceu um aperto de mão","quer apertar sua mão","estendeu a mão"];
            const targetMessages = ["apertou a mão de","cumprimentou","fez um acordo com"];
            
            let description;
            if (target && target.id !== author.id) {
                const msg = targetMessages[Math.floor(Math.random() * targetMessages.length)];
                description = `**${author.username}** ${msg} **${target.username}**! 🤝`;
            } else {
                const msg = soloMessages[Math.floor(Math.random() * soloMessages.length)];
                description = `**${author.username}** ${msg} 🤝`;
            }

            const embed = EmbedUtils.interaction({
                description,
                gif: gif.url,
                color: EmbedUtils.colors.info,
                footer: { text: `🤝 Handshake • ${gif.anime_name || 'Anime'}` }
            });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Não consegui fazer isso... 😅', ephemeral: true });
        }
    }
};
