const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = mongoose.model('user');

describe('User Auth Controller', function(done) {
	this.timeout(15000);

	it('POST to /api/signup creates a user', done => {
		this.timeout(15000);
		request(app)
			.post('/api/signup')
			.send({
				email: 'gavin@hooli.com',
				password: 'qwerty123'
			})
			.end(async (err, res) => {
				const user = await User.findOne({ email: 'gavin@hooli.com' });
				assert(user.email === 'gavin@hooli.com');
				done();
			});
	});

	it('POST to /api/signin signs in a user and return a token', done => {
		request(app)
			.post('/api/signup')
			.send({
				email: 'gavin@hooli.com',
				password: 'qwerty123'
			})
			.end((err, res) => {
				request(app)
					.post('/api/signin')
					.send({
						email: 'gavin@hooli.com',
						password: 'qwerty123'
					})
					.end((err, res) => {
						assert(res.body.token);
						done();
					});
			});
	});
});
