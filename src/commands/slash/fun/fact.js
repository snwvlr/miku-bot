const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fact')
        .setDescription('📚 Fato aleatório'),
    category: 'fun',
    cooldown: 5,
    async execute(interaction) {
        const facts = [
            'O mel nunca estraga! Arqueólogos encontraram mel de 3000 anos ainda comestível.',
            'Polvos têm três corações e sangue azul!',
            'Bananas são levemente radioativas!',
            'O coração de um camarão fica na cabeça.',
            'Flamingos nascem brancos e ficam rosa pela comida.',
            'O Japão tem mais de 6.800 ilhas!',
            'Gatos dormem em média 70% de suas vidas.',
            'O olho de um avestruz é maior que seu cérebro.',
            'Ratos riem quando sentem cócegas!',
            'A Lua está se afastando da Terra 3,8cm por ano.',
            'Tubarões existem há mais tempo que as árvores!',
            'Você não consegue lamber seu próprio cotovelo.',
        ];
        const fact = facts[Math.floor(Math.random() * facts.length)];
        await interaction.reply({ embeds: [EmbedUtils.create({ title: '📚 Você Sabia?', description: fact, color: EmbedUtils.colors.info })] });
    }
};
