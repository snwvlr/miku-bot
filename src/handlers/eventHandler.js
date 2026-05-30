const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

module.exports = (client) => {
    const eventsPath = path.join(__dirname, '..', 'events');
    
    if (!fs.existsSync(eventsPath)) {
        logger.warn('Pasta de eventos não encontrada');
        return;
    }

    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        try {
            const filePath = path.join(eventsPath, file);
            delete require.cache[require.resolve(filePath)];
            
            const event = require(filePath);
            const eventName = event.name || file.replace('.js', '');

            if (event.once) {
                client.once(eventName, (...args) => event.execute(...args, client));
            } else {
                client.on(eventName, (...args) => event.execute(...args, client));
            }

            logger.info(`Evento carregado: ${eventName}`);
        } catch (error) {
            logger.error(`Erro ao carregar evento ${file}:`, error.message);
        }
    }
};
