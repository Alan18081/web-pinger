const http = require('http');
const https = require('https');
const Files = require('../../helpers/files.helper');
const EmailsService = require('../email/emails.service');
const url = require('url');
const request = require('../../helpers/request');
const SiteStatuses = require('../../helpers/site-statuses');
const logsService = require('../logs/logs.service');
const usersService = require('../users/users.service');
const config = require('../../config');

const emailsService = new EmailsService('alexostapiuk00@gmail.com');
const files = new Files(config.dataDir);

class WorkerService {
	constructor(userId) {
		this.userId = userId;
		this.checks = [];
	}

	loop() {
		setInterval(() => {
			this.mapChecks();
		}, 1000 * 10);
	}

	rotateLoop() {
		setInterval(() => {
			this.rotateLogs();
		}, 1000 * 5);
	}

	watchChanges() {
		files.watch(`checks/${this.userId}`, () => this.loadChecks());
	}

	async loadChecks() {
		this.checks = await files.list(`checks/${this.userId}`);
	}

	async rotateLogs() {
		await logsService.compressLogs();
	}

	async mapChecks() {
		await Promise.all(this.checks.map(this.performCheck));
	}

	async performCheck(checkData) {
		const oldStatus = checkData.status;
		const parsedUrl = url.parse(`${checkData.protocol}://${checkData.url}`);
		const hostname = parsedUrl.hostname;
		const path = parsedUrl.path;

		const requestConfig = {
			protocol: `${checkData.protocol}:`,
			hostname,
			method: checkData.method,
			path,
			timeout: checkData.timeoutSeconds * 1000
		};

		try {
			const module = checkData.protocol === 'http' ? http : https;

			const res = await request(requestConfig, module);
			const { statusCode } = res;

			if(checkData.successCodes.indexOf(statusCode) !== -1) {
				checkData.status = SiteStatuses.up;
			} else {
				checkData.status = SiteStatuses.down;
			}

			await files.update(`checks/${checkData.userId}`, checkData.id, checkData);
			const userData = await usersService.findById(checkData.userId);

			if(oldStatus !== checkData.status) {
				const isSuccess = await emailsService.sendEmail(userData, checkData);
				await logsService.appendNewLog(checkData, statusCode, isSuccess);
			}

		} catch (e) {
			console.log(e);
		}

	}

	async run() {
		await this.loadChecks();
		this.watchChanges();
		this.loop();
		this.rotateLoop();

		console.log('Worker for user', this.userId, 'started');
	}
}

module.exports = WorkerService;