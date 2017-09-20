const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const _ = require('lodash');

const data = require('../utils/test_data');
const createAdmin = require('../utils/create_admin_helper');
const createUser = require('../utils/create_user_helper');
const createRace = require('../utils/create_race_helper');
const createCategory = require('../utils/create_category_helper');
const updateRace = require('../utils/update_race_helper');
const createRegistration = require('../utils/create_registration_helper');
const executeFakePayment = require('../utils/fake_payment_execute_helper');

describe('Availability Routes', function() {
	this.timeout(20000);
	var adminToken, userToken;
	var race;
	var cat1, cat2, cat3, cat4;

	beforeEach(async () => {
		adminToken = await createAdmin(data.admin);
		userToken = await createUser({
			email: data.user.email,
			password: data.user.password
		});
		race = await createRace(adminToken, { name: 'Race' });
		cat1 = await createCategory(adminToken, race._id, {
			...data.categories.one,
			participantLimit: 1
		});
		cat2 = await createCategory(adminToken, race._id, data.categories.one);
		cat3 = await createCategory(adminToken, race._id, data.categories.one);
		cat4 = await createCategory(adminToken, race._id, data.categories.one);
		race = await updateRace(adminToken, race._id, {
			...data.race,
			delivery: data.delivery
		});

		const reg = await createRegistration(userToken, race._id, cat1._id, {
			orders: [],
			participant: data.participant,
			registerForSelf: true
		});

		await executeFakePayment(userToken, { registration_id: reg._id });
	});

	it('GET to /api/race/category/availability/:race_id returns an array of availability of a race categories', done => {
		request(app)
			.get(`/api/race/category/availability/${race._id}`)
			.set('authorization', userToken)
			.end((err, res) => {
				assert(res.body.length === 4);
				var availability = {};
				_.map(res.body, a => {
					_.merge(availability, a);
				});
				assert(availability[cat1._id] === false);
				assert(availability[cat2._id] === true);
				assert(availability[cat3._id] === true);
				assert(availability[cat4._id] === true);
				done();
			});
	});
});
