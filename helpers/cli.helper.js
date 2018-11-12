class CliHelper {
	verticalSpace(lines) {
		const offset = typeof lines === 'number' && lines > 0 ? lines : 1;
		for(let i = 0; i < offset; i++) {
			console.log('');
		}
	}

	horizontalLine() {
		const width = process.stdout.columns;

		let line = '';
		for(let i = 0; i < width; i++) {
			line += '-';
		}
		console.log(line);
	};

	centered(str) {
		str = typeof str === 'string' && str.trim().length > 0 ? str.trim() : '';

		const width = process.stdout.columns;

		const offset = Math.floor((width - str.length) / 2);

		let line = '';
		for(let i = 0; i < offset; i++) {
			line += ' ';
		}

		line += str;

		console.log(line);

	};

	error(errorStr, errorInstance = null) {
		console.log('\x1b[31m%s\x1b[0m', errorStr, errorInstance);
	};

	header(title) {
		this.horizontalLine();
		this.centered(title);
		this.horizontalLine();
		this.verticalSpace(2);
	};

	renderList(data) {
		data = typeof data === 'object' && data !== null ? data : {};

		for(const key in data) {
			if(data.hasOwnProperty(key)) {
				const value = data[key];
				let line = `\x1b[34m${key}\x1b[0m`;
				const padding = 60 - line.length;


				for(let i = 0; i < padding; i++) {
					line += ' ';
				}

				console.log(line, value);
				this.verticalSpace(1);
			}
		}
	};
}

module.exports = new CliHelper();