const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ship')
        .setDescription('💕 Ver compatibilidade')
        .addUserOption(opt => opt.setName('pessoa1').setDescription('Primeira pessoa').setRequired(true))
        .addUserOption(opt => opt.setName('pessoa2').setDescription('Segunda pessoa')),
    category: 'fun',
    cooldown: 5,
    async execute(interaction) {
        const p1 = interaction.options.getUser('pessoa1');
        const p2 = interaction.options.getUser('pessoa2') || interaction.user;
        const hash = (p1.id + p2.id).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
        const percent = hash % 101;
        let emoji, msg;
        if (percent >= 90) { emoji = '💖💖💖'; msg = 'CASAL PERFEITO!'; }
        else if (percent >= 70) { emoji = '💕💕'; msg = 'Muito compatíveis!'; }
        else if (percent >= 50) { emoji = '💗'; msg = 'Têm potencial!'; }
        else if (percent >= 30) { emoji = '💛'; msg = 'Talvez dê certo...'; }
        else { emoji = '💔'; msg = 'Não rolou...'; }
        const bar = EmbedUtils.progressBar(percent, 100, 10, '❤️', '🖤');
        const embed = EmbedUtils.create({
            title: '💕 Ship',
            description: `**${p1.username}** x **${p2.username}**\n\n${bar} **${percent}%**\n\n${emoji} ${msg}`,
            color: percent >= 50 ? EmbedUtils.colors.love : EmbedUtils.colors.error,
            thumbnail: p1.displayAvatarURL(),
            timestamp: true
        });
        await interaction.reply({ embeds: [embed] });
    }
};
