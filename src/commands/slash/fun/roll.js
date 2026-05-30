const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('🎲 Rolar dados')
        .addIntegerOption(opt => opt.setName('lados').setDescription('Lados do dado').setMinValue(2).setMaxValue(1000))
        .addIntegerOption(opt => opt.setName('quantidade').setDescription('Quantidade').setMinValue(1).setMaxValue(20)),
    category: 'fun',
    cooldown: 3,
    async execute(interaction) {
        const sides = interaction.options.getInteger('lados') || 6;
        const amount = interaction.options.getInteger('quantidade') || 1;
        const results = [];
        for (let i = 0; i < amount; i++) results.push(Math.floor(Math.random() * sides) + 1);
        const total = results.reduce((a, b) => a + b, 0);
        const embed = EmbedUtils.create({
            title: '🎲 Dados',
            description: amount > 1 ? `Resultados: **[${results.join(', ')}]**\n\n**Total:** ${total}\n**Média:** ${(total / amount).toFixed(1)}` : `Resultado: **${results[0]}**`,
            color: EmbedUtils.colors.happy,
            footer: { text: `${amount}d${sides}` },
            timestamp: true
        });
        await interaction.reply({ embeds: [embed] });
    }
};
