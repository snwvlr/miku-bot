const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('owner')
        .setDescription('👑 Comandos do dono')
        .addSubcommand(sub => sub.setName('status').setDescription('Status detalhado'))
        .addSubcommand(sub => sub.setName('say').setDescription('Fazer bot falar')
            .addStringOption(opt => opt.setName('mensagem').setDescription('Mensagem').setRequired(true)))
        .addSubcommand(sub => sub.setName('dm').setDescription('Enviar DM')
            .addUserOption(opt => opt.setName('usuario').setDescription('Usuário').setRequired(true))
            .addStringOption(opt => opt.setName('mensagem').setDescription('Mensagem').setRequired(true)))
        .addSubcommand(sub => sub.setName('reload').setDescription('Limpar cache'))
        .addSubcommand(sub => sub.setName('servers').setDescription('Lista de servidores'))
        .addSubcommand(sub => sub.setName('eval').setDescription('Executar código')
            .addStringOption(opt => opt.setName('codigo').setDescription('Código').setRequired(true))),
    category: 'owner',
    cooldown: 0,
    ownerOnly: true,
    async execute(interaction, client) {
        const sub = interaction.options.getSubcommand();
        
        if (sub === 'status') {
            const memUsage = process.memoryUsage();
            const memUsedMB = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
            const uptime = process.uptime();
            const days = Math.floor(uptime / 86400);
            const hours = Math.floor((uptime % 86400) / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            
            const embed = EmbedUtils.create({
                title: '👑 Status (Dono)',
                color: EmbedUtils.colors.gold,
                fields: [
                    { name: '🏠 Servidores', value: `${client.guilds.cache.size}`, inline: true },
                    { name: '👥 Usuários', value: `${client.users.cache.size}`, inline: true },
                    { name: '💬 Canais', value: `${client.channels.cache.size}`, inline: true },
                    { name: '💾 RAM', value: `${memUsedMB} MB`, inline: true },
                    { name: '📡 Ping', value: `${client.ws.ping}ms`, inline: true },
                    { name: '⏱️ Uptime', value: `${days}d ${hours}h ${minutes}m`, inline: true },
                    { name: '💭 Históricos', value: `${client.chatHistory?.size || 0}`, inline: true },
                ],
                timestamp: true
            });
            await interaction.reply({ embeds: [embed], ephemeral: true });
        } else if (sub === 'say') {
            const msg = interaction.options.getString('mensagem');
            await interaction.reply({ content: '✅', ephemeral: true });
            await interaction.channel.send(msg);
        } else if (sub === 'dm') {
            const user = interaction.options.getUser('usuario');
            const msg = interaction.options.getString('mensagem');
            try {
                await user.send(msg);
                await interaction.reply({ content: `✅ DM enviada para ${user.tag}`, ephemeral: true });
            } catch {
                await interaction.reply({ content: '❌ Não consegui enviar DM', ephemeral: true });
            }
        } else if (sub === 'reload') {
            const size = client.chatHistory?.size || 0;
            if (client.chatHistory) client.chatHistory.clear();
            await interaction.reply({ content: `🧹 Limpei ${size} históricos!`, ephemeral: true });
        } else if (sub === 'servers') {
            const servers = client.guilds.cache.sort((a, b) => b.memberCount - a.memberCount).map((g, i) => `${i + 1}. **${g.name}** - ${g.memberCount}`).slice(0, 20).join('\n');
            await interaction.reply({ embeds: [EmbedUtils.create({ title: '🏠 Servidores', description: servers, color: EmbedUtils.colors.info, footer: { text: `Total: ${client.guilds.cache.size}` } })], ephemeral: true });
        } else if (sub === 'eval') {
            const code = interaction.options.getString('codigo');
            try {
                let result = eval(code);
                if (typeof result !== 'string') result = require('util').inspect(result);
                if (result.length > 1900) result = result.substring(0, 1900) + '...';
                await interaction.reply({ content: `\`\`\`js\n${result}\n\`\`\``, ephemeral: true });
            } catch (error) {
                await interaction.reply({ content: `❌ Erro:\n\`\`\`${error.message}\`\`\``, ephemeral: true });
            }
        }
    }
};
