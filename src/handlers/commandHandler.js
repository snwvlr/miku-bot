const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

module.exports = (client) => {
    const commandsPath = path.join(__dirname, '..', 'commands');
    let slashCount = 0;
    let contextCount = 0;

    // Função recursiva para carregar comandos
    function loadCommands(dir, type = 'slash') {
        const files = fs.readdirSync(dir);

        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                loadCommands(filePath, type);
            } else if (file.endsWith('.js')) {
                try {
                    // Limpar cache se existir
                    delete require.cache[require.resolve(filePath)];
                    
                    const command = require(filePath);
                    
                    if (command.data && command.data.name) {
                        client.commands.set(command.data.name, command);
                        
                        if (type === 'context') {
                            contextCount++;
                        } else {
                            slashCount++;
                        }
                    } else {
                        logger.warn(`Comando sem data.name: ${filePath}`);
                    }
                } catch (error) {
                    logger.error(`Erro ao carregar ${filePath}:`, error.message);
                }
            }
        }
    }

    // Carregar comandos slash
    const slashPath = path.join(commandsPath, 'slash');
    if (fs.existsSync(slashPath)) {
        loadCommands(slashPath, 'slash');
    }

    // Carregar context menus
    const contextPath = path.join(commandsPath, 'context');
    if (fs.existsSync(contextPath)) {
        loadCommands(contextPath, 'context');
    }

    logger.info(`Carregados ${slashCount} comandos slash e ${contextCount} context menus`);
};
