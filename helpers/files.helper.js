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
fs.truncate = util.promisify(fs.truncate);
// fs.appendFile = util.promisify(fs.appendFile);

class Files {
	constructor(dir) {
		this.baseDir = path.join(__dirname, `/../${dir}`);
	}

	async list(dir, ext = 'json') {
		await this.prepareDir(dir);

		const filenamesList = await fs.readdir(path.join(this.baseDir, `/${dir}/`));
		return await Promise.all(filenamesList.map(filename => {
			return this.read(dir, filename.replace(`.${ext}`, ''));
		}));
	}

	createReadStream(filename) {
		return fs.createReadStream(path.join(this.baseDir, filename));
	}

	createWriteStream(filename) {
		return fs.createWriteStream(path.join(this.baseDir, filename));
	}

	watch(dir, handler) {
		fs.watch(path.join(this.baseDir, `/${dir}/`), handler);
	}

	async filesList(dir) {
		await this.prepareDir(dir);
		return await fs.readdir(path.join(this.baseDir, `/${dir}/`));
	}

	async appendFile(dir, file, data, ext = 'json') {
		await this.prepareDir(dir);
		const stringifiedData = JSON.stringify(data);
		console.log(stringifiedData);
		await fs.appendFile(path.join(this.baseDir, `/${dir}/${file}.${ext}`), stringifiedData);
	}

	async prepareDir(dir) {
		const isExists = fs.existsSync(path.join(this.baseDir, dir));
		if(!isExists) {
			await fs.mkdir(path.join(this.baseDir, dir));
		}
	}

	async create(dir, file, data, ext = 'json') {
		await this.prepareDir(dir);
		const fileDescriptor = await fs.open(path.join(this.baseDir, `/${dir}/${file}.${ext}`), 'wx');
		const stringifiedData = JSON.stringify(data);
		await fs.writeFile(fileDescriptor, stringifiedData);
		await fs.close(fileDescriptor);
	}

	async read(dir, file, ext = 'json') {
		const data = await fs.readFile(path.join(this.baseDir, `/${dir}/${file}.${ext}`), 'utf8');
		return helpers.parseJson(data);
	}

	async update(dir, file, data, ext = 'json') {
		const fileDescriptor = await fs.open(path.join(this.baseDir, `/${dir}/${file}.${ext}`), 'r+');
		const oldStringData = await fs.readFile(fileDescriptor, 'utf8');
		const oldData = helpers.parseJson(oldStringData);

		const newData = {
			...oldData,
			...data
		};

		await fs.truncate(fileDescriptor, 0);

		const stringifiedData = JSON.stringify(newData);

		await fs.writeFile(fileDescriptor, stringifiedData);
		await fs.close(fileDescriptor);

		return newData;
	}

	async delete(dir, file, ext = 'json') {
		await fs.unlink(path.join(this.baseDir, `/${dir}/${file}.${ext}`));
	}
}

module.exports = Files;