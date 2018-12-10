const { fork } = require('child_process');
const Files = require('./helpers/files.helper');
const path = require('path');
const config = require('./config');

const files = new Files(config.dataDir);

class Workers {
	async run() {
		const usersDirectories = await files.filesList('checks');
		usersDirectories.forEach(dir => {
			fork(path.join(__dirname, 'childWorker.js'), [dir]);
		});
	}
}

module.exports = new Workers();