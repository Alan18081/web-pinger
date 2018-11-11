const Worker = require('./Worker');

const userId = process.argv[2];

const worker = new Worker(userId);

worker.run();
