const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('falar')
        .setDescription('💬 Fazer o bot falar')
        .addStringOption(opt => 
            opt.setName('mensagem')
                .setDescription('Mensagem que o bot irá enviar')
                .setRequired(true)
                .setMaxLength(2000))
        .addChannelOption(opt => 
            opt.setName('canal')
                .setDescription('Canal para enviar (padrão: canal atual)')
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement))
        .addBooleanOption(opt =>
            opt.setName('embed')
                .setDescription('Enviar como embed?')),
    category: 'owner',
    cooldown: 3,
    guildOnly: true,
    ownerOnly: true,
    async execute(interaction) {
        const message = interaction.options.getString('mensagem');
        const channel = interaction.options.getChannel('canal') || interaction.channel;
        const useEmbed = interaction.options.getBoolean('embed') || false;
        
        try {
            if (useEmbed) {
                const { EmbedBuilder } = require('discord.js');
                const embed = new EmbedBuilder()
                    .setColor('#FFD700')
                    .setDescription(message)
                    .setTimestamp();
                
                await channel.send({ embeds: [embed] });
            } else {
                await channel.send(message);
            }
            
            await interaction.reply({ 
                content: `✅ Mensagem enviada em ${channel}!`, 
                ephemeral: true 
            });
        } catch (error) {
            await interaction.reply({ 
                content: `❌ Erro ao enviar mensagem: ${error.message}`, 
                ephemeral: true 
            });
        }
    }
};
