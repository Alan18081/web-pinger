const Check = require('./check.entity');
const Files = require('../../helpers/files.helper');

const files = new Files('.data');

class ChecksService {
	constructor() {
		this.folder = 'checks';
	}

	async findAll() {
		const userFolders = await files.filesList(this.folder);
		const checks = [];
		await Promise.all(userFolders.map(async folder => {
			const userChecks = await this.findByUserId(folder);
			checks.concat(userChecks);
		}));

		return checks;
	}

	async findByUserId(userId, query) {
		if(!query.unlimit) {
			return await files.list(
				`${this.folder}/${userId}`,
				'json',
				{ offset: query.page * query.limit - query.limit, limit: query.limit}
				);
		} else {
			return await files.list(`${this.folder}/${userId}`);
		}
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
		await files.deleteFile(`${this.folder}/${userId}`, id);
	}

	async deleteByUserId(id) {
		await files.deleteFolder(this.folder, id);
	}
}

module.exports = new ChecksService();