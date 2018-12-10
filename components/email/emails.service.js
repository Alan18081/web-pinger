const Email = require('./email');
const request = require('../../helpers/request');
const url = require('url');
const { sendgrid } = require('../../config');
const https = require('https');
const HttpCodes = require('../../helpers/http/http-codes');

class EmailsService {
	constructor(from) {
		this.fromData = {
			email: from,
			name: 'Web-Pinger'
		};

		this.baseUrl = url.parse('https://api.sendgrid.com');
	}

	renderContent(checkData) {
		const date = new Date();
		const title = 'Notification from Web-pinger';
		const text = `
			Site <strong>${checkData.url}</strong> 
			is ${checkData.status} at ${date.toLocaleString()}
		`;

		return { title, text };
	}

	async sendEmail(user, checkData) {

		const { title, text } = this.renderContent(checkData);

		const email = new Email(this.fromData, { email: user.email, name: user.firstName }, title, text);

		const reqConfig = {
			protocol: 'https:',
			hostname: 'api.sendgrid.com',
			path: '/v3/mail/send',
			method: 'post',
			headers: {
				'Authorization': `Bearer ${sendgrid.apiKey}`,
				'Content-Type': 'application/json'
			}
		};


		try {
      const res = await request(reqConfig, https, email);
      return res.statusCode === HttpCodes.ACCEPTED || res.statusCode === HttpCodes.SUCCESS;
    }
		catch(e) {
			console.log(e);
    }

	}
}

module.exports = EmailsService;