const http = require('http');

function request(config, module, data = '', headers = {}) {
	const httpModule = module || http;
	return new Promise((resolve, reject) => {
		const req = httpModule.request(config, res => {
			resolve(res);
		});


		for(const headerName in headers) {
			if(headers.hasOwnProperty(headerName)) {
				req.setHeader(headerName, headers[headerName]);
			}
		}

		console.log('Header', req.getHeader('Content-Type'));

		req.on('error', error => {
			reject(error);
		});

		req.end(JSON.stringify(data));
	});
}

module.exports = request;