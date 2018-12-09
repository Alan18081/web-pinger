const path = require('path');
const environments = {};


// Staging (default) environment
environments.staging = {
	httpPort: 3000,
	httpsPort: 3001,
	envName: 'staging',
	hashSecret: 'Some secret',
	dataDir: path.join(__dirname, '.data'),
	logsDir: path.join(__dirname, '.logs'),
	maxChecks: 5,
	passwordLength: 6,
	sendgrid: {
		apiKey: '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'
	}
};

environments.test = {
  httpPort: 4000,
  httpsPort: 4001,
  envName: 'testing',
	dataDir: path.join(__dirname, '.test-data'),
	logsDir: path.join(__dirname, '.test-logs'),
	hashSecret: 'Some secret',
  maxChecks: 5,
	passwordLength: 6,
  sendgrid: {
    apiKey: 'e6f7cf0b45e9b6606302311494bde9ced638cb49e6bc683eeef61a35a137c7ae3835067a8b816730af452592c84bcdf0bf8a34dff7079e37683a48d8d497c863'
  }
};

// Production
environments.production = {
	httpPort: 5000,
	httpsPort: 5001,
	envName: 'production',
	dataDir: path.join(__dirname, '.prod-data'),
	logsDir: path.join(__dirname, 'prod-logs'),
	hashSecret: 'Some production secret',
	maxChecks: 5,
	passwordLength: 6,
  sendgrid: {
    apiKey: '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'
  }
};

// Define current environment
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of environments above, if not default to staging
module.exports = environments[currentEnvironment] ? environments[currentEnvironment] : environments.staging;

