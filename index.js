const server = require('./server');
// const workers = require('./worker');
const cli = require('./lib/cli');

const app = {
	init() {
		server.init();
		// workers.init();

		// setTimeout(() => {
		// 	cli.init();
		// }, 50);
	}
};


if(require.main === module) {
  app.init();
}

module.exports = app;