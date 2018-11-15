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
			}
		} else {
			const args = {};

			for(let i = 0; i < commandsArray.length; i++) {
				const word = commandsArray[i];
				if(word.indexOf('--') !== -1) {
					args[word.replace(/--/,'')] = commandsArray[i + 1];
				}
			}

			switch (commandsArray[0]) {
				case COMMANDS.users:
					this.emitter.emit(COMMANDS.moreUserInfo, args.id);
					break;
				case COMMANDS.checks:
					if(args.checkId) {
            this.emitter.emit(COMMANDS.moreCheckInfo, args.checkId);
					} else if(args.userId) {
						this.emitter.emit(COMMANDS.checksByUserId, args.userId);
					}
					break;
			}
		}
	}

	registerHandlers() {
    this.emitter.on(COMMANDS.help, cliService.help);

    this.emitter.on(COMMANDS.stats, cliService.stats);

    this.emitter.on(COMMANDS.users, cliService.listUsers);

    this.emitter.on(COMMANDS.moreUserInfo, cliService.moreUserInfo);

    this.emitter.on(COMMANDS.checks, cliService.listChecks);

    this.emitter.on(COMMANDS.moreCheckInfo, cliService.moreCheckInfo);

    this.emitter.on(COMMANDS.checksByUserId, cliService.listChecksByUserId);
  }

	run() {
		this.interface.prompt('>');
	}
}

module.exports = CliHandler;