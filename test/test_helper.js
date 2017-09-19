const mongoose = require('mongoose');

before(done => {
	mongoose.connect('mongodb://localhost/deoevents_test');
	mongoose.connection.once('open', () => done()).on('error', err => {
		console.warn('Warning', error);
	});
	process.on('unhandledRejection', (reason, p) => {
		console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
		// application specific logging, throwing an error, or other logic here
	});
});

beforeEach(done => {
	mongoose.connection.db.dropDatabase(function() {
		done();
	});
});
