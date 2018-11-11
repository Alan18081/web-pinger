const Check = require('./check.entity');
const files = require('../../helpers/files.helper');

class ChecksService {
	constructor() {
		this.folder = 'checks';
	}

	async findAll(userId) {
		return await files.list(`${this.folder}/${userId}`);
	}

	async findOne(checkId, userId) {
		return await files.read(`${this.folder}/${userId}`, checkId);
	}

	async createOne({ body, user }) {
		const { protocol, url, method, successCodes, timeoutSeconds } = body;
		const check = new Check({
			userId: user.id,
			protocol,
			url,
			method,
			successCodes,
			timeoutSeconds
		});

		await files.create(`${this.folder}/${user.id}`, check.id, check);
		return check;
	}

	async updateOne(id, userId, data) {
		return await files.update(`${this.folder}/${userId}`, id, data);
	}

	async deleteOne(id, userId) {
		await files.delete(`${this.folder}/${userId}`, id);
	}

}

module.exports = new ChecksService();