function pathParser(url, router) {
	let handler;

	const urlsList = Object.keys(router);

	for(let template of urlsList) {

		let withSlash = true;

		if(template[template.length - 1] !== '/') {
			template += '/';
			withSlash = false;
		}

		if(template[0] === '/') {
			template[0] = '';
		}

		const regex = new RegExp(template.replace(/:.+?(?=\/)/g, ".+") + '$');

		if(regex.test(url + '/')) {

			const params = {};
			const templateArr = template.split('/');
			templateArr.pop();
			const urlArr = url.split('/');

			for(let i = 0; i < templateArr.length; i++) {
				const item = templateArr[i];
				if(item[0] === ':') {
					params[item.slice(1)] = urlArr[i];
				}
			}


			handler = router[withSlash ? template : template.slice(0, template.length - 1) ];

			return {
				handler,
				params
			}
		}
	}

	return {};
}

function parseJson(string) {
	try {
		return JSON.parse(string);
	} catch (e) {
		return false;
	}
}

function validateEmail(email) {
	return /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm.test(email);
}

function promiseStream(stream) {
	return new Promise((resolve, reject) => {
		let data = '';
		stream.on('data', chunk => {
			data += chunk.toString();
		});

		stream.on('error', error => {
			reject(error);
		});

		stream.on('end', () => {
			console.log(data);
			resolve(data);
		});
	});
}

module.exports = {
	pathParser,
	parseJson,
	validateEmail,
	promiseStream
};