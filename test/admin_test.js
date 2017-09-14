const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const createAdmin = require('../utils/create_admin_helper');
const data = require('../utils/test_data');
const mongoose = require('mongoose');
const Race = mongoose.model('race');

describe('Admin Routes', function(done) {
	this.timeout(20000);
	var adminToken;

	beforeEach(async () => {
		const { email, password } = data.admin;
		adminToken = await createAdmin(email, password);
	});

	it('POST to /api/admin/race/create creates a new race', done => {
		request(app)
			.post('/api/admin/race/create')
			.set('admin-authorization', adminToken)
			.send({ name: 'Race 1' })
			.end(async (err, res) => {
				const race = await Race.findOne({ name: 'Race 1' });
				assert(race.name === 'Race 1');
				done();
			});
	});
});
