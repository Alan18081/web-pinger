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

		try {

			const user = await usersService.findByEmail(data.body.email);

			console.log(data.body.email);

			if(user) {
				return new HttpResponse(
					HttpCodes.CONFLICT,
					new HttpError('User already exists')
				);
			}

			const newUser = await usersService.createUser(data);

			return new HttpResponse(HttpCodes.SUCCESS, newUser);
		} catch (e) {
			console.log(e);
			return new HttpResponse(HttpCodes.SERVER_ERROR, { error: 'Failed to upload file' });
		}
	}

	async findAll() {
		const users = await usersService.findAll();
		return new HttpResponse(HttpCodes.SUCCESS, users);
	}

	async updateOne(data) {
		const error = usersFilter.updateUser(data);
		if(error) {
			return new HttpResponse(HttpCodes.BAD_REQUEST, error);
		}

		try {
			const updatedUser = await usersService.updateUser(data.user, data.body);
			return new HttpResponse(HttpCodes.SUCCESS, updatedUser);
		} catch (e) {
			console.log(e);
			return new HttpResponse(HttpCodes.SERVER_ERROR, new HttpError('Server Error'));
		}

	}

	async deleteOne({ user }) {
		try {
			await usersService.deleteUser(user.id, user.email);
			return new HttpResponse(HttpCodes.SUCCESS);
		} catch (e) {
			return new HttpResponse(HttpCodes.SERVER_ERROR, new HttpError('Server Error'));
		}
	}

}

module.exports = new UsersController();