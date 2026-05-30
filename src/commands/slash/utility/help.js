const { SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('📚 Lista de comandos'),
    category: 'utility',
    cooldown: 5,
    async execute(interaction, client) {
        const categories = {};
        client.commands.forEach(cmd => {
            const cat = cmd.category || 'outros';
            if (!categories[cat]) categories[cat] = [];
            categories[cat].push(cmd.data.name);
        });
        
        const emojis = { interaction: '🎭', fun: '🎮', moderation: '🛡️', utility: '🔧', config: '⚙️', info: 'ℹ️', owner: '👑', outros: '📦' };
        const names = { interaction: 'Interação', fun: 'Diversão', moderation: 'Moderação', utility: 'Utilidade', config: 'Configuração', info: 'Informação', owner: 'Dono', outros: 'Outros' };
        
        let description = `Olá **${interaction.user.username}**! 👋\n\nEscolha uma categoria no menu abaixo:\n\n`;
        for (const [cat, cmds] of Object.entries(categories)) {
            description += `${emojis[cat] || '📦'} **${names[cat] || cat}** - ${cmds.length} comandos\n`;
        }
        description += `\n**Total:** ${client.commands.size} comandos`;
        
        const embed = EmbedUtils.create({
            title: '📚 Central de Ajuda',
            description,
            color: EmbedUtils.colors.primary,
            thumbnail: client.user.displayAvatarURL(),
            footer: { text: 'Me mencione para conversar! 💬' }
        });
        
        const options = Object.entries(categories).map(([cat, cmds]) => 
            new StringSelectMenuOptionBuilder()
                .setLabel(names[cat] || cat)
                .setDescription(`${cmds.length} comandos`)
                .setValue(cat)
                .setEmoji(emojis[cat] || '📦')
        );
        
        const menu = new StringSelectMenuBuilder()
            .setCustomId('help_menu')
            .setPlaceholder('Selecione uma categoria')
            .addOptions(options);
        
        const row = new ActionRowBuilder().addComponents(menu);
        const msg = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });
        
        const collector = msg.createMessageComponentCollector({ time: 120000 });
        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) return i.reply({ content: 'Não é pra você!', ephemeral: true });
            
            const cat = i.values[0];
            const cmds = categories[cat];
            const catEmbed = EmbedUtils.create({
                title: `${emojis[cat]} ${names[cat] || cat}`,
                description: cmds.map(c => `\`/${c}\``).join(' '),
                color: EmbedUtils.colors.info,
                footer: { text: `${cmds.length} comandos` }
            });
            await i.update({ embeds: [catEmbed] });
        });
        collector.on('end', () => msg.edit({ components: [] }).catch(() => {}));
    }
};
