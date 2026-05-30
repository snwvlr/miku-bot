const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const EmbedUtils = require('../../../utils/embed');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emoji')
        .setDescription('😀 Gerenciar emojis')
        .addSubcommand(sub => sub.setName('add').setDescription('Adicionar emoji')
            .addStringOption(opt => opt.setName('nome').setDescription('Nome').setRequired(true).setMinLength(2).setMaxLength(32))
            .addAttachmentOption(opt => opt.setName('imagem').setDescription('Imagem'))
            .addStringOption(opt => opt.setName('url').setDescription('URL da imagem')))
        .addSubcommand(sub => sub.setName('remove').setDescription('Remover emoji')
            .addStringOption(opt => opt.setName('emoji').setDescription('Emoji').setRequired(true)))
        .addSubcommand(sub => sub.setName('list').setDescription('Listar emojis')),
    category: 'utility',
    cooldown: 5,
    guildOnly: true,
    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        
        if (sub === 'add') {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuildExpressions)) {
                return interaction.reply({ content: 'Sem permissão!', ephemeral: true });
            }
            const name = interaction.options.getString('nome').replace(/[^a-zA-Z0-9_]/g, '_');
            const attachment = interaction.options.getAttachment('imagem');
            const url = interaction.options.getString('url');
            if (!attachment && !url) return interaction.reply({ content: 'Forneça imagem ou URL!', ephemeral: true });
            await interaction.deferReply();
            try {
                const emoji = await interaction.guild.emojis.create({ attachment: attachment?.url || url, name });
                await interaction.editReply({ embeds: [EmbedUtils.success('Emoji Adicionado', `${emoji} \`:${emoji.name}:\``)] });
            } catch (e) {
                let msg = 'Erro!';
                if (e.code === 30008) msg = 'Limite atingido!';
                if (e.code === 50035) msg = 'Imagem inválida!';
                await interaction.editReply(msg);
            }
        } else if (sub === 'remove') {
            if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuildExpressions)) {
                return interaction.reply({ content: 'Sem permissão!', ephemeral: true });
            }
            const emojiStr = interaction.options.getString('emoji');
            const match = emojiStr.match(/<a?:(\w+):(\d+)>/);
            if (!match) return interaction.reply({ content: 'Emoji inválido!', ephemeral: true });
            const emoji = interaction.guild.emojis.cache.get(match[2]);
            if (!emoji) return interaction.reply({ content: 'Não encontrado!', ephemeral: true });
            const name = emoji.name;
            await emoji.delete();
            await interaction.reply({ embeds: [EmbedUtils.success('Emoji Removido', `\`:${name}:\``)] });
        } else {
            const emojis = interaction.guild.emojis.cache;
            const staticE = emojis.filter(e => !e.animated);
            const animatedE = emojis.filter(e => e.animated);
            const embed = EmbedUtils.create({
                title: `😀 Emojis [${emojis.size}]`,
                color: EmbedUtils.colors.primary,
                fields: [
                    { name: `🖼️ Estáticos [${staticE.size}]`, value: staticE.map(e => e.toString()).slice(0, 40).join(' ') || 'Nenhum' },
                    { name: `✨ Animados [${animatedE.size}]`, value: animatedE.map(e => e.toString()).slice(0, 40).join(' ') || 'Nenhum' }
                ]
            });
            await interaction.reply({ embeds: [embed] });
        }
    }
};
