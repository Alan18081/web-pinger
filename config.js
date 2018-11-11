// Container for all environments
const environments = {};

// Staging (default) environment
environments.staging = {
	httpPort: 3000,
	httpsPort: 3001,
	envName: 'staging',
	hashSecret: 'Some secret',
	maxChecks: 5,
	passwordLength: 6,
	twilio: {
		fromPhone: '+380500337230',
		accountSid: 'AC29c4b0e7393e7fa4a1a19f4dcf312463',
		authToken: '9bc3499fc7e72b6a4520cb1ffad1dba5'
	}
};

environments.testing = {
  httpPort: 4000,
  httpsPort: 4001,
  envName: 'testing',
  hashSecret: 'Some secret',
  maxChecks: 5,
	passwordLength: 6,
  twilio: {
    fromPhone: '+380500337230',
    accountSid: 'AC29c4b0e7393e7fa4a1a19f4dcf312463',
    authToken: '9bc3499fc7e72b6a4520cb1ffad1dba5'
  }
};

// Production
environments.production = {
	httpPort: 5000,
	httpsPort: 5001,
	envName: 'production',
	hashSecret: 'Some production secret',
	maxChecks: 5,
	passwordLength: 6,
	twilio: {
		fromPhone: '380662714786',
		accountSid: 'AC29c4b0e7393e7fa4a1a19f4dcf312463',
		authToken: '9bc3499fc7e72b6a4520cb1ffad1dba5'
	}
};

// Define current environment
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of environments above, if not default to staging
module.exports = environments[currentEnvironment] ? environments[currentEnvironment] : environments.staging;

