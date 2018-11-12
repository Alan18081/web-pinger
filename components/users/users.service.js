const User = require('./user.entity');
const Files = require('../../helpers/files.helper');
const cryptHelper = require('../../helpers/crypt.helper');
const HttpResponse = require('../../helpers/http/http-response');
const HttpCodes = require('../../helpers/http/http-codes');

const files = new Files('.data');

class UsersService {
	constructor() {
		this.folder = 'users';
	}

	async findAll() {
		return await files.list('users');
	}

	async findOne(email) {
		return await files.read('users', email);
	}

	async addUser({ body }) {
		try {
			const { email, firstName, lastName, password } = body;
			const encryptedPassword = cryptHelper.encrypt(password);
			const user = new User({
				email,
				firstName,
				lastName,
				password: encryptedPassword
			});

			await files.create(this.folder, user.email, user);
			delete user.password;
			return new HttpResponse(200, user);
		} catch (e) {
			console.log(e);
			return new HttpResponse(HttpCodes.SERVER_ERROR, { error: 'Failed to upload file' });
		}
	}

	updateUser() {

	}


}

module.exports = new UsersService();