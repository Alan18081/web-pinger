function request(module, config) {
	return new Promise((resolve, reject) => {
		const req = module.request(config, res => {
			resolve(res);
		});

		req.on('error', error => {
			reject(error);
		});

		req.end();
	});
}

module.exports = request;