class Log {
	constructor({ id, statusCode, url, status, emailStatus }) {
		this.id = id;
		this.statusCode = statusCode;
		this.url = url;
		this.status = status;
		this.emailSent = emailStatus ? 'Success' : 'Failed';
	}
}

module.exports = Log;