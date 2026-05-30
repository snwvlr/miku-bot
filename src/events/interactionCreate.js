const { Collection, InteractionType, PermissionsBitField } = require('discord.js');
const logger = require('../utils/logger');
const EmbedUtils = require('../utils/embed');

module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {
        // Slash Commands e Context Menus
        if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) {
                return interaction.reply({
                    content: 'Comando não encontrado! 😅',
                    ephemeral: true
                });
            }

            // Log
            logger.command(
                interaction.user.tag,
                interaction.commandName,
                interaction.guild?.name
            );

            try {
                // Verificações

                // Guild only
                if (command.guildOnly && !interaction.guild) {
                    return interaction.reply({
                        content: 'Esse comando só funciona em servidores! 🏠',
                        ephemeral: true
                    });
                }

                // Owner only
                if (command.ownerOnly) {
                    const ownerId = process.env.OWNER_ID;
                    if (!ownerId) {
                        return interaction.reply({
                            content: '⚠️ OWNER_ID não configurado no .env!',
                            ephemeral: true
                        });
                    }
                    if (interaction.user.id !== ownerId) {
                        return interaction.reply({
                            content: 'Hmph! Esse comando é só do meu mestre! 😤💢',
                            ephemeral: true
                        });
                    }
                }

                // Permissões do usuário
                if (command.userPermissions && interaction.guild) {
                    const perms = command.userPermissions;
                    const memberPerms = interaction.member.permissions;

                    const missing = perms.filter(p => !memberPerms.has(PermissionsBitField.Flags[p]));
                    if (missing.length > 0) {
                        return interaction.reply({
                            content: `Você precisa das permissões: ${missing.join(', ')}`,
                            ephemeral: true
                        });
                    }
                }

                // Permissões do bot
                if (command.botPermissions && interaction.guild) {
                    const perms = command.botPermissions;
                    const botPerms = interaction.guild.members.me.permissions;

                    const missing = perms.filter(p => !botPerms.has(PermissionsBitField.Flags[p]));
                    if (missing.length > 0) {
                        return interaction.reply({
                            content: `Eu preciso das permissões: ${missing.join(', ')}`,
                            ephemeral: true
                        });
                    }
                }

                // Cooldown
                const cooldownAmount = (command.cooldown || 3) * 1000;
                const cooldownKey = `${interaction.user.id}-${interaction.commandName}`;

                if (!client.cooldowns) client.cooldowns = new Collection();

                if (client.cooldowns.has(cooldownKey)) {
                    const expirationTime = client.cooldowns.get(cooldownKey);
                    if (Date.now() < expirationTime) {
                        const timeLeft = ((expirationTime - Date.now()) / 1000).toFixed(1);
                        return interaction.reply({
                            content: `Calma aí! Espera ${timeLeft}s pra usar esse comando de novo~ ⏳`,
                            ephemeral: true
                        });
                    }
                }

                client.cooldowns.set(cooldownKey, Date.now() + cooldownAmount);
                setTimeout(() => client.cooldowns.delete(cooldownKey), cooldownAmount);

                // Executar comando
                await command.execute(interaction, client);

            } catch (error) {
                logger.error(`Erro no comando ${interaction.commandName}:`, error);

                const errorMessage = {
                    content: 'Ops! Algo deu errado... 😅 Tenta de novo?',
                    ephemeral: true
                };

                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorMessage).catch(() => {});
                } else {
                    await interaction.reply(errorMessage).catch(() => {});
                }
            }
        }

        // Autocomplete
        else if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
            const command = client.commands.get(interaction.commandName);
            if (command && command.autocomplete) {
                try {
                    await command.autocomplete(interaction, client);
                } catch (error) {
                    logger.error('Erro no autocomplete:', error);
                }
            }
        }

        // Buttons
        else if (interaction.isButton()) {
            // Handle buttons se necessário
        }

        // Select Menus
        else if (interaction.isStringSelectMenu()) {
            // Handle select menus se necessário
        }

        // Modals
        else if (interaction.type === InteractionType.ModalSubmit) {
            // Handle modals se necessário
        }
    }
};
