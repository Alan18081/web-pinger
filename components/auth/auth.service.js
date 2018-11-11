const usersService = require('../users/users.service');
const cryptHelper = require('../../helpers/crypt.helper');

class AuthService {

	async validateToken(token) {
		const email = cryptHelper.decrypt(token);
		const user = await usersService.findOne(email);
		return user;
	}

	createToken(userId) {
		return cryptHelper.encrypt(userId);
	}
}

module.exports = new AuthService();