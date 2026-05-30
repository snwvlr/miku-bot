const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('🗑️ Limpar mensagens')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .addIntegerOption(opt => opt.setName('quantidade').setDescription('Quantidade (1-100)').setRequired(true).setMinValue(1).setMaxValue(100))
        .addUserOption(opt => opt.setName('usuario').setDescription('Filtrar por usuário'))
        .addStringOption(opt => opt.setName('filtro').setDescription('Filtro').addChoices(
            { name: 'Bots', value: 'bots' },
            { name: 'Humanos', value: 'humans' },
            { name: 'Com imagens', value: 'images' },
            { name: 'Com links', value: 'links' }
        )),
    category: 'moderation',
    cooldown: 5,
    guildOnly: true,
    userPermissions: ['ManageMessages'],
    botPermissions: ['ManageMessages'],
    async execute(interaction) {
        const amount = interaction.options.getInteger('quantidade');
        const targetUser = interaction.options.getUser('usuario');
        const filter = interaction.options.getString('filtro');
        
        await interaction.deferReply({ ephemeral: true });
        
        try {
            let messages = await interaction.channel.messages.fetch({ limit: 100 });
            messages = messages.filter(m => Date.now() - m.createdTimestamp < 14 * 24 * 60 * 60 * 1000);
            
            if (targetUser) messages = messages.filter(m => m.author.id === targetUser.id);
            if (filter === 'bots') messages = messages.filter(m => m.author.bot);
            if (filter === 'humans') messages = messages.filter(m => !m.author.bot);
            if (filter === 'images') messages = messages.filter(m => m.attachments.size > 0);
            if (filter === 'links') messages = messages.filter(m => m.content.includes('http'));
            
            const toDelete = [...messages.values()].slice(0, amount);
            const deleted = await interaction.channel.bulkDelete(toDelete, true);
            
            await interaction.editReply({ content: `🗑️ Deletei **${deleted.size}** mensagens!` });
        } catch (error) {
            await interaction.editReply({ content: 'Erro ao deletar mensagens!' });
        }
    }
};
