const { fork } = require('child_process');
const Files = require('./helpers/files.helper');

const files = new Files('.data');

class Workers {
	async run() {
		const usersDirectories = await files.filesList('checks');
		usersDirectories.forEach(dir => {
			fork('./childWorker.js', [dir]);
		});
	}
}

module.exports = new Workers();