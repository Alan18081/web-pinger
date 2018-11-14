const { passwordLength } = require('../../config');
const HttpError = require('../../helpers/http/http-error');
const helpers = require('../../helpers/common');

class UsersFilter {

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

	updateUser({ body }) {

		let isNewDataExists = false;

		if(body.firstName) {
			if(typeof body.firstName !== 'string') {
				return new HttpError('First name should be a string');
			}
			isNewDataExists = true;
		}

		if(body.lastName) {
			if(typeof body.lastName !== 'string') {
				return new HttpError('Last name should be a string');
			}
			isNewDataExists = true;
		}

		if(body.email) {
			if(typeof body.email !== 'string') {
				return new HttpError('Email should be a string');
			} else if(!helpers.validateEmail(body.email)) {
				return new HttpError('Invalid email');
			}
			isNewDataExists = true;
		}

		if(!isNewDataExists) {
			return new HttpError('No .data to update');
		}

	}


}

module.exports = new UsersFilter();