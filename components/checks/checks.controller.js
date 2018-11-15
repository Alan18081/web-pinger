const checksFilter = require('./checks.filter');
const checksService = require('./checks.service');
const HttpCodes = require('../../helpers/http/http-codes');
const HttpResponse = require('../../helpers/http/http-response');
const HttpError = require('../../helpers/http/http-error');

class ChecksController {

	async createOne(data) {
		const error = checksFilter.createOne(data);

		if(error) {
			return new HttpResponse(
				HttpCodes.BAD_REQUEST,
				error
			);
		}

		try {
			const check = await checksService.createOne(data);
			return new HttpResponse(200, check);
		} catch (e) {
			console.log(e);
			return new HttpResponse(HttpCodes.SERVER_ERROR, new HttpError('Server Error'));
		}
	}

	async findByUserId({ user, query }) {
		const error = checksFilter.findByUserId(query);

		if(error) {
			return new HttpResponse(
				HttpCodes.BAD_REQUEST,
				error
			);
		}

		const checks = await checksService.findByUserId(user.id, query);

		return new HttpResponse(HttpCodes.SUCCESS, checks);
	}

	async findOne({ params, user }) {
		const check = await checksService.findOne(params.id, user.id);
		return new HttpResponse(HttpCodes.SUCCESS, check);
	}

	async updateOne(data) {
		const { user, params } = data;
		const error = checksFilter.updateOne(data);

		if(error) {
			return new HttpResponse(HttpCodes.BAD_REQUEST, error);
		}
		try {
			const check = await checksService.findOne(user.id, params.id);
			console.log(check);
			if(!check) {
				return new HttpResponse(HttpCodes.NOT_FOUND, new HttpError('Check was not found'));
			}

			const updatedCheck = await checksService.updateOne(params.id, user.id, data.body);
			return new HttpResponse(HttpCodes.SUCCESS, updatedCheck);
		} catch (e) {
			console.log(e);
			return new HttpResponse(HttpCodes.SERVER_ERROR, new HttpError('Server Error'));
		}
	}

	async deleteOne({ params, user }) {
		try {
			const check = await checksService.findOne(user.id, params.id);
			if(!check) {
				return new HttpResponse(HttpCodes.NOT_FOUND, new HttpError('Check was not found'));
			}

			await checksService.deleteOne(params.id, user.id);
			return new HttpResponse(HttpCodes.SUCCESS, {});
		} catch (e) {
			return new HttpResponse(HttpCodes.SERVER_ERROR, new HttpError('Server Error'));
		}
	}
}

module.exports = new ChecksController();