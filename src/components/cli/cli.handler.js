const readline = require('readline');
const cliService = require('./cli.service');
const { EventEmitter } = require('events');
const COMMANDS = require('./commands');

class CliHandler {
	constructor() {
		this.interface = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
		this.emitter = new EventEmitter();
		this.processInput = this.processInput.bind(this);
		this.interface.on('line', this.processInput);

		this.registerHandlers();
	}

	processInput(string) {
		const commandsArray = string.trim().split(' ');

		if(commandsArray.length === 1) {
			switch (commandsArray[0]) {
				case COMMANDS.help:
					this.emitter.emit(COMMANDS.help);
					break;
				case COMMANDS.exit:
					process.exit(0);
					break;
				case COMMANDS.stats:
					this.emitter.emit(COMMANDS.stats);
					break;
				case COMMANDS.users:
					this.emitter.emit(COMMANDS.users);
					break;
				case COMMANDS.checks:
					this.emitter.emit(COMMANDS.checks);
					break;
        case COMMANDS.logs:
	        this.emitter.emit(COMMANDS.logs);
			}
		} else {
			const args = {};

			for(let i = 0; i < commandsArray.length; i++) {
				const word = commandsArray[i];
				if(word.indexOf('--') !== -1) {
					args[word.replace(/--/,'')] = commandsArray[i + 1] || true;
				}
			}

			switch (commandsArray[0]) {
				case COMMANDS.users:
					this.emitter.emit(COMMANDS.moreUserInfo, args.id);
					break;
				case COMMANDS.checks:
					if(args.id) {
            this.emitter.emit(COMMANDS.moreCheckInfo, args.id);
					} else if(args.userId) {
						this.emitter.emit(COMMANDS.checksByUserId, args.userId);
					}
					break;
				case COMMANDS.logs:
					if(string.indexOf('compressed') !== -1 && args.id) {
						this.emitter.emit(COMMANDS.moreCompressedLogInfo, args.id);
					} else if(string.indexOf('compressed') !== -1) {
						this.emitter.emit(COMMANDS.compressedLogs);
					} else {
						this.emitter.emit(COMMANDS.moreLogInfo, args.id);
					}
			}
		}
	}

	registerHandlers() {
    this.emitter.on(COMMANDS.help, cliService.help);

    this.emitter.on(COMMANDS.stats, cliService.stats);

    this.emitter.on(COMMANDS.users, cliService.listUsers);

    this.emitter.on(COMMANDS.logs, cliService.listLogs);

    this.emitter.on(COMMANDS.compressedLogs, cliService.listCompressedLogs);

    this.emitter.on(COMMANDS.moreUserInfo, cliService.moreUserInfo);

    this.emitter.on(COMMANDS.checks, cliService.listChecks);

    this.emitter.on(COMMANDS.moreCheckInfo, cliService.moreCheckInfo);

		this.emitter.on(COMMANDS.moreLogInfo, cliService.moreLogInfo);

		this.emitter.on(COMMANDS.moreCompressedLogInfo, cliService.moreCompressedLogInfo);

    this.emitter.on(COMMANDS.checksByUserId, cliService.listChecksByUserId);
  }

	run() {
		this.interface.prompt('>');
	}
}

module.exports = CliHandler;