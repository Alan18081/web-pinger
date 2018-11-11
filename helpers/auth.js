const authService = require('../components/auth/auth.service');
const HttpError = require('./http/http-error');
const HttpCodes = require('./http/http-codes');
const HttpResponse = require('./http/http-response');

function auth(handler) {
	return async function (data) {
		const authHeader = data.headers['authorization'];

		if(typeof authHeader !== 'string') {
			return new HttpResponse(HttpCodes.UNAUTHORIZED, new HttpError('Invalid authorization token'));
		}

		const token = authHeader.split(' ')[1];

		const user = await authService.validateToken(token);

		if(!user) {
			return new HttpResponse(HttpCodes.UNAUTHORIZED, new HttpError('Invalid authorization token'));
		}

		data.user = user;

		return await handler(data);
	}
}

module.exports = auth;