const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('🏷️ Gerenciar cargos')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
        .addSubcommand(sub => sub.setName('add').setDescription('Adicionar cargo')
            .addUserOption(opt => opt.setName('usuario').setDescription('Usuário').setRequired(true))
            .addRoleOption(opt => opt.setName('cargo').setDescription('Cargo').setRequired(true)))
        .addSubcommand(sub => sub.setName('remove').setDescription('Remover cargo')
            .addUserOption(opt => opt.setName('usuario').setDescription('Usuário').setRequired(true))
            .addRoleOption(opt => opt.setName('cargo').setDescription('Cargo').setRequired(true)))
        .addSubcommand(sub => sub.setName('info').setDescription('Info do cargo')
            .addRoleOption(opt => opt.setName('cargo').setDescription('Cargo').setRequired(true))),
    category: 'moderation',
    cooldown: 3,
    guildOnly: true,
    userPermissions: ['ManageRoles'],
    botPermissions: ['ManageRoles'],
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        
        if (sub === 'add' || sub === 'remove') {
            const target = interaction.options.getUser('usuario');
            const role = interaction.options.getRole('cargo');
            const member = interaction.guild.members.cache.get(target.id);
            if (!member) return interaction.reply({ content: 'Usuário não no servidor!', ephemeral: true });
            if (role.position >= interaction.member.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
                return interaction.reply({ content: 'Cargo muito alto!', ephemeral: true });
            }
            if (role.position >= interaction.guild.members.me.roles.highest.position) return interaction.reply({ content: 'Não posso gerenciar esse cargo!', ephemeral: true });
            if (role.managed) return interaction.reply({ content: 'Cargo de integração!', ephemeral: true });
            
            if (sub === 'add') {
                if (member.roles.cache.has(role.id)) return interaction.reply({ content: 'Já tem esse cargo!', ephemeral: true });
                await member.roles.add(role);
                await interaction.reply({ embeds: [EmbedUtils.success('Cargo Adicionado', `${role} → **${target.tag}**`)] });
            } else {
                if (!member.roles.cache.has(role.id)) return interaction.reply({ content: 'Não tem esse cargo!', ephemeral: true });
                await member.roles.remove(role);
                await interaction.reply({ embeds: [EmbedUtils.success('Cargo Removido', `${role} ✕ **${target.tag}**`)] });
            }
        } else {
            const role = interaction.options.getRole('cargo');
            await interaction.reply({ embeds: [EmbedUtils.create({
                title: `🏷️ ${role.name}`,
                color: role.color || EmbedUtils.colors.primary,
                fields: [
                    { name: 'ID', value: `\`${role.id}\``, inline: true },
                    { name: 'Cor', value: role.hexColor, inline: true },
                    { name: 'Membros', value: `${role.members.size}`, inline: true },
                    { name: 'Posição', value: `${role.position}`, inline: true },
                    { name: 'Mencionável', value: role.mentionable ? 'Sim' : 'Não', inline: true },
                    { name: 'Criado', value: `<t:${Math.floor(role.createdTimestamp/1000)}:R>`, inline: true },
                ]
            })] });
        }
    }
};
