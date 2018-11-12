class Email {
	constructor(senderEmail, receiverEmail, title, content) {
		this.personalizations = [
			{ email: receiverEmail }
		];

		this.subject = title;

		this.from = { email: senderEmail };

		this.content = { type: 'text/plain', value: content }

	}
}

module.exports = Email;