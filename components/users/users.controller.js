const usersFilter = require('./users.filter');
const usersService = require('./users.service');
const HttpCodes = require('../../helpers/http/http-codes');
const HttpResponse = require('../../helpers/http/http-response');
const HttpError = require('../../helpers/http/http-error');

class UsersController {

	async createOne(data) {
		const error = usersFilter.createUser(data);

		if(error) {
			return new HttpResponse(
				HttpCodes.BAD_REQUEST,
				error
			);
		}

		const user = await usersService.findOne(data.body.email);

		if(user) {
			return new HttpResponse(
				HttpCodes.CONFLICT,
				new HttpError('User already exists')
			);
		}

		return await usersService.addUser(data);
	}

	async findAll() {
		const users = await usersService.findAll();
		return new HttpResponse(HttpCodes.SUCCESS, users);
	}

	async updateOne(data) {

	}
}

module.exports = new UsersController();