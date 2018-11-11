const http = require('http');
const https = require('https');
const util = require('util');
const files = require('./helpers/files.helper');
const url = require('url');
const request = require('./helpers/request');
const SiteStatuses = require('./helpers/site-statuses');

class Worker {
	constructor(userId) {
		this.userId = userId;
		this.checks = [];
	}

	loop() {
		setInterval(() => {
			this.mapChecks();
		}, 1000 * 60);
	}

	watchChanges() {
		files.watch(`checks/${this.userId}`, () => this.loadChecks());
	}

	async loadChecks() {
		this.checks = await files.list(`checks/${this.userId}`);
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

			const res = await request(module, requestConfig);
			const { statusCode } = res;

			if(checkData.successCodes.indexOf(statusCode) !== -1) {
				checkData.status = SiteStatuses.up;
			} else {
				checkData.status = SiteStatuses.down;
			}

			await files.update(`checks/${checkData.userId}`, checkData.id, checkData);


		} catch (e) {

			console.log(e);
		}

	}

	async run() {
		await this.loadChecks();
		this.watchChanges();
		this.loop();
	}
}

module.exports = Worker;