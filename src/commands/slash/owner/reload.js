const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription('🔄 Limpar cache de conversas')
        .addStringOption(opt =>
            opt.setName('tipo')
                .setDescription('Tipo de cache para limpar')
                .setRequired(true)
                .addChoices(
                    { name: '💬 Conversas', value: 'conversations' },
                    { name: '👥 Usuários', value: 'users' },
                    { name: '📁 Guilds', value: 'guilds' },
                    { name: '🗑️ Tudo', value: 'all' }
                ))
        .addStringOption(opt =>
            opt.setName('usuario_id')
                .setDescription('ID do usuário específico (opcional)')
                .setMinLength(17)
                .setMaxLength(20)),
    category: 'owner',
    cooldown: 10,
    guildOnly: false,
    ownerOnly: true,
    async execute(interaction) {
        const client = interaction.client;
        const type = interaction.options.getString('tipo');
        const userId = interaction.options.getString('usuario_id');
        
        await interaction.deferReply({ ephemeral: true });
        
        let cleared = {
            conversations: 0,
            users: 0,
            guilds: 0
        };
        
        try {
            // Limpar cache de conversas (se você usar um Map ou Collection para armazenar)
            if (type === 'conversations' || type === 'all') {
                if (client.conversations) {
                    if (userId) {
                        if (client.conversations.has(userId)) {
                            client.conversations.delete(userId);
                            cleared.conversations = 1;
                        }
                    } else {
                        cleared.conversations = client.conversations.size;
                        client.conversations.clear();
                    }
                }
                
                // Se usar outro nome para o cache
                if (client.chatHistory) {
                    if (userId) {
                        if (client.chatHistory.has(userId)) {
                            client.chatHistory.delete(userId);
                            cleared.conversations += 1;
                        }
                    } else {
                        cleared.conversations += client.chatHistory.size;
                        client.chatHistory.clear();
                    }
                }
                
                // Cache de mensagens
                if (client.messageCache) {
                    if (userId) {
                        if (client.messageCache.has(userId)) {
                            client.messageCache.delete(userId);
                            cleared.conversations += 1;
                        }
                    } else {
                        cleared.conversations += client.messageCache.size;
                        client.messageCache.clear();
                    }
                }
            }
            
            // Limpar cache de usuários
            if (type === 'users' || type === 'all') {
                const beforeUsers = client.users.cache.size;
                client.users.cache.sweep(user => user.id !== client.user.id && user.id !== interaction.user.id);
                cleared.users = beforeUsers - client.users.cache.size;
            }
            
            // Limpar cache de guilds (cuidado com isso)
            if (type === 'guilds' || type === 'all') {
                // Limpa apenas dados extras, não remove os guilds
                client.guilds.cache.forEach(guild => {
                    const beforeMembers = guild.members.cache.size;
                    guild.members.cache.sweep(member => !member.user.bot && member.id !== interaction.user.id);
                    cleared.guilds += beforeMembers - guild.members.cache.size;
                });
            }
            
            // Forçar garbage collection se disponível
            if (global.gc) {
                global.gc();
            }
            
            const embed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('🔄 Cache Limpo')
                .setDescription(`Cache do tipo **${type}** foi limpo com sucesso!`)
                .addFields(
                    { name: '💬 Conversas', value: `${cleared.conversations} removidas`, inline: true },
                    { name: '👥 Usuários', value: `${cleared.users} removidos`, inline: true },
                    { name: '📁 Members', value: `${cleared.guilds} removidos`, inline: true }
                )
                .setTimestamp();
            
            if (userId) {
                embed.addFields({ name: '🎯 Usuário Específico', value: userId, inline: false });
            }
            
            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Erro ao Limpar Cache')
                .setDescription(error.message)
                .setTimestamp();
            
            await interaction.editReply({ embeds: [errorEmbed] });
        }
    }
};
