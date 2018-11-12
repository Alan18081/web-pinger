const { fork } = require('child_process');
const Files = require('./helpers/files.helper');

const files = new Files('.data');

class Workers {
	async runWorkers() {
		const usersDirectories = await files.filesList('checks');
		usersDirectories.forEach(dir => {
			fork('./childWorker.js', [dir]);
		});
	}
}

const workers = new Workers();

workers.runWorkers();