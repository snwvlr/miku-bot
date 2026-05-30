const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('choose')
        .setDescription('🤔 Escolher entre opções')
        .addStringOption(opt => opt.setName('opcoes').setDescription('Opções separadas por vírgula').setRequired(true)),
    category: 'fun',
    cooldown: 3,
    async execute(interaction) {
        const options = interaction.options.getString('opcoes').split(',').map(o => o.trim()).filter(o => o);
        if (options.length < 2) return interaction.reply({ content: 'Preciso de pelo menos 2 opções!', ephemeral: true });
        const choice = options[Math.floor(Math.random() * options.length)];
        const embed = EmbedUtils.create({
            title: '🤔 Minha Escolha',
            description: `Entre **${options.join('**, **')}**...\n\nEu escolho: **${choice}**! ✨`,
            color: EmbedUtils.colors.info,
            timestamp: true
        });
        await interaction.reply({ embeds: [embed] });
    }
};
