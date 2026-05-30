require('dotenv').config();

const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const logger = require('./utils/logger');

// Criar cliente
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction,
    ],
    allowedMentions: { parse: ['users', 'roles'], repliedUser: true }
});

// Collections
client.commands = new Collection();
client.cooldowns = new Collection();
client.chatHistory = new Collection();

// Carregar handlers
require('./handlers/commandHandler')(client);
require('./handlers/eventHandler')(client);

// Error handling
process.on('unhandledRejection', (error) => {
    logger.error('Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', error);
});

// Login
client.login(process.env.DISCORD_TOKEN)
    .catch(err => {
        logger.error('Falha ao fazer login:', err.message);
        process.exit(1);
    });
