const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const config = require('./config');
const fs = require('fs');
const path = require('path');
const util = require('util');

const router = require('./router');

const HttpResponse = require('./helpers/http/http-response');
const HttpCodes = require('./helpers/http/http-codes');
const helpers = require('./helpers/common');

const debug = util.debuglog('server');


const httpsServerOptions = {
	key: fs.readFileSync(path.join(__dirname, '/https/key.pem')),
	cert: fs.readFileSync(path.join(__dirname, '/https/cert.pem'))
};

class Server {
	constructor() {
		this.serverHandler = this.serverHandler.bind(this);
		this.httpServer = http.createServer(this.serverHandler);
		this.httpsServer = https.createServer(httpsServerOptions, this.serverHandler);
		this.router = router;
	}
	async serverHandler(req, res) {
		// Get the url and parse it
		const parsedUrl = url.parse(req.url, true);
		// Get the path
		const path = parsedUrl.pathname;
		const trimmedPath = path.replace(/^\/+|\/+$/g, '');

		// Get the method
		const method = req.method.toLowerCase();

		// Get the query
		const query = parsedUrl.query;

		// Get the headers
		const headers = req.headers;

		const body = await this.decodeBody(req);

		const data = {
			path: trimmedPath,
			query,
			method,
			headers,
			body
		};

		const { handler, params = {} } = helpers.pathParser(trimmedPath, this.router[method]);
		let responseData = {};

		if(handler) {
			data.params = params;
			responseData = await handler(data);
		} else {
			responseData = new HttpResponse(HttpCodes.NOT_FOUND, { error: 'Route not found' });
		}

		const { statusCode, payload } = responseData;

		res.setHeader('Content-Type', 'application/json');

		res.writeHead(statusCode);

		res.end(JSON.stringify(payload));

		if(statusCode === 200) {
			debug('\x1b[32m%s\x1b[0m', `${method.toUpperCase()} ${parsedUrl.href}`);
		} else {
			debug('\x1b[31m%s\x1b[0m', `${method.toUpperCase()} ${parsedUrl.href}`);
		}
		// Send the response
		// Log path
	};

	init() {
		console.log('Initing');
		this.httpServer.listen(config.httpPort, () => {
			debug('\x1b[36m%s\x1b[0m', `Http server is listening port ${config.httpPort} in ${config.envName} environment`);
		});

		this.httpsServer.listen(config.httpsPort, () => {
			debug('\x1b[35m%s\x1b[0m', `Https server is listening port ${config.httpsPort} in ${config.envName} environment`);
		});
	}

	decodeBody(req) {
		return new Promise((resolve, reject) => {
			const decoder = new StringDecoder('utf-8');
			let buffer = '';

			req.on('data', data => {
				buffer += decoder.write(data);
			});

			req.on('end', () => {
				buffer += decoder.end();
				resolve(helpers.parseJson(buffer));
			});

			req.on('error', err => {
				reject(err);
			});
		});
	}
}

module.exports = new Server();