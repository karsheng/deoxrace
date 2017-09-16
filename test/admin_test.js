const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const data = require('../utils/test_data');
const mongoose = require('mongoose');
const Race = mongoose.model('race');
const Category = mongoose.model('category');

const createAdmin = require('../utils/create_admin_helper');
const createRace = require('../utils/create_race_helper');

describe('Admin Routes', function(done) {
	this.timeout(20000);
	var adminToken, race;

	beforeEach(async () => {
		adminToken = await createAdmin(data.admin);
		race = await createRace(adminToken, { name: data.race.name });
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

	it('POST to /api/admin/category/create/:race_id creates a new category', done => {
		request(app)
			.post(`/api/admin/category/create/${race._id}`)
			.set('admin-authorization', adminToken)
			.send({
				name: '5km Women',
				price: { earlyBird: 5000, normal: 6000 },
				gender: 'female',
				ageMin: 21,
				ageMax: 99,
				participantLimit: 20,
				prize: 'RM 100',
				type: 'run',
				distance: 5
			})
			.end(async (err, res) => {
				const result = await Category.findOne({ name: '5km Women' });
				assert(result.price.earlyBird === 5000);
				assert(result.price.normal === 6000);
				assert(result.gender === 'female');
				assert(result.participantLimit === 20);
				assert(result.race.toString() === race._id.toString());
				assert(result.prize === 'RM 100');
				assert(result.type === 'run');
				assert(result.distance === 5);
				done();
			});
	});
});
