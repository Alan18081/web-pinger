class HttpResponse {
	constructor(statusCode, payload = '') {
		this.statusCode = statusCode;
		this.payload = payload;
	}
}

module.exports = HttpResponse;