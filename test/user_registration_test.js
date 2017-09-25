const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

const data = require('../utils/test_data');
const createAdmin = require('../utils/create_admin_helper');
const createUser = require('../utils/create_user_helper');
const createRace = require('../utils/create_race_helper');
const createCategory = require('../utils/create_category_helper');
const createMeal = require('../utils/create_meal_helper');
const updateRace = require('../utils/update_race_helper');
const createRegistration = require('../utils/create_registration_helper');

const Registration = mongoose.model('registration');

describe('User Registration Routes', function() {
	this.timeout(20000);
	var adminToken, userToken;
	var race1, race2;
	var cat1, cat2;
	var meal1, meal2;

	beforeEach(async () => {
		adminToken = await createAdmin(data.admin);
		userToken = await createUser({
			email: data.user.email,
			password: data.user.password
		});
		race1 = await createRace(adminToken, { name: 'Race 1' });
		cat1 = await createCategory(adminToken, race1._id, data.categories.one);
		meal1 = await createMeal(adminToken, data.meals.one);
		await updateRace(adminToken, race1._id, {
			...data.race,
			name: 'Race 1',
			meals: [meal1],
			collectionInfo: data.collection,
			organizer: data.organizer,
			apparel: data.apparel,
			delivery: data.delivery
		});
		race2 = await createRace(adminToken, { name: 'Race 2' });
		cat2 = await createCategory(adminToken, race2._id, data.categories.one);
		meal2 = await createMeal(adminToken, data.meals.two);
		await updateRace(adminToken, race2._id, {
			...data.race,
			name: 'Race 2',
			meals: [meal2],
			collectionInfo: data.collection,
			organizer: data.organizer,
			apparel: data.apparel,
			delivery: data.delivery
		});
	});

	it('POST to /api/registration/:race_id/:category_id', done => {
		request(app)
			.post(`/api/registration/${race1._id}/${cat1._id}`)
			.set('authorization', userToken)
			.send({
				participant: data.participant,
				registerForSelf: true,
				orders: [
					{
						meal: meal1._id,
						quantity: 1
					}
				]
			})
			.end(async (err, res) => {
				const reg = await Registration.findById(res.body._id)
					.populate({ path: 'user', model: 'user' })
					.populate({ path: 'race', model: 'race' })
					.populate({ path: 'category', model: 'category' })
					.populate({ path: 'participant', model: 'participant' });
				assert(reg.totalBill === 10900);
				assert(reg.race.name === 'Race 1');
				assert(reg.user.name === data.user.name);
				assert(reg.category.name === cat1.name);
				assert(reg.paid === false);
				assert(reg.registerForSelf === true);
				assert(reg.participant.fullName === data.participant.fullName);
				done();
			});
	});

	it('updates users registration document with unpaid = true when user register again', async () => {
		const reg = await createRegistration(userToken, race1._id, cat1._id, {
			orders: [],
			participant: data.participant,
			registerForSelf: true
		});
		assert(reg.participant.fullName === 'Gavin Belson');
		assert(reg.totalBill === 10000);
		assert(reg.race._id.toString() === race1._id.toString());
		assert(reg.category._id.toString() === cat1._id.toString());
		assert(reg.registerForSelf === true);

		const reg2 = await createRegistration(userToken, race2._id, cat2._id, {
			orders: [
				{
					meal: meal2._id,
					quantity: 1
				}
			],
			participant: { ...data.participant, fullName: 'Bertram Gilfolye' },
			registerForSelf: false
		});

		assert(reg2.participant.fullName === 'Bertram Gilfolye');
		assert(reg2.totalBill === 11090);
		assert(reg2.race._id.toString() === race2._id.toString());
		assert(reg2.category._id.toString() === cat2._id.toString());
		assert(reg2.registerForSelf === false);

		assert(reg._id.toString() === reg2._id.toString());
	});

	it('GET to /api/registration/:registration_id returns the registration', done => {
		createRegistration(userToken, race1._id, cat1._id, {
			orders: [],
			participant: data.participant,
			registerForSelf: true
		}).then(reg => {
			request(app)
				.get(`/api/registration/${reg._id}`)
				.set('authorization', userToken)
				.end((err, res) => {
					assert(res.body.race.name === 'Race 1');
					assert(res.body.orders.length === 0);
					// not eligible for earlybird
					assert(res.body.totalBill === 10000);
					assert(
						res.body.participant.registration.toString() === reg._id.toString()
					);
					assert(res.body.participant.fullName === 'Gavin Belson');
					done();
				});
		});
	});
});
