const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servers')
        .setDescription('🌐 Ver lista de servidores')
        .addIntegerOption(opt =>
            opt.setName('pagina')
                .setDescription('Página da lista')
                .setMinValue(1))
        .addStringOption(opt =>
            opt.setName('buscar')
                .setDescription('Buscar servidor por nome')),
    category: 'owner',
    cooldown: 10,
    guildOnly: false,
    ownerOnly: true,
    async execute(interaction) {
        const client = interaction.client;
        const searchQuery = interaction.options.getString('buscar');
        let page = interaction.options.getInteger('pagina') || 1;
        const itemsPerPage = 10;
        
        let guilds = [...client.guilds.cache.values()];
        
        // Filtrar por busca se especificado
        if (searchQuery) {
            guilds = guilds.filter(g => 
                g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                g.id.includes(searchQuery)
            );
        }
        
        // Ordenar por quantidade de membros
        guilds.sort((a, b) => b.memberCount - a.memberCount);
        
        const totalPages = Math.ceil(guilds.length / itemsPerPage) || 1;
        page = Math.min(page, totalPages);
        
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageGuilds = guilds.slice(startIndex, endIndex);
        
        const totalMembers = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);
        
        const embed = new EmbedBuilder()
            .setColor('#FFD700')
            .setTitle('🌐 Lista de Servidores')
            .setDescription(searchQuery ? `🔍 Resultados para: **${searchQuery}**` : null)
            .addFields({
                name: '📊 Estatísticas Gerais',
                value: [
                    `**Total de Servidores:** ${client.guilds.cache.size}`,
                    `**Total de Membros:** ${totalMembers.toLocaleString()}`,
                    `**Média por Servidor:** ${Math.round(totalMembers / client.guilds.cache.size)}`
                ].join('\n'),
                inline: false
            })
            .setFooter({ text: `Página ${page}/${totalPages} • ${guilds.length} servidor(es)` })
            .setTimestamp();
        
        if (pageGuilds.length > 0) {
            const serverList = pageGuilds.map((guild, index) => {
                const position = startIndex + index + 1;
                const owner = guild.ownerId;
                return [
                    `**${position}. ${guild.name}**`,
                    `├ 👥 ${guild.memberCount.toLocaleString()} membros`,
                    `├ 🆔 \`${guild.id}\``,
                    `└ 👑 <@${owner}>`
                ].join('\n');
            }).join('\n\n');
            
            embed.addFields({ name: '📋 Servidores', value: serverList, inline: false });
        } else {
            embed.addFields({ name: '📋 Servidores', value: 'Nenhum servidor encontrado.', inline: false });
        }
        
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`servers_first_${interaction.user.id}`)
                .setEmoji('⏮️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(page === 1),
            new ButtonBuilder()
                .setCustomId(`servers_prev_${interaction.user.id}`)
                .setEmoji('◀️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === 1),
            new ButtonBuilder()
                .setCustomId(`servers_page_${interaction.user.id}`)
                .setLabel(`${page}/${totalPages}`)
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),
            new ButtonBuilder()
                .setCustomId(`servers_next_${interaction.user.id}`)
                .setEmoji('▶️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(page === totalPages),
            new ButtonBuilder()
                .setCustomId(`servers_last_${interaction.user.id}`)
                .setEmoji('⏭️')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(page === totalPages)
        );
        
        const response = await interaction.reply({ embeds: [embed], components: [row], ephemeral: true, fetchReply: true });
        
        // Collector para os botões
        const collector = response.createMessageComponentCollector({
            filter: i => i.user.id === interaction.user.id,
            time: 120000
        });
        
        collector.on('collect', async i => {
            const action = i.customId.split('_')[1];
            
            if (action === 'first') page = 1;
            else if (action === 'prev') page = Math.max(1, page - 1);
            else if (action === 'next') page = Math.min(totalPages, page + 1);
            else if (action === 'last') page = totalPages;
            
            const newStartIndex = (page - 1) * itemsPerPage;
            const newEndIndex = newStartIndex + itemsPerPage;
            const newPageGuilds = guilds.slice(newStartIndex, newEndIndex);
            
            const newEmbed = EmbedBuilder.from(embed)
                .setFields(
                    {
                        name: '📊 Estatísticas Gerais',
                        value: [
                            `**Total de Servidores:** ${client.guilds.cache.size}`,
                            `**Total de Membros:** ${totalMembers.toLocaleString()}`,
                            `**Média por Servidor:** ${Math.round(totalMembers / client.guilds.cache.size)}`
                        ].join('\n'),
                        inline: false
                    }
                )
                .setFooter({ text: `Página ${page}/${totalPages} • ${guilds.length} servidor(es)` });
            
            if (newPageGuilds.length > 0) {
                const serverList = newPageGuilds.map((guild, index) => {
                    const position = newStartIndex + index + 1;
                    return [
                        `**${position}. ${guild.name}**`,
                        `├ 👥 ${guild.memberCount.toLocaleString()} membros`,
                        `├ 🆔 \`${guild.id}\``,
                        `└ 👑 <@${guild.ownerId}>`
                    ].join('\n');
                }).join('\n\n');
                
                newEmbed.addFields({ name: '📋 Servidores', value: serverList, inline: false });
            }
            
            const newRow = ActionRowBuilder.from(row).setComponents(
                ButtonBuilder.from(row.components[0]).setDisabled(page === 1),
                ButtonBuilder.from(row.components[1]).setDisabled(page === 1),
                ButtonBuilder.from(row.components[2]).setLabel(`${page}/${totalPages}`),
                ButtonBuilder.from(row.components[3]).setDisabled(page === totalPages),
                ButtonBuilder.from(row.components[4]).setDisabled(page === totalPages)
            );
            
            await i.update({ embeds: [newEmbed], components: [newRow] });
        });
        
        collector.on('end', async () => {
            const disabledRow = ActionRowBuilder.from(row).setComponents(
                row.components.map(c => ButtonBuilder.from(c).setDisabled(true))
            );
            await interaction.editReply({ components: [disabledRow] }).catch(() => {});
        });
    }
};
