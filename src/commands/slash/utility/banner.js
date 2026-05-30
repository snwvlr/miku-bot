const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('banner')
        .setDescription('🖼️ Ver banner')
        .addUserOption(opt => opt.setName('usuario').setDescription('Usuário')),
    category: 'utility',
    cooldown: 3,
    async execute(interaction) {
        const user = interaction.options.getUser('usuario') || interaction.user;
        const fetched = await user.fetch();
        
        if (!fetched.banner) {
            return interaction.reply({ content: `${user.username} não tem banner!`, ephemeral: true });
        }
        
        const banner = fetched.bannerURL({ dynamic: true, size: 4096 });
        const embed = EmbedUtils.create({
            title: `🖼️ Banner de ${user.username}`,
            image: banner,
            color: fetched.accentColor || EmbedUtils.colors.info
        });
        
        await interaction.reply({ embeds: [embed] });
    }
};
