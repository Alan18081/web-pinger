const readline = require('readline');
const cliService = require('./cli.service');

class CliHandler {
	constructor() {
		this.interface = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});
		this.processInput = this.processInput.bind(this);
		this.interface.on('line', this.processInput);
	}

	processInput(string) {
		const commandsArray = string.split(' ');
		const { commands } = cliService;

		if(commandsArray.length === 1) {
			switch (commandsArray[0]) {
				case commands.help:
					cliService.help();
					break;
				case commands.exit:
					process.exit(0);
					break;
				case commands.stats:
					cliService.stats();
					break;
				case commands.users:
					cliService.listUsers();
					break;
				case commands.checks:
					cliService.listChecks();
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
				case commands.users:

					cliService.moreUserInfo(args.id);
					break;
				case commands.checks:
					cliService.moreCheckInfo();
					break;
			}
		}
	}

	registerHandlers() {

	}

	run() {
		this.interface.prompt('>');
	}
}

module.exports = CliHandler;