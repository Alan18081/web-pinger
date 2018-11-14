const authFilter = require('./auth.filter');
const authService = require('./auth.service');
const usersService = require('../users/users.service');
const HttpResponse = require('../../helpers/http/http-response');
const HttpCodes = require('../../helpers/http/http-codes');
const HttpError = require('../../helpers/http/http-error');
const cryptHelper = require('../../helpers/crypt.helper');

class AuthController {

	async login(data) {
		const error = await authFilter.login(data);

		if(error) {
			return new HttpResponse(HttpCodes.BAD_REQUEST, error);
		}

		console.log(data.body.email);

		const user = await usersService.findByEmail(data.body.email);

		if(!user) {
			return new HttpResponse(HttpCodes.NOT_FOUND, new HttpError('User not found'));
		}

		if(!cryptHelper.compare(user.password, data.body.password)) {
			return new HttpResponse(HttpCodes.FORBIDDEN, new HttpError('Wrong password'));
		}

		const token = await authService.createToken(data.body.email);
		return new HttpResponse(HttpCodes.SUCCESS, { token });
	}

}

module.exports = new AuthController();