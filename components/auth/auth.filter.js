const helpers = require('../../helpers/common');
const HttpError = require('../../helpers/http/http-error');
const { passwordLength } = require('../../config');

class AuthFilter {

	login({ body }) {

		if (typeof body.email !== 'string') {
			return new HttpError('Email should be a string');
		} else if(!helpers.validateEmail(body.email)) {
			return new HttpError('Invalid email');
		}

		if(typeof body.password !== 'string') {
			return new HttpError('Password should be string');
		} else if(body.password.length < passwordLength) {
			return new HttpError(`Password should have at least ${passwordLength} characters`);
		}

	}
}

module.exports = new AuthFilter();