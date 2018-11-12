const Worker = require('./components/workers/worker.service');

const userId = process.argv[2];

const worker = new Worker(userId);

worker.run();
