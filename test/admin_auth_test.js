const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const createAdmin = require('../utils/create_admin_helper');

describe('Admin Auth Controller', function(done) {
	this.timeout(20000);
	var adminToken;
	const params = {
		email: 'richard@piedpiper.com',
		password: 'qwerty123'
	};

	beforeEach(async () => {
		adminToken = await createAdmin(params);
	});

	it('POST to /api/admin/create creates a new admin', done => {
		request(app)
			.post('/api/admin/create')
			.send({
				email: 'jared@piedpiper.com',
				password: 'qwerty123'
			})
			.end((err, res) => {
				assert(res.body.token);
				done();
			});
	});

	it('POST to /api/admin/signin signs in the admin', done => {
		request(app)
			.post('/api/admin/signin')
			.send(params)
			.end((err, res) => {
				assert(res.body.token);
				done();
			});
	});
});
