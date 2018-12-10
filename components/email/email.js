class Email {
	constructor(senderData, receiverData, title, content) {
		this.personalizations = [ {
			to: [
				receiverData
			],
			subject: title
		} ];

		this.from = senderData;

		this.content = [
			{ type: 'text/html', value: content }
		];
	}
}

module.exports = Email;