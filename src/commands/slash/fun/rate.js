const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rate')
        .setDescription('⭐ Avaliar algo')
        .addStringOption(opt => opt.setName('coisa').setDescription('O que avaliar?').setRequired(true)),
    category: 'fun',
    cooldown: 3,
    async execute(interaction) {
        const thing = interaction.options.getString('coisa');
        const rating = Math.floor(Math.random() * 11);
        const stars = '⭐'.repeat(rating) + '☆'.repeat(10 - rating);
        let comment;
        if (rating >= 9) comment = 'PERFEITO! 🎉';
        else if (rating >= 7) comment = 'Muito bom! 😊';
        else if (rating >= 5) comment = 'Tá ok... 🤔';
        else if (rating >= 3) comment = 'Podia ser melhor... 😕';
        else comment = 'Hmmm... 😬';
        const embed = EmbedUtils.create({
            title: '⭐ Avaliação',
            description: `**"${thing}"**\n\n${stars}\n**${rating}/10** - ${comment}`,
            color: rating >= 7 ? EmbedUtils.colors.gold : rating >= 4 ? EmbedUtils.colors.warning : EmbedUtils.colors.error,
            timestamp: true
        });
        await interaction.reply({ embeds: [embed] });
    }
};
