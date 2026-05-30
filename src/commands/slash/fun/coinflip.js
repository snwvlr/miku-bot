const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('coinflip')
        .setDescription('🪙 Jogar moeda')
        .addStringOption(opt => opt.setName('aposta').setDescription('Cara ou coroa?').addChoices({ name: 'Cara', value: 'cara' }, { name: 'Coroa', value: 'coroa' })),
    category: 'fun',
    cooldown: 3,
    async execute(interaction) {
        const bet = interaction.options.getString('aposta');
        const result = Math.random() < 0.5 ? 'cara' : 'coroa';
        const emoji = result === 'cara' ? '👤' : '👑';
        let description = `A moeda caiu em... **${result.toUpperCase()}**! ${emoji}`;
        let color = EmbedUtils.colors.happy;
        if (bet) {
            if (bet === result) { description += '\n\n✅ **Você acertou!**'; color = EmbedUtils.colors.success; }
            else { description += '\n\n❌ **Você errou!**'; color = EmbedUtils.colors.error; }
        }
        await interaction.reply({ embeds: [EmbedUtils.create({ title: '🪙 Cara ou Coroa', description, color, timestamp: true })] });
    }
};
