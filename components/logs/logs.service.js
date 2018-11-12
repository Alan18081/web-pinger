const Files = require('../../helpers/files.helper');
const zlib = require('zlib');

const files = new Files('.logs');

class LogsService {
  constructor(compressedFolder, uncompressedFolder) {
  	this.compressedFolder = compressedFolder;
  	this.uncompressedFolder = uncompressedFolder;
  }


  async compressLogs() {
  	const logs = await files.filesList(this.uncompressedFolder);
  	await Promise.all(logs.map(this.compress));
	}

	async decompressLogs() {
  	const compressedlogs = await files.filesList(this.compressedFolder);
  	return await Promise.all(compressedlogs.map(this.decompress));
	}


	async appendNewLog(checkData, statusCode) {
		try {
			const logData = {
				statusCode,
				url: checkData.url,
				status: checkData.status
			};

			await files.appendFile(this.uncompressedFolder, checkData.id, logData + '\n', 'log');
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
			return files.createReadStream(zipedLogName)
				.pipe(zlib.createGuzip());
		} catch (e) {
			console.log(e);
		}
	}
}

module.exports = new LogsService('compressed', 'uncompressed');