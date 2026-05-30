const { SlashCommandBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('👤 Informações de usuário')
        .addUserOption(opt => opt.setName('usuario').setDescription('Usuário')),
    category: 'utility',
    cooldown: 5,
    async execute(interaction) {
        const user = interaction.options.getUser('usuario') || interaction.user;
        const member = interaction.guild?.members.cache.get(user.id);
        
        const badges = { Staff: '👨‍💼', Partner: '🤝', HypeSquadOnlineHouse1: '🔥', HypeSquadOnlineHouse2: '✨', HypeSquadOnlineHouse3: '🌿', PremiumEarlySupporter: '👑', VerifiedDeveloper: '🛠️', ActiveDeveloper: '💻' };
        const userBadges = user.flags?.toArray().map(b => badges[b]).filter(b => b).join(' ') || 'Nenhuma';
        
        const embed = EmbedUtils.create({
            title: `👤 ${user.tag}`,
            color: member?.displayColor || EmbedUtils.colors.primary,
            thumbnail: user.displayAvatarURL({ dynamic: true, size: 256 }),
            fields: [
                { name: '🆔 ID', value: `\`${user.id}\``, inline: true },
                { name: '🤖 Bot', value: user.bot ? 'Sim' : 'Não', inline: true },
                { name: '🏅 Badges', value: userBadges, inline: true },
                { name: '📅 Conta criada', value: `<t:${Math.floor(user.createdTimestamp/1000)}:R>`, inline: true },
            ],
            timestamp: true
        });
        
        if (member) {
            embed.addFields(
                { name: '📥 Entrou', value: `<t:${Math.floor(member.joinedTimestamp/1000)}:R>`, inline: true },
                { name: '📛 Apelido', value: member.nickname || 'Nenhum', inline: true }
            );
            const roles = member.roles.cache.filter(r => r.id !== interaction.guild.id).sort((a,b) => b.position - a.position).map(r => r.toString()).slice(0, 10);
            if (roles.length > 0) embed.addFields({ name: `🏷️ Cargos [${member.roles.cache.size - 1}]`, value: roles.join(', ') });
        }
        
        await interaction.reply({ embeds: [embed] });
    }
};
