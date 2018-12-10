const http = require('http');

function request(config, module, data = '') {
	const httpModule = module || http;
	return new Promise((resolve, reject) => {
		const req = httpModule.request(config, res => {
			console.log(res.statusCode);
			resolve(res);
		});

		req.on('error', error => {
			reject(error);
		});

		req.end(JSON.stringify(data));
	});
}

module.exports = request;