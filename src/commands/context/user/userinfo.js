const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('ℹ️ Ver Info')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const user = interaction.targetUser;
        const member = interaction.guild?.members.cache.get(user.id);
        const badges = { Staff: '👨‍💼', Partner: '🤝', HypeSquadOnlineHouse1: '🔥', HypeSquadOnlineHouse2: '✨', HypeSquadOnlineHouse3: '🌿', PremiumEarlySupporter: '👑', VerifiedDeveloper: '🛠️', ActiveDeveloper: '💻' };
        const userBadges = user.flags?.toArray().map(b => badges[b]).filter(b => b).join(' ') || 'Nenhuma';
        const embed = EmbedUtils.create({
            title: `👤 ${user.tag}`,
            color: member?.displayColor || EmbedUtils.colors.primary,
            thumbnail: user.displayAvatarURL({ dynamic: true }),
            fields: [
                { name: 'ID', value: `\`${user.id}\``, inline: true },
                { name: 'Bot', value: user.bot ? 'Sim' : 'Não', inline: true },
                { name: 'Badges', value: userBadges, inline: true },
                { name: 'Conta', value: `<t:${Math.floor(user.createdTimestamp/1000)}:R>`, inline: true },
            ]
        });
        if (member) {
            embed.addFields({ name: 'Entrou', value: `<t:${Math.floor(member.joinedTimestamp/1000)}:R>`, inline: true });
            const roles = member.roles.cache.filter(r => r.id !== interaction.guild.id).map(r => r.toString()).slice(0, 5);
            if (roles.length > 0) embed.addFields({ name: 'Cargos', value: roles.join(', ') });
        }
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
