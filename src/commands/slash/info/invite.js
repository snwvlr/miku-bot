const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('🔗 Link de convite'),
    category: 'info',
    cooldown: 5,
    async execute(interaction, client) {
        const embed = EmbedUtils.create({
            title: '🔗 Me adicione no seu servidor!',
            description: 'Clique no botão abaixo para me adicionar! 💕',
            color: EmbedUtils.colors.info,
            thumbnail: client.user.displayAvatarURL()
        });
        
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('Adicionar Bot').setStyle(ButtonStyle.Link).setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`).setEmoji('✨')
        );
        
        await interaction.reply({ embeds: [embed], components: [buttons] });
    }
};
