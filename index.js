const server = require('./server');
const workers = require('./workers');
const cli = require('./lib/cli');
const cluster = require('cluster');
const os = require('os');

const app = {
	init() {
		if(cluster.isMaster) {
			workers.run();

			setTimeout(() => {
				cli.init();
			}, 50);

			for(let i = 0; i < os.cpus().length; i++) {
				cluster.fork();
			}
		} else {
			server.run();
		}
	}
};


if(require.main === module) {
  app.init();
}

module.exports = app;