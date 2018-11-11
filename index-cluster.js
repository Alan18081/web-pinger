const server = require('./server');
const workers = require('./worker');
const cli = require('./lib/cli');
const cluster = require('cluster');
const os = require('os');

const app = {
	init() {
		if(cluster.isMaster) {

			workers.init();

			setTimeout(() => {
				cli.init();
			}, 50);

			for(let i = 0; i < os.cpus().length; i++) {
				cluster.fork();
			}

		} else {
			server.init();
		}


	}
};

if(require.main === module) {
  app.init();
}

module.exports = app;