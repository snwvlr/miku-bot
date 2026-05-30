const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', '..', '..', 'data', 'autorole.json');

function loadConfig() {
    try { if (fs.existsSync(dataPath)) return JSON.parse(fs.readFileSync(dataPath, 'utf8')); } catch {}
    return {};
}
function saveConfig(config) {
    try { fs.writeFileSync(dataPath, JSON.stringify(config, null, 2)); } catch {}
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autorole')
        .setDescription('🏷️ Cargo automático')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addSubcommand(sub => sub.setName('set').setDescription('Definir cargo')
            .addRoleOption(opt => opt.setName('cargo').setDescription('Cargo').setRequired(true)))
        .addSubcommand(sub => sub.setName('disable').setDescription('Desativar'))
        .addSubcommand(sub => sub.setName('status').setDescription('Ver status')),
    category: 'config',
    cooldown: 5,
    guildOnly: true,
    userPermissions: ['ManageRoles'],
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        const config = loadConfig();
        
        if (sub === 'set') {
            const role = interaction.options.getRole('cargo');
            if (role.position >= interaction.guild.members.me.roles.highest.position) {
                return interaction.reply({ content: 'Cargo muito alto para eu dar!', ephemeral: true });
            }
            config[interaction.guild.id] = role.id;
            saveConfig(config);
            await interaction.reply({ embeds: [EmbedUtils.success('Configurado!', `Novos membros receberão ${role}`)] });
        } else if (sub === 'disable') {
            delete config[interaction.guild.id];
            saveConfig(config);
            await interaction.reply({ embeds: [EmbedUtils.success('Desativado', 'Autorole desativado.')] });
        } else {
            const roleId = config[interaction.guild.id];
            if (!roleId) {
                await interaction.reply({ embeds: [EmbedUtils.info('Status', '❌ Desativado')] });
            } else {
                const role = interaction.guild.roles.cache.get(roleId);
                await interaction.reply({ embeds: [EmbedUtils.info('Status', role ? `✅ Ativado: ${role}` : '⚠️ Cargo não existe!')] });
            }
        }
    }
};
