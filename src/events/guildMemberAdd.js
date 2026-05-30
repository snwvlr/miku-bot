const EmbedUtils = require('../utils/embed');
const fs = require('fs');
const path = require('path');

const welcomePath = path.join(__dirname, '..', 'data', 'welcome.json');
const autorolePath = path.join(__dirname, '..', 'data', 'autorole.json');

function loadConfig(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch {}
    return {};
}

module.exports = {
    name: 'guildMemberAdd',
    
    async execute(member, client) {
        // Autorole
        const autoroleConfig = loadConfig(autorolePath);
        const roleId = autoroleConfig[member.guild.id];
        if (roleId) {
            const role = member.guild.roles.cache.get(roleId);
            if (role && role.position < member.guild.members.me.roles.highest.position) {
                try {
                    await member.roles.add(role);
                } catch (error) {
                    console.error('Erro ao dar autorole:', error);
                }
            }
        }

        // Welcome
        const welcomeConfig = loadConfig(welcomePath);
        const channelId = welcomeConfig[member.guild.id];
        
        if (!channelId) return;

        const channel = member.guild.channels.cache.get(channelId);
        if (!channel) return;

        const embed = EmbedUtils.create({
            title: '👋 Bem-vindo(a)!',
            description: `Olá ${member}! Seja bem-vindo(a) ao **${member.guild.name}**! 🎉`,
            color: EmbedUtils.colors.success,
            thumbnail: member.user.displayAvatarURL({ dynamic: true, size: 256 }),
            fields: [
                { name: '👤 Membro', value: member.user.tag, inline: true },
                { name: '🔢 Posição', value: `${member.guild.memberCount}º membro`, inline: true },
                { name: '📅 Conta criada', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
            ],
            footer: { text: `ID: ${member.id}` },
            timestamp: true
        });

        try {
            await channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Erro ao enviar boas-vindas:', error);
        }
    }
};
