require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

// Função recursiva para carregar comandos
function loadCommands(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            loadCommands(filePath);
        } else if (file.endsWith('.js')) {
            try {
                delete require.cache[require.resolve(filePath)];
                const command = require(filePath);
                
                if (command.data) {
                    commands.push(command.data.toJSON());
                    console.log(chalk.green(`✓ ${command.data.name}`));
                }
            } catch (error) {
                console.log(chalk.red(`✗ ${file}: ${error.message}`));
            }
        }
    }
}

console.log(chalk.cyan('\n🔄 Carregando comandos...\n'));
loadCommands(commandsPath);

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log(chalk.cyan(`\n📤 Registrando ${commands.length} comandos...\n`));

        // Deploy para guild específica
        if (process.env.GUILD_ID) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commands }
            );
            console.log(chalk.green(`✅ ${commands.length} comandos registrados na guild!`));
        } else {
            // Deploy global
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands }
            );
            console.log(chalk.green(`✅ ${commands.length} comandos registrados globalmente!`));
        }

    } catch (error) {
        console.error(chalk.red('\n❌ Erro ao registrar comandos:'), error);
    }
})();
