const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nick')
        .setDescription('📝 Alterar apelido')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
        .addUserOption(opt => opt.setName('usuario').setDescription('Usuário').setRequired(true))
        .addStringOption(opt => opt.setName('apelido').setDescription('Novo apelido (vazio=remover)').setMaxLength(32)),
    category: 'moderation',
    cooldown: 3,
    guildOnly: true,
    userPermissions: ['ManageNicknames'],
    botPermissions: ['ManageNicknames'],
    async execute(interaction) {
        const target = interaction.options.getUser('usuario');
        const newNick = interaction.options.getString('apelido');
        const member = interaction.guild.members.cache.get(target.id);
        if (!member) return interaction.reply({ content: 'Usuário não está no servidor!', ephemeral: true });
        if (!member.manageable) return interaction.reply({ content: 'Não posso alterar esse apelido!', ephemeral: true });
        
        const oldNick = member.nickname || target.username;
        await member.setNickname(newNick || null);
        
        if (newNick) await interaction.reply({ embeds: [EmbedUtils.success('Apelido Alterado', `**${oldNick}** → **${newNick}**`)] });
        else await interaction.reply({ embeds: [EmbedUtils.success('Apelido Removido', `Apelido de **${target.tag}** foi removido.`)] });
    }
};
