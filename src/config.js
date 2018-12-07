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
    apiKey: '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'
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

