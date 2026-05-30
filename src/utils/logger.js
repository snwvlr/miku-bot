const chalk = require('chalk');

class Logger {
    constructor() {
        this.debug = process.env.DEBUG_MODE === 'true';
    }

    getTimestamp() {
        return new Date().toLocaleTimeString('pt-BR');
    }

    info(message, ...args) {
        console.log(
            chalk.gray(`[${this.getTimestamp()}]`),
            chalk.cyan('ℹ INFO'),
            chalk.white(message),
            ...args
        );
    }

    success(message, ...args) {
        console.log(
            chalk.gray(`[${this.getTimestamp()}]`),
            chalk.green('✓ OK'),
            chalk.white(message),
            ...args
        );
    }

    warn(message, ...args) {
        console.log(
            chalk.gray(`[${this.getTimestamp()}]`),
            chalk.yellow('⚠ WARN'),
            chalk.white(message),
            ...args
        );
    }

    error(message, ...args) {
        console.log(
            chalk.gray(`[${this.getTimestamp()}]`),
            chalk.red('✖ ERROR'),
            chalk.white(message),
            ...args
        );
    }

    debug(message, ...args) {
        if (this.debug) {
            console.log(
                chalk.gray(`[${this.getTimestamp()}]`),
                chalk.magenta('🔧 DEBUG'),
                chalk.gray(message),
                ...args
            );
        }
    }

    command(user, command, guild) {
        console.log(
            chalk.gray(`[${this.getTimestamp()}]`),
            chalk.blue('⌘ CMD'),
            chalk.cyan(command),
            chalk.gray('por'),
            chalk.yellow(user),
            chalk.gray('em'),
            chalk.green(guild || 'DM')
        );
    }

    ready(botName, guilds, users) {
        console.log('');
        console.log(chalk.magenta('═══════════════════════════════════════════════'));
        console.log(chalk.magenta(`   🌸 ${botName} está online!`));
        console.log(chalk.magenta('═══════════════════════════════════════════════'));
        console.log(chalk.cyan(`   📊 Servidores: ${guilds}`));
        console.log(chalk.cyan(`   👥 Usuários: ${users}`));
        console.log(chalk.magenta('═══════════════════════════════════════════════'));
        console.log('');
    }
}

module.exports = new Logger();
