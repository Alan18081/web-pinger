const crypto = require('crypto');
const { hashSecret } = require('../config');

class Crypt {
	constructor() {
		this.algorithm = 'AES-128-ECB';
		this.iv = Buffer.alloc(0);
		this.key = crypto.createHash('sha1').digest().slice(0, 16);
	}

	decrypt(encryptedData) {
		const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
		let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
		decrypted += decipher.final('utf8');
		return decrypted;
	}

	encrypt(data) {
		const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
		let encryptedData = cipher.update(data, 'utf8', 'hex');
		encryptedData += cipher.final('hex');
		return encryptedData;
	}

	createId() {
		return crypto.randomBytes(16).toString('hex');
	}

	compare(encryptedData, data) {
		const decryptedData = this.decrypt(encryptedData);
		return decryptedData === data;
	}
}

module.exports = new Crypt();