const { ActivityType } = require('discord.js');
const logger = require('../utils/logger');

module.exports = {
    name: 'ready',
    once: true,

    async execute(client) {
        const botName = process.env.BOT_NAME || client.user.username;
        
        // Log bonito
        logger.ready(
            botName,
            client.guilds.cache.size,
            client.users.cache.size
        );

        // Status rotativo
        const activities = [
            { name: 'me menciona pra conversar! 💬', type: ActivityType.Custom },
            { name: `${client.guilds.cache.size} servidores`, type: ActivityType.Watching },
            { name: '/help para comandos', type: ActivityType.Playing },
            { name: 'música lo-fi 🎵', type: ActivityType.Listening },
            { name: 'com meu mestre 💕', type: ActivityType.Playing },
            { name: 'animes e jogos', type: ActivityType.Watching },
            { name: `${client.commands.size} comandos!`, type: ActivityType.Playing },
        ];

        let i = 0;
        const updateStatus = () => {
            const activity = activities[i % activities.length];
            client.user.setActivity(activity.name, { type: activity.type });
            i++;
        };

        updateStatus();
        setInterval(updateStatus, 30000); // 30 segundos

        // Criar pasta data se não existir
        const fs = require('fs');
        const path = require('path');
        const dataPath = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath, { recursive: true });
        }
    }
};
