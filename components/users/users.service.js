const User = require('./user.entity');
const Files = require('../../helpers/files.helper');
const cryptHelper = require('../../helpers/crypt.helper');
const checksService = require('../checks/checks.service');

const files = new Files('.data');

class UsersService {
	constructor() {
		this.folder = 'users';
	}

	async findAll() {
		return await files.list(this.folder);
	}

	async findByEmail(email) {
		const filesList = await files.filesList(this.folder);
		const userFilename = filesList.find(filename => filename.indexOf(email) !== -1);
		return await files.read('users', userFilename);
	}

	async findById(userId) {
		const filesList = await files.filesList(this.folder);
		const userFilename = filesList.find(filename => filename.indexOf(userId) !== -1);
		return await files.read('users', userFilename);
	}

	createUserFilename(id, email) {
		return `${id}:${email}`;
	}

	async createUser({ body }) {
		const { email, firstName, lastName, password } = body;
		const encryptedPassword = cryptHelper.encrypt(password);
		const user = new User({
			email,
			firstName,
			lastName,
			password: encryptedPassword
		});

		const filename = this.createUserFilename(user.id, user.email);

		await files.create(this.folder, filename, user);
		delete user.password;

		return user;

	}

	async updateUser(oldUserData, newUserData) {
		const oldUserFilename = this.createUserFilename(oldUserData.id, oldUserData.email);
		const newUserFilename = this.createUserFilename(oldUserData.id, oldUserData.email);
		const updatedUserData = await files.update(this.folder, oldUserFilename, newUserData);
		await files.renameOne(this.folder, oldUserFilename, newUserFilename);

		return updatedUserData;
	}

	async deleteUser(id, email){
		await Promise.all([
			files.deleteFile(this.folder, this.createUserFilename(id, email)),
			checksService.deleteByUserId(id)
		]);
	}
}

module.exports = new UsersService();