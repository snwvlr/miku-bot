const { SlashCommandBuilder, EmbedBuilder, version: djsVersion } = require('discord.js');
const os = require('os');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('📊 Ver status detalhado do bot'),
    category: 'owner',
    cooldown: 10,
    guildOnly: false,
    ownerOnly: true,
    async execute(interaction) {
        const client = interaction.client;
        
        const uptime = formatUptime(client.uptime);
        const memUsage = process.memoryUsage();
        const usedMem = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
        const totalMem = (memUsage.heapTotal / 1024 / 1024).toFixed(2);
        const systemMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
        const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
        
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('👑 Status do Bot')
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { 
                    name: '🤖 Bot', 
                    value: [
                        `**Nome:** ${client.user.tag}`,
                        `**ID:** ${client.user.id}`,
                        `**Uptime:** ${uptime}`
                    ].join('\n'), 
                    inline: true 
                },
                { 
                    name: '📈 Estatísticas', 
                    value: [
                        `**Servidores:** ${client.guilds.cache.size}`,
                        `**Usuários:** ${client.users.cache.size}`,
                        `**Canais:** ${client.channels.cache.size}`
                    ].join('\n'), 
                    inline: true 
                },
                { 
                    name: '💾 Memória', 
                    value: [
                        `**Heap:** ${usedMem}/${totalMem} MB`,
                        `**Sistema:** ${freeMem}/${systemMem} GB livre`
                    ].join('\n'), 
                    inline: true 
                },
                { 
                    name: '⚙️ Sistema', 
                    value: [
                        `**Node.js:** ${process.version}`,
                        `**Discord.js:** v${djsVersion}`,
                        `**Plataforma:** ${os.platform()} ${os.arch()}`,
                        `**CPU:** ${os.cpus()[0]?.model || 'N/A'}`
                    ].join('\n'), 
                    inline: false 
                },
                {
                    name: '📡 Conexão',
                    value: [
                        `**Ping:** ${client.ws.ping}ms`,
                        `**Shards:** ${client.ws.shards.size || 1}`
                    ].join('\n'),
                    inline: true
                }
            )
            .setFooter({ text: `Solicitado por ${interaction.user.tag}` })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    }
};

function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours % 24 > 0) parts.push(`${hours % 24}h`);
    if (minutes % 60 > 0) parts.push(`${minutes % 60}m`);
    if (seconds % 60 > 0) parts.push(`${seconds % 60}s`);
    
    return parts.join(' ') || '0s';
}
