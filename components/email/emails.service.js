const Email = require('./email');
const request = require('../../helpers/request');
const url = require('url');
const { sendgrid } = require('../../config');
const https = require('https');

class EmailsService {
	constructor(from) {
		this.from = from;
		this.baseUrl = url.parse('https://api.sendgrid.com');
	}

	async sendEmail(receiverEmail, title, text) {
		const email = new Email('gogunov00@gmail.com', receiverEmail, title, text);

		console.log(sendgrid.apiKey);

		const reqConfig = {
			protocol: 'https:',
			hostname: this.baseUrl.hostname,
			path: '/v3/mail/send',
			method: 'post'
		};

		const headers = {
      'Authorization': sendgrid.apiKey,
      'Content-Type': 'application/json'
		};

		try {
      const res = await request(reqConfig, https, email, headers);
      console.log(res.statusCode);
    }
		catch(e) {
			console.log(e);
    }

	}
}

module.exports = EmailsService;