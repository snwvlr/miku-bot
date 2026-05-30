const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('🎱 Pergunte à bola mágica')
        .addStringOption(opt => opt.setName('pergunta').setDescription('Sua pergunta').setRequired(true)),
    category: 'fun',
    cooldown: 3,
    async execute(interaction) {
        const question = interaction.options.getString('pergunta');
        const responses = [
            { text: 'Sim!', color: 'success' },
            { text: 'Não!', color: 'error' },
            { text: 'Com certeza!', color: 'success' },
            { text: 'De jeito nenhum!', color: 'error' },
            { text: 'Talvez...', color: 'warning' },
            { text: 'Provavelmente sim', color: 'success' },
            { text: 'Provavelmente não', color: 'error' },
            { text: 'Pergunte novamente', color: 'info' },
            { text: 'As estrelas dizem que sim ✨', color: 'success' },
            { text: 'Definitivamente!', color: 'success' },
            { text: 'Nem pensar!', color: 'error' },
            { text: 'Meu mestre diz que sim!', color: 'success' }
        ];
        const r = responses[Math.floor(Math.random() * responses.length)];
        const embed = EmbedUtils.create({
            title: '🎱 Bola Mágica',
            fields: [
                { name: '❓ Pergunta', value: question },
                { name: '🔮 Resposta', value: r.text }
            ],
            color: EmbedUtils.colors[r.color],
            timestamp: true
        });
        await interaction.reply({ embeds: [embed] });
    }
};
