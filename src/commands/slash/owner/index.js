// Exporta todos os comandos da pasta owner
const status = require('./status');
const say = require('./falar');
const dm = require('./dm');
const reload = require('./reload');
const servers = require('./servers');
const personality = require('./personality');

module.exports = {
    status,
    say,
    dm,
    reload,
    servers,
    personality
};
