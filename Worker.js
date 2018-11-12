const http = require('http');
const https = require('https');
const util = require('util');
const Files = require('./helpers/files.helper');
const EmailsService = require('./components/email/emails.service');
const url = require('url');
const request = require('./helpers/request');
const SiteStatuses = require('./helpers/site-statuses');
const logs = require('./components/logs/logs.service');

const files = new Files('.data');
const emailsService = new EmailsService('gogunov00@gmail.com');

class Worker {
	constructor(userId) {
		this.userId = userId;
		this.checks = [];
	}

	loop() {
		setInterval(() => {
			this.mapChecks();
		}, 1000 );
	}

	watchChanges() {
		files.watch(`checks/${this.userId}`, () => this.loadChecks());
	}

	async loadChecks() {
		this.checks = await files.list(`checks/${this.userId}`);
	}

	async rotateLogs() {

	}

	async mapChecks() {
		await Promise.all(this.checks.map(this.performCheck));
	}

	async performCheck(checkData) {
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
			await logs.appendNewLog(checkData, statusCode);
			await emailsService.sendEmail('alexostapiuk00@gmail.com', 'Test title', 'Test content');

		} catch (e) {

			console.log(e);
		}

	}

	async run() {
		await this.loadChecks();
		this.watchChanges();
		this.loop();

		console.log('Worker for user', this.userId, 'started');
	}
}

module.exports = Worker;