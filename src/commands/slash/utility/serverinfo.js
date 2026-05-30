const { SlashCommandBuilder, ChannelType } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('🏠 Informações do servidor'),
    category: 'utility',
    cooldown: 5,
    guildOnly: true,
    async execute(interaction) {
        const guild = interaction.guild;
        await guild.members.fetch();
        
        const channels = guild.channels.cache;
        const textChannels = channels.filter(c => c.type === ChannelType.GuildText).size;
        const voiceChannels = channels.filter(c => c.type === ChannelType.GuildVoice).size;
        
        const members = guild.members.cache;
        const humans = members.filter(m => !m.user.bot).size;
        const bots = members.filter(m => m.user.bot).size;
        
        const boostTiers = { 0: 'Nenhum', 1: 'Nível 1', 2: 'Nível 2', 3: 'Nível 3' };
        
        const embed = EmbedUtils.create({
            title: `🏠 ${guild.name}`,
            color: EmbedUtils.colors.primary,
            thumbnail: guild.iconURL({ dynamic: true, size: 256 }),
            fields: [
                { name: '🆔 ID', value: `\`${guild.id}\``, inline: true },
                { name: '👑 Dono', value: `<@${guild.ownerId}>`, inline: true },
                { name: '📅 Criado', value: `<t:${Math.floor(guild.createdTimestamp/1000)}:R>`, inline: true },
                { name: `👥 Membros [${guild.memberCount}]`, value: `👤 ${humans} | 🤖 ${bots}`, inline: true },
                { name: `💬 Canais [${channels.size}]`, value: `💬 ${textChannels} | 🔊 ${voiceChannels}`, inline: true },
                { name: '✨ Boost', value: `${boostTiers[guild.premiumTier]} (${guild.premiumSubscriptionCount || 0})`, inline: true },
                { name: '🏷️ Cargos', value: `${guild.roles.cache.size}`, inline: true },
                { name: '😀 Emojis', value: `${guild.emojis.cache.size}`, inline: true },
            ],
            timestamp: true
        });
        if (guild.banner) embed.setImage(guild.bannerURL({ size: 1024 }));
        
        await interaction.reply({ embeds: [embed] });
    }
};
