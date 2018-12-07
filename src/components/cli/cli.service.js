const cliHelpers = require('../../helpers/cli.helper');
const v8 = require('v8');
const os = require('os');
const usersService = require('../users/users.service');
const checkService = require('../checks/checks.service');
const logsService = require('../logs/logs.service');
const COMMANDS = require('./commands');

class CliService {
	constructor() {
		this.commandsDescriptions = {
			[COMMANDS.exit]: 'Kill the cli (and whole app)',
			[COMMANDS.man]: 'Display available commands for that cli',
			[COMMANDS.help]: 'Alias for "man"',
			[COMMANDS.stats]: 'Shows statistic for computer resources, that are consumed and available',
			[COMMANDS.users]: 'Show list of all available users',
			[`${COMMANDS.moreUserInfo} --{userId}`] : 'Show info for particular user',
			[`${COMMANDS.listChecks} --up --down`]: 'Show list of all checks ("--up" and "--down" are optional)',
			[`${COMMANDS.moreCheckInfo} --{checkId}`]: 'Show info for particular check',
			[`${COMMANDS.listLogs} --compressed --uncompressed`]: 'Show list of all logs (compressed and uncompressed)',
			[`${COMMANDS.moreLogInfo} --{logId}`] : 'Show info for particular log',
		};
	}

	help() {
		cliHelpers.horizontalLine();
		cliHelpers.centered('CLI Manual');
		cliHelpers.horizontalLine();
		cliHelpers.verticalSpace(2);

		cliHelpers.renderList(this.commandsDescriptions);

		cliHelpers.verticalSpace(1);
		cliHelpers.horizontalLine();
	}

	stats() {

		const v8Stats = v8.getHeapStatistics();

		const stats = {
			'Load Average': os.loadavg().join(' '),
			'CPU Count': os.cpus().length,
			'Free memory': os.freemem(),
			'Current Malloced Memory': v8Stats.malloced_memory,
			'Peak Malloced Memory': v8Stats.peak_malloced_memory,
			'Allocated Heap Used (%)': Math.round(v8Stats.used_heap_size / v8Stats.total_heap_size * 100),
			'Available Heap Allocated (%)': Math.round(v8Stats.total_heap_size / v8Stats.heap_size_limit * 100),
			'Uptime': os.uptime() + ' seconds'
		};

		cliHelpers.header('Stats');

		cliHelpers.renderList(stats);
	}

	async listUsers() {
		cliHelpers.header('All users');

		try  {
			const users = await usersService.findAll();

			users.forEach(user => {
				console.log(cliHelpers.renderObject(user));
			});
		} catch (e) {
			cliHelpers.error('Failed to load user\' info', e);
		}
	}

	async moreUserInfo(userId) {
		if(userId) {
			if(userId.indexOf('@') !== -1) {
				try {
					const user = await usersService.findByEmail(userId);
					cliHelpers.header('User Info');
					console.dir(user, { colors: true });
				} catch (e) {
					cliHelpers.error('Failed to get user by email', e);
				}
			} else {
				try {
					const user = await usersService.findById(userId);
					cliHelpers.header('User Info');
					console.log(cliHelpers.renderObject(user));
				} catch (e) {
					cliHelpers.error('Failed to get user by ID', e);
				}
			}
		} else {
			cliHelpers.error('Invalid user\'s credentials');
		}

	}

	async listChecks() {

		try {
      const checks = await checkService.findAll();

      cliHelpers.renderArray(checks);
		} catch (e) {
			cliHelpers.error('Failed to load checks', e);
    }
	}

	async moreCheckInfo(checkId) {

		if(checkId) {
			try {
        const userIds = await usersService.findAllUserIds();
        let check;
        await Promise.all(userIds.map(async userId => {
          check = await checkService.findOne(userId, checkId);
        }));

        if(!check) {
          console.log('Failed to get check by ID');
					return;
        }

        console.dir(cliHelpers.renderObject(check));

			} catch (e) {
				console.log('Failed to get check by ID', e);
			}
		} else {
			cliHelpers.error('Invalid check\'s ID');
		}
	}

	async listChecksByUserId(userId) {
		if(userId) {
      cliHelpers.header('All checks for userId', userId);
			try {
				const checks = await checkService.findByUserId(userId);

				if(checks.length === 0) {
					cliHelpers.centered('No checks found');
					return;
				}

				cliHelpers.renderArray(checks);

			} catch (e) {
				cliHelpers.error('Failed to load checks for particular user', e);
      }
		}
	}

	async listLogs() {
		cliHelpers.header('ALL LOGS');

		try {
      const logs = await logsService.findAllUncompressedLogs();
      cliHelpers.renderArray(logs);
		} catch (e) {
      cliHelpers.error('Failed to load log\'s list', e);
    }

	}

	async moreLogInfo(logId) {
		cliHelpers.header('Logs for', logId);
		if(logId) {
			try {
				const logList = await logsService.findUncompressedLog(logId);
				cliHelpers.renderArray(logList);
			} catch (e) {
				cliHelpers.error('Failed to load log', e);
			}
		} else {
			cliHelpers.error('Invalid log\'s ID');
		}
	}

	async moreCompressedLogInfo(logId) {
		cliHelpers.header('Logs for', logId);
		if(logId) {
			try {
				const logList = await logsService.findCompressedLog(logId);
				cliHelpers.renderArray(logList);
			} catch (e) {
				cliHelpers.error('Failed to load log', e);
			}
		} else {
			cliHelpers.error('Invalid log\'s ID');
		}
	}

	async listCompressedLogs() {
		cliHelpers.header('All compressed logs');

		try {
			const logs = await logsService.findAllCompressedLogs();
			cliHelpers.renderArray(logs);
		} catch (e) {
			cliHelpers.error('Failed to load compressed log\'s list', e);
		}
	}
}

module.exports = new CliService();