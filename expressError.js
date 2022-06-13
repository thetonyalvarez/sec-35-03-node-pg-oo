// expressError.js

// An extension of JS error that handles errors when
// an instance of it is created.

class ExpressError extends Error {
	constructor(message, status) {
		super();
		this.message = message;
		this.status = status;
		console.error(this.stack);
	}
}

module.exports = { ExpressError };