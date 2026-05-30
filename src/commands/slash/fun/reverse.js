const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reverse')
        .setDescription('🔄 Inverter texto')
        .addStringOption(opt => opt.setName('texto').setDescription('Texto').setRequired(true)),
    category: 'fun',
    cooldown: 3,
    async execute(interaction) {
        const text = interaction.options.getString('texto');
        const reversed = text.split('').reverse().join('');
        const embed = EmbedUtils.create({
            title: '🔄 Texto Invertido',
            fields: [
                { name: 'Original', value: text.substring(0, 1000) },
                { name: 'Invertido', value: reversed.substring(0, 1000) }
            ],
            color: EmbedUtils.colors.info
        });
        await interaction.reply({ embeds: [embed] });
    }
};
