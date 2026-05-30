const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('💬 Fazer o bot falar')
        .addStringOption(opt => opt.setName('mensagem').setDescription('Mensagem').setRequired(true)),
    category: 'fun',
    cooldown: 5,
    async execute(interaction) {
        const msg = interaction.options.getString('mensagem');
        if (msg.includes('@everyone') || msg.includes('@here')) {
            return interaction.reply({ content: 'Não posso mencionar everyone/here!', ephemeral: true });
        }
        await interaction.reply({ content: '💬', ephemeral: true });
        await interaction.channel.send(msg);
    }
};
