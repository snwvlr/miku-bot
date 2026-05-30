const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dm')
        .setDescription('📩 Enviar DM para alguém')
        .addUserOption(opt => 
            opt.setName('usuario')
                .setDescription('Usuário para enviar a DM')
                .setRequired(true))
        .addStringOption(opt => 
            opt.setName('mensagem')
                .setDescription('Mensagem para enviar')
                .setRequired(true)
                .setMaxLength(2000))
        .addBooleanOption(opt =>
            opt.setName('embed')
                .setDescription('Enviar como embed?'))
        .addBooleanOption(opt =>
            opt.setName('anonimo')
                .setDescription('Enviar sem identificação do bot?')),
    category: 'owner',
    cooldown: 5,
    guildOnly: false,
    ownerOnly: true,
    async execute(interaction) {
        const target = interaction.options.getUser('usuario');
        const message = interaction.options.getString('mensagem');
        const useEmbed = interaction.options.getBoolean('embed') || false;
        const anonymous = interaction.options.getBoolean('anonimo') || false;
        
        try {
            if (useEmbed) {
                const embed = new EmbedBuilder()
                    .setColor('#FFD700')
                    .setDescription(message)
                    .setTimestamp();
                
                if (!anonymous) {
                    embed.setFooter({ 
                        text: `Enviado via ${interaction.client.user.username}`,
                        iconURL: interaction.client.user.displayAvatarURL()
                    });
                }
                
                await target.send({ embeds: [embed] });
            } else {
                let finalMessage = message;
                if (!anonymous) {
                    finalMessage += `\n\n*— Enviado via ${interaction.client.user.username}*`;
                }
                await target.send(finalMessage);
            }
            
            const logEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('✅ DM Enviada')
                .addFields(
                    { name: '👤 Destinatário', value: `${target.tag} (${target.id})`, inline: true },
                    { name: '📝 Mensagem', value: message.length > 1024 ? message.substring(0, 1021) + '...' : message, inline: false },
                    { name: '⚙️ Opções', value: `Embed: ${useEmbed ? 'Sim' : 'Não'} | Anônimo: ${anonymous ? 'Sim' : 'Não'}`, inline: false }
                )
                .setTimestamp();
            
            await interaction.reply({ embeds: [logEmbed], ephemeral: true });
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erro ao Enviar DM')
                .setDescription(`Não foi possível enviar DM para **${target.tag}**`)
                .addFields({ name: 'Erro', value: error.message })
                .setTimestamp();
            
            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
