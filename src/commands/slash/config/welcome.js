const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', '..', '..', 'data', 'welcome.json');

function loadConfig() {
    try { if (fs.existsSync(dataPath)) return JSON.parse(fs.readFileSync(dataPath, 'utf8')); } catch {}
    return {};
}
function saveConfig(config) {
    try { fs.writeFileSync(dataPath, JSON.stringify(config, null, 2)); } catch {}
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('👋 Configurar boas-vindas')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
        .addSubcommand(sub => sub.setName('set').setDescription('Definir canal')
            .addChannelOption(opt => opt.setName('canal').setDescription('Canal').setRequired(true).addChannelTypes(ChannelType.GuildText)))
        .addSubcommand(sub => sub.setName('disable').setDescription('Desativar'))
        .addSubcommand(sub => sub.setName('test').setDescription('Testar'))
        .addSubcommand(sub => sub.setName('status').setDescription('Ver status')),
    category: 'config',
    cooldown: 5,
    guildOnly: true,
    userPermissions: ['ManageGuild'],
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const config = loadConfig();
        
        if (sub === 'set') {
            const channel = interaction.options.getChannel('canal');
            config[interaction.guild.id] = channel.id;
            saveConfig(config);
            await interaction.reply({ embeds: [EmbedUtils.success('Configurado!', `Boas-vindas em ${channel}`)] });
        } else if (sub === 'disable') {
            delete config[interaction.guild.id];
            saveConfig(config);
            await interaction.reply({ embeds: [EmbedUtils.success('Desativado', 'Boas-vindas desativado.')] });
        } else if (sub === 'test') {
            const channelId = config[interaction.guild.id];
            if (!channelId) return interaction.reply({ content: 'Configure primeiro!', ephemeral: true });
            const channel = interaction.guild.channels.cache.get(channelId);
            if (!channel) return interaction.reply({ content: 'Canal não existe!', ephemeral: true });
            
            const embed = EmbedUtils.create({
                title: '👋 Bem-vindo(a)!',
                description: `Olá ${interaction.member}! Seja bem-vindo(a) ao **${interaction.guild.name}**!`,
                color: EmbedUtils.colors.success,
                thumbnail: interaction.user.displayAvatarURL({ dynamic: true }),
                fields: [
                    { name: '👤 Membro', value: interaction.user.tag, inline: true },
                    { name: '🔢 Posição', value: `${interaction.guild.memberCount}º`, inline: true },
                ],
                footer: { text: '🧪 TESTE' },
                timestamp: true
            });
            await channel.send({ embeds: [embed] });
            await interaction.reply({ content: `✅ Teste enviado!`, ephemeral: true });
        } else {
            const channelId = config[interaction.guild.id];
            if (!channelId) {
                await interaction.reply({ embeds: [EmbedUtils.info('Status', '❌ Desativado\n\nUse `/welcome set`')] });
            } else {
                const channel = interaction.guild.channels.cache.get(channelId);
                await interaction.reply({ embeds: [EmbedUtils.info('Status', channel ? `✅ Ativado em ${channel}` : '⚠️ Canal não existe!')] });
            }
        }
    }
};
