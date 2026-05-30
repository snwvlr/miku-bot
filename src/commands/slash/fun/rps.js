const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription('✂️ Pedra, papel ou tesoura'),
    category: 'fun',
    cooldown: 5,
    async execute(interaction) {
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('rps_rock').setLabel('Pedra').setEmoji('🪨').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('rps_paper').setLabel('Papel').setEmoji('📄').setStyle(ButtonStyle.Secondary),
            new ButtonBuilder().setCustomId('rps_scissors').setLabel('Tesoura').setEmoji('✂️').setStyle(ButtonStyle.Secondary)
        );
        const msg = await interaction.reply({ 
            embeds: [EmbedUtils.create({ title: '✂️ Pedra, Papel ou Tesoura', description: 'Escolha sua jogada!', color: EmbedUtils.colors.info })], 
            components: [buttons], 
            fetchReply: true 
        });
        const collector = msg.createMessageComponentCollector({ time: 30000 });
        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return i.reply({ content: 'Não é sua vez!', ephemeral: true });
            const userChoice = i.customId.replace('rps_', '');
            const botChoice = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
            const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
            let result, color;
            if (userChoice === botChoice) { result = 'Empate! 🤝'; color = EmbedUtils.colors.warning; }
            else if ((userChoice === 'rock' && botChoice === 'scissors') || (userChoice === 'paper' && botChoice === 'rock') || (userChoice === 'scissors' && botChoice === 'paper')) {
                result = 'Você ganhou! 🎉'; color = EmbedUtils.colors.success;
            } else { result = 'Eu ganhei! 😎'; color = EmbedUtils.colors.error; }
            await i.update({ embeds: [EmbedUtils.create({ title: '✂️ Resultado', description: `Você: ${emojis[userChoice]}\nEu: ${emojis[botChoice]}\n\n**${result}**`, color })], components: [] });
            collector.stop();
        });
        collector.on('end', (_, reason) => { if (reason === 'time') msg.edit({ components: [] }).catch(() => {}); });
    }
};
