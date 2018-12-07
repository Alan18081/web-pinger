const cryptHelper = require('../../helpers/crypt.helper');

class Check {
	constructor({ userId, protocol, url, successCodes, timeoutSeconds, method }) {
		this.id = cryptHelper.createId();
		this.userId = userId;
		this.protocol = protocol;
		this.url = url;
		this.method = method;
		this.successCodes = successCodes;
		this.timeoutSeconds = timeoutSeconds;
		this.status = 'down';
	}
}

module.exports = Check;