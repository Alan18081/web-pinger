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

