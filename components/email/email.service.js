const Email = require('./email');
const request = require('../../helpers/request');
const url = require('url');

class EmailService {
	constructor(from) {
		this.from = from;
		this.baseUrl = url.parse('https://api.sendgrid.com/v3');
	}

	sendEmail(receiverEmail, title, text) {
		const email = new Email('gogunov00@gmail.com', receiverEmail, title, text);
		const reqConfig = {
			protocol: 'http:',

		};
	}

}