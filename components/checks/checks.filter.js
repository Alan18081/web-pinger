const HttpError = require('../../helpers/http/http-error');

class ChecksFilter {
	findByUserId(query) {

		if (Boolean(query.unlimit)) {
			return false;
		}

		if (!query.page || typeof Number(query.page) !== 'number') {
			return new HttpError('Param "page" should be a number');
		}

		if (!query.limit || typeof Number(query.limit) !== 'number') {
			return new HttpError('Param "limit" should be a number');
		}

		query.limit = Number(query.limit);
		query.page = Number(query.page);

	}


	createOne({ body }) {

		if(typeof body.protocol !== 'string') {
			return new HttpError('Protocol should be a string');
		} else if(['http', 'https'].indexOf(body.protocol) === -1) {
			return new HttpError('Invalid protocol');
		}

		if(typeof body.url !== 'string') {
			return new HttpError('Url should be a string');
		}

		if(typeof body.method !== 'string') {
			return new HttpError('Method should be a string');
		} else if(['get', 'post', 'put', 'delete'].indexOf(body.method)) {
			return new HttpError('Invalid method');
		}

		if(!Array.isArray(body.successCodes)) {
			return new HttpError('Success codes should be an array');
		}

		if(typeof body.timeoutSeconds !== 'number') {
			return new HttpError('Timeout seconds should be a number');
		} else if(body.timeoutSeconds < 1 || body.timeoutSeconds > 5) {
			return new HttpError('Timeout should be between 1 and 5 seconds');
		}

	}

	updateOne({ body, params }) {
		let isNewDataExists = false;

		if(!params || !params.id) {
			return new HttpError('You should provide id of particular check');
		}

		if(body.protocol) {
			if(typeof body.protocol !== 'string') {
				return new HttpError('Protocol should be a string');
			} else if(['http', 'https'].indexOf(body.protocol) === -1) {
				return new HttpError('Invalid protocol');
			}
			isNewDataExists = true;
		}

		if(body.url) {
			if(typeof body.url !== 'string') {
				return new HttpError('Url should be a string');
			}
			isNewDataExists = true;
		}

		if(body.method) {
			if(typeof body.method !== 'string') {
				return new HttpError('Method should be a string');
			} else if(['get', 'post', 'put', 'delete'].indexOf(body.method) === -1) {
				return new HttpError('Invalid method');
			}
			isNewDataExists = true;
		}

		if(body.successCodes) {
			if (!Array.isArray(body.successCodes)) {
				return new HttpError('Success codes should be an array');
			}
			isNewDataExists = true;
		}

		if(body.timeoutSeconds) {
			if(typeof body.timeoutSeconds !== 'number') {
				return new HttpError('Timeout seconds should be a number');
			} else if(body.timeoutSeconds < 1 || body.timeoutSeconds > 5) {
				return new HttpError('Timeout should be between 1 and 5 seconds');
			}
			isNewDataExists = true;
		}

		if(!isNewDataExists) {
			return new HttpError('No .data to update');
		}
	}
}

module.exports = new ChecksFilter();