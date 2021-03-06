const Files = require('../../helpers/files.helper');
const zlib = require('zlib');
const Log = require('./log.entity');
const helpers = require('../../helpers/common');
const config = require('../../config');

const files = new Files(config.logsDir);

class LogsService {
	constructor(compressedFolder, uncompressedFolder) {
		this.compressedFolder = compressedFolder;
		this.uncompressedFolder = uncompressedFolder;

		this.compress = this.compress.bind(this);
		this.decompress = this.decompress.bind(this);
		this.clearLog = this.clearLog.bind(this);
	}

	async compressLogs() {
		await files.prepareDir(this.compressedFolder);
		const logs = await files.filesList(this.uncompressedFolder);
		await Promise.all(logs.map(this.compress));
		await Promise.all(logs.map(this.clearLog))
	}

	async decompressLogs() {
		const compressedlogs = await files.filesList(this.compressedFolder);
		return await Promise.all(compressedlogs.map(this.decompress));
	}

	async findAllUncompressedLogs() {
		return await files.filesList(this.uncompressedFolder, { ext: 'log', raw: true});
	}

	async findAllCompressedLogs() {
		return await files.filesList(this.compressedFolder, { ext: '.gz.base64', raw: true});
	}

	async findUncompressedLog(logId) {
		const logsString = await files.read(this.uncompressedFolder, logId, { ext: 'log', raw: true });
		const logsList = logsString.split('\n');
		return logsList.map(helpers.parseJson);
	}

	async findCompressedLog(logId) {
		const logStream = await this.decompress(logId);
		const data = await helpers.promiseStream(logStream);
		const logList = data.split('\n');
		return logList.map(helpers.parseJson);
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

	async clearLog(logName) {
    try {
      await files.clearFile(this.uncompressedFolder, logName.replace(/.log/, ''), { ext: 'log' });
    } catch (e) {
      console.log(e);
    }
  }

	async compress(logName) {
	  const id = logName.replace(/.log/, '');
		try {
			files.createReadStream(this.uncompressedFolder, id, { ext: 'log' })
				.pipe(zlib.createGzip())
				.pipe(files.createWriteStream(this.compressedFolder, id, { ext: 'gz.base64' }));
		} catch (e) {
			console.log(e);
		}
	}

	async decompress(logId) {
		try {
			return files.createReadStream(this.compressedFolder, logId, { ext: 'gz.base64' })
				.pipe(zlib.createGunzip());
		} catch (e) {
			console.log(e);
		}
	}
}

module.exports = new LogsService('compressed', 'uncompressed');