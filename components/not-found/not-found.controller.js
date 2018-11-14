const HttpResponse = require('../../helpers/http/http-response');
const HttpCodes = require('../../helpers/http/http-codes');
const HttpError = require('../../helpers/http/http-error');

class NotFoundController {
	notFound() {
		return new HttpResponse(HttpCodes.NOT_FOUND, new HttpError('Route not found'));
	}
}

module.exports = new NotFoundController();