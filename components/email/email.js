class Email {
	constructor(senderEmail, receiverEmail, title, content) {
		this.personalizations = [ {
			to: [
				{email: receiverEmail}
			],
			subject: title
		} ];

		this.from = { email: senderEmail };

		this.content = [
			{ type: 'text/plain', value: content }
		];
	}
}

module.exports = Email;