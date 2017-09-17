const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

const data = require('../utils/test_data');
const createAdmin = require('../utils/create_admin_helper');
const createUser = require('../utils/create_user_helper');
const createRace = require('../utils/create_race_helper');
const createCategory = require('../utils/create_category_helper');
const updateRace = require('../utils/update_race_helper');
const createRegistration = require('../utils/create_registration_helper');
const executeFakePayment = require('../utils/fake_payment_execute_helper');

const Registration = mongoose.model('registration');

describe('Fake Payment Routes', function() {
	this.timeout(20000);
	var userToken, race, category, participant, registration;

	beforeEach(async () => {
		const adminToken = await createAdmin(data.admin);
		userToken = await createUser({
			email: data.user.email,
			password: data.user.password
		});

		race = await createRace(adminToken, { name: data.race.name });

		participant = { ...data.participant };

		category = await createCategory(adminToken, race._id, {
			...data.categories.one
		});

		await updateRace(adminToken, race._id, {
			...data.race,
			delivery: data.delivery
		});

		registration = await createRegistration(userToken, race._id, category._id, {
			orders: [],
			participant,
			registerForSelf: true
		});
	});

	it('POST to /api/fakepayment/:registration_id executes payment', done => {
		request(app)
			.post(`/api/fakepayment/${registration._id}`)
			.set('authorization', userToken)
			.end(async (err, res) => {
				assert(
					res.body.registration.toString() === registration._id.toString()
				);
				assert(res.body.amount === registration.totalBill);
				const result = await Registration.findById(registration._id);
				assert(result.paid === true);
				done();
			});
	});

	it('rejects multiple payments', async () => {
		const payment = await executeFakePayment(userToken, {
			registration_id: registration._id
		});
		assert(payment.amount === 10000);
		const repeatedPayment = await await executeFakePayment(userToken, {
			registration_id: registration._id
		});
		assert(repeatedPayment.message === 'Payment already made');
	});
});
