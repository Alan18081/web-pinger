const { passwordLength } = require('../../config');
const HttpError = require('../../helpers/http/http-error');
const helpers = require('../../helpers/common');

class UsersFilter {
	get(data) {

	}

	createUser({ body }) {

		if(typeof body.email !== 'string') {
			return new HttpError('Email should be a string');
		} else if(!helpers.validateEmail(body.email)) {
			return new HttpError('Invalid email');
		}

		if(typeof body.password !== 'string') {
			return new HttpError('Password should be a string');
		} else if(body.password.length < passwordLength) {
			console.log(body.password.length);
			return new HttpError(`Password should have at least ${passwordLength} characters`);
		}

	}
}

module.exports = new UsersFilter();