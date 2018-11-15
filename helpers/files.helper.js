const path = require('path');
const fs = require('fs');
const util = require('util');
const helpers = require('../helpers/common');

fs.open = util.promisify(fs.open);
fs.writeFile = util.promisify(fs.writeFile);
fs.close = util.promisify(fs.close);
fs.readFile = util.promisify(fs.readFile);
fs.readdir = util.promisify(fs.readdir);
fs.mkdir = util.promisify(fs.mkdir);
fs.unlink = util.promisify(fs.unlink);
fs.ftruncate = util.promisify(fs.ftruncate);
fs.appendFile = util.promisify(fs.appendFile);
fs.rename = util.promisify(fs.rename);

class Files {
	constructor(dir) {
		this.baseDir = path.join(__dirname, `/../${dir}`);
	}

	async list(dir, settings = {}) {
    const { params, ext = 'json', raw = false } = settings;

		await this.prepareDir(dir);

		const filenamesList = await fs.readdir(path.join(this.baseDir, `/${dir}/`));

		let sizedFilenames;

		if(!params) {
			sizedFilenames = filenamesList;
		} else {
			sizedFilenames = filenamesList.slice(params.offset, params.offset + params.limit);
		}

		return await Promise.all(sizedFilenames.map(filename => {
			return this.read(dir, filename.replace(`.${ext}`, ''), { ext, raw });
		}));

	}

	createReadStream(dir, filename, settings = {}) {
		const { ext = 'json' } = settings;
		return fs.createReadStream(path.join(this.baseDir, `/${dir}/${filename}.${ext}`));
	}

	createWriteStream(dir, filename, settings = {}) {
		const { ext = 'json' } = settings;
		return fs.createWriteStream(path.join(this.baseDir, `/${dir}/${filename}.${ext}`));
	}

	watch(dir, handler) {
		fs.watch(path.join(this.baseDir, `/${dir}/`), handler);
	}

	async filesList(dir) {
		await this.prepareDir(dir);
		return await fs.readdir(path.join(this.baseDir, `/${dir}/`));
	}

	async appendFile(dir, file, data, settings = {}) {
    const { ext = 'json' } = settings;

    await this.prepareDir(dir);
		await fs.appendFile(path.join(this.baseDir, `/${dir}/${file}.${ext}`), data);
	}

	async prepareDir(dir) {
		const isExists = fs.existsSync(path.join(this.baseDir, dir));
		if(!isExists) {
			await fs.mkdir(path.join(this.baseDir, dir));
		}
	}

	async create(dir, file, data, settings = {}) {
    const { ext = 'json' } = settings;

    await this.prepareDir(dir);
		const fileDescriptor = await fs.open(path.join(this.baseDir, `/${dir}/${file}.${ext}`), 'wx');
		const stringifiedData = JSON.stringify(data);
		await fs.writeFile(fileDescriptor, stringifiedData);
		await fs.close(fileDescriptor);
	}

	async read(dir, file, settings = {}) {
    const { ext = 'json', raw = false } = settings;

    await this.prepareDir(dir);
		const data = await fs.readFile(path.join(this.baseDir, `/${dir}/${file}.${ext}`), 'utf8');

		if(raw) {
			return data;
		}

		return helpers.parseJson(data);
	}

	async update(dir, file, data, settings = {}) {
		const { ext = 'json' } = settings;

		await this.prepareDir(dir);
		const fileDescriptor = await fs.open(path.join(this.baseDir, `/${dir}/${file}.${ext}`), 'r+');
		const oldStringData = await fs.readFile(fileDescriptor, 'utf8');
		const oldData = helpers.parseJson(oldStringData);

		const newData = {
			...oldData,
			...data
		};

		await fs.ftruncate(fileDescriptor, 0);

		const stringifiedData = JSON.stringify(newData);

		await fs.writeFile(fileDescriptor, stringifiedData);
		await fs.close(fileDescriptor);

		return newData;
	}

	async renameOne(dir, oldFilename, newFilename, settings = {}) {
		const { oldExt = 'json', newExt = 'json' } = settings;

		await this.prepareDir(dir);
		const oldPath = path.join(this.baseDir, `/${dir}/${oldFilename}.${oldExt}`);
		const newPath = path.join(this.baseDir, `/${dir}/${newFilename}.${newExt}`);
		await fs.rename(oldPath, newPath);
	}

	async deleteFile(dir, file, settings = {}) {
    const { ext = 'json' } = settings;

		await this.prepareDir(dir);
		await fs.unlink(path.join(this.baseDir, `/${dir}/${file}.${ext}`));
	}

	async deleteFolder(baseDir, dir) {
		await this.prepareDir(baseDir);
		await this.prepareDir(dir);
		await fs.unlink(path.join(this.baseDir, `/${baseDir}/${dir}`));
	}
}

module.exports = Files;