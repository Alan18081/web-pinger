const cryptHelper = require('../../helpers/crypt.helper');

class User {
	constructor({ email, firstName = '', lastName = '', password }) {
		this.id = cryptHelper.createId();
		this.email = email;
		this.firstName = firstName;
		this.lastName = lastName;
		this.password = password;
	}
}

module.exports = User;