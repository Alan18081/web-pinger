const Files = require('../../helpers/files.helper');
const zlib = require('zlib');
const Log = require('./log.entity');
const helpers = require('../../helpers/common');

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

	async findAllUncompressedLogs() {
		const logsFilesList = await files.list(this.uncompressedFolder, { ext: 'log', raw: true});
		return logsFilesList.map(logFileContent => {
			const logsArray = logFileContent.split('\n');
			return logsArray.map(helpers.parseJson);
		});
	}

	async findUncompressedLog(logId) {
		return await files.read(this.uncompressedFolder, logId, 'log');
	}

	async appendNewLog(checkData, statusCode, emailStatus) {
		try {
			const log = new Log({
				id: checkData.id,
				statusCode,
				url: checkData.url,
				status: checkData.status,
				emailSent: emailStatus ? 'Success' : 'Failed'
			});

			await files.appendFile(this.uncompressedFolder, log.id, JSON.stringify(log) + '\n', { ext: 'log'});
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