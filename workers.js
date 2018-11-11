const { fork } = require('child_process');
const files = require('./helpers/files.helper');

class Workers {
	constructor() {

	}

	async runWorkers() {
		const usersDirectories = await files.filesList('checks');
		usersDirectories.forEach(dir => {
			fork('./childWorker.js', [dir]);
		});
	}
}

const workers = new Workers();

workers.runWorkers();