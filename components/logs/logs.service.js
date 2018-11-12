const Files = require('../../helpers/files.helper');
const zlib = require('zlib');

const files = new Files('.logs');

class Logs {
	async appendNewLog(checkData, statusCode) {
		try {
			const logData = {
				statusCode,
				url: checkData.url,
				status: checkData.status
			};

			await files.appendFile('uncompressed', checkData.id, logData, 'log');
		} catch (e) {
			console.log(e);
		}

	}

	async compress(logName) {
		const distFilename = logName.replace('.log', '.gz.base64');
		try {
			files.createReadStream(logName)
				.pipe(zlib.createGzip())
				.pipe(files.createWriteStream(distFilename));
		} catch (e) {
			console.log(e);
		}
	}

	async decompress(zipedLogName) {
		try {
			files.createReadStream(zipedLogName)
				.pipe(zlib.createGuzip())
				.pipe(process.stdout);
		} catch (e) {
			console.log(e);
		}
	}
}

module.exports = new Logs();