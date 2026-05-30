const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joke')
        .setDescription('😂 Contar uma piada'),
    category: 'fun',
    cooldown: 5,
    async execute(interaction) {
        const jokes = [
            'Por que o programador usa óculos? Porque ele não consegue C#!',
            'O que o café disse pro leite? Fica frio!',
            'Qual é o fim da picada? Quando o mosquito vai embora!',
            'Por que o livro de matemática é triste? Porque tem muitos problemas!',
            'O que o zero disse pro oito? Belo cinto!',
            'Quantos programadores são necessários pra trocar uma lâmpada? Nenhum, é problema de hardware!',
            'Por que desenvolvedores preferem o escuro? Porque a luz atrai bugs!',
            'Eu ia contar uma piada de UDP, mas você provavelmente não ia receber...',
            'Existem 10 tipos de pessoas: as que entendem binário e as que não!',
            'Por que o JavaScript é tão confiante? Porque ele tem self!',
        ];
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        await interaction.reply({ embeds: [EmbedUtils.create({ title: '😂 Piada', description: joke, color: EmbedUtils.colors.happy })] });
    }
};
