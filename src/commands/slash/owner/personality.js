const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

// Personalidade padrão do bot
const DEFAULT_PERSONALITY = {
    name: 'Assistente',
    description: 'Um assistente amigável e prestativo.',
    systemPrompt: 'Você é um assistente amigável e prestativo. Responda de forma clara e objetiva.',
    traits: ['Amigável', 'Prestativo', 'Objetivo']
};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('personality')
        .setDescription('🎭 Gerenciar personalidade do bot')
        .addSubcommand(sub =>
            sub.setName('view')
                .setDescription('👁️ Ver personalidade atual'))
        .addSubcommand(sub =>
            sub.setName('set')
                .setDescription('✏️ Definir nova personalidade')
                .addStringOption(opt =>
                    opt.setName('nome')
                        .setDescription('Nome da personalidade')
                        .setRequired(true)
                        .setMaxLength(50))
                .addStringOption(opt =>
                    opt.setName('descricao')
                        .setDescription('Descrição da personalidade')
                        .setRequired(true)
                        .setMaxLength(500))
                .addStringOption(opt =>
                    opt.setName('prompt')
                        .setDescription('System prompt para a IA')
                        .setRequired(true)
                        .setMaxLength(2000))
                .addStringOption(opt =>
                    opt.setName('traits')
                        .setDescription('Características separadas por vírgula (ex: amigável, engraçado)')
                        .setMaxLength(200)))
        .addSubcommand(sub =>
            sub.setName('reset')
                .setDescription('🔄 Resetar para personalidade padrão'))
        .addSubcommand(sub =>
            sub.setName('name')
                .setDescription('📝 Mudar nome do bot')
                .addStringOption(opt =>
                    opt.setName('novo_nome')
                        .setDescription('Novo nome para o bot')
                        .setRequired(true)
                        .setMinLength(2)
                        .setMaxLength(32))),
    category: 'owner',
    cooldown: 10,
    guildOnly: false,
    ownerOnly: true,
    async execute(interaction) {
        const client = interaction.client;
        const subcommand = interaction.options.getSubcommand();
        
        // Inicializar personalidade se não existir
        if (!client.personality) {
            client.personality = { ...DEFAULT_PERSONALITY };
        }
        
        switch (subcommand) {
            case 'view':
                await handleView(interaction, client);
                break;
            case 'set':
                await handleSet(interaction, client);
                break;
            case 'reset':
                await handleReset(interaction, client);
                break;
            case 'name':
                await handleName(interaction, client);
                break;
        }
    }
};

async function handleView(interaction, client) {
    const personality = client.personality || DEFAULT_PERSONALITY;
    
    const embed = new EmbedBuilder()
        .setColor('#9B59B6')
        .setTitle('🎭 Personalidade Atual')
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .addFields(
            { name: '📛 Nome', value: personality.name, inline: true },
            { name: '🏷️ Bot Name', value: client.user.username, inline: true },
            { name: '\u200B', value: '\u200B', inline: true },
            { name: '📝 Descrição', value: personality.description, inline: false },
            { name: '🧠 System Prompt', value: personality.systemPrompt.length > 1024 
                ? personality.systemPrompt.substring(0, 1021) + '...' 
                : personality.systemPrompt, inline: false },
            { name: '✨ Características', value: personality.traits?.join(', ') || 'Nenhuma definida', inline: false }
        )
        .setFooter({ text: 'Use /personality set para modificar' })
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleSet(interaction, client) {
    const name = interaction.options.getString('nome');
    const description = interaction.options.getString('descricao');
    const systemPrompt = interaction.options.getString('prompt');
    const traitsInput = interaction.options.getString('traits');
    
    const traits = traitsInput 
        ? traitsInput.split(',').map(t => t.trim()).filter(t => t.length > 0)
        : [];
    
    // Salvar nova personalidade
    client.personality = {
        name,
        description,
        systemPrompt,
        traits
    };
    
    const embed = new EmbedBuilder()
        .setColor('#00FF00')
        .setTitle('✅ Personalidade Atualizada')
        .addFields(
            { name: '📛 Nome', value: name, inline: true },
            { name: '📝 Descrição', value: description, inline: false },
            { name: '🧠 System Prompt', value: systemPrompt.length > 1024 
                ? systemPrompt.substring(0, 1021) + '...' 
                : systemPrompt, inline: false },
            { name: '✨ Características', value: traits.length > 0 ? traits.join(', ') : 'Nenhuma definida', inline: false }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleReset(interaction, client) {
    const oldPersonality = client.personality?.name || 'Nenhuma';
    
    // Resetar para padrão
    client.personality = { ...DEFAULT_PERSONALITY };
    
    const embed = new EmbedBuilder()
        .setColor('#FFA500')
        .setTitle('🔄 Personalidade Resetada')
        .setDescription('A personalidade foi resetada para o padrão.')
        .addFields(
            { name: '❌ Personalidade Anterior', value: oldPersonality, inline: true },
            { name: '✅ Personalidade Atual', value: DEFAULT_PERSONALITY.name, inline: true },
            { name: '📝 Descrição', value: DEFAULT_PERSONALITY.description, inline: false }
        )
        .setTimestamp();
    
    await interaction.reply({ embeds: [embed], ephemeral: true });
}

async function handleName(interaction, client) {
    const newName = interaction.options.getString('novo_nome');
    const oldName = client.user.username;
    
    try {
        await client.user.setUsername(newName);
        
        const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('✅ Nome Alterado')
            .addFields(
                { name: '❌ Nome Anterior', value: oldName, inline: true },
                { name: '✅ Novo Nome', value: newName, inline: true }
            )
            .setFooter({ text: '⚠️ O Discord limita mudanças de nome a 2x por hora' })
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('❌ Erro ao Alterar Nome')
            .setDescription('Não foi possível alterar o nome do bot.')
            .addFields(
                { name: 'Erro', value: error.message, inline: false },
                { name: '💡 Dica', value: 'O Discord limita mudanças de username a 2x por hora. Tente novamente mais tarde.', inline: false }
            )
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
}
