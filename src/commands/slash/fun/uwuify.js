const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('uwuify')
        .setDescription('UwU Transformar texto')
        .addStringOption(opt => opt.setName('texto').setDescription('Texto').setRequired(true)),
    category: 'fun',
    cooldown: 3,
    async execute(interaction) {
        const text = interaction.options.getString('texto');
        const faces = ['uwu', 'owo', '>w<', '^w^', 'nya~', '(◕ᴗ◕✿)', '(´・ω・`)'];
        const uwu = text
            .replace(/[rl]/g, 'w').replace(/[RL]/g, 'W')
            .replace(/n([aeiou])/g, 'ny$1').replace(/N([aeiou])/g, 'Ny$1')
            .replace(/ove/g, 'uv') + ' ' + faces[Math.floor(Math.random() * faces.length)];
        const embed = EmbedUtils.create({
            title: 'UwU',
            description: uwu.substring(0, 2000),
            color: EmbedUtils.colors.kawaii
        });
        await interaction.reply({ embeds: [embed] });
    }
};
