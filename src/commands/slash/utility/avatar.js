const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('🖼️ Ver avatar')
        .addUserOption(opt => opt.setName('usuario').setDescription('Usuário')),
    category: 'utility',
    cooldown: 3,
    async execute(interaction) {
        const user = interaction.options.getUser('usuario') || interaction.user;
        const avatar = user.displayAvatarURL({ dynamic: true, size: 4096 });
        
        const embed = EmbedUtils.create({
            title: `🖼️ Avatar de ${user.username}`,
            image: avatar,
            color: EmbedUtils.colors.info
        });
        
        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setLabel('PNG').setStyle(ButtonStyle.Link).setURL(user.displayAvatarURL({ extension: 'png', size: 4096 })),
            new ButtonBuilder().setLabel('JPG').setStyle(ButtonStyle.Link).setURL(user.displayAvatarURL({ extension: 'jpg', size: 4096 })),
            new ButtonBuilder().setLabel('WEBP').setStyle(ButtonStyle.Link).setURL(user.displayAvatarURL({ extension: 'webp', size: 4096 }))
        );
        
        await interaction.reply({ embeds: [embed], components: [buttons] });
    }
};
