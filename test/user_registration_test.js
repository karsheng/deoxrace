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

const Registration = mongoose.model('registration');

describe('User Registration Routes', function() {
	this.timeout(20000);
	var adminToken, userToken;
	var race1;
	var cat1;
	var meal1;

	beforeEach(async () => {
		adminToken = await createAdmin(data.admin);
		userToken = await createUser({
			email: data.user.email,
			password: data.user.password
		});
		race1 = await createRace(adminToken, { name: data.race.name });
		cat1 = await createCategory(adminToken, race1._id, data.categories.one);
		meal1 = await createMeal(adminToken, data.meals.one);
		await updateRace(adminToken, race1._id, {
			...data.race,
			meals: [meal1],
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

				try {
					assert(reg.totalBill === 10900);
					assert(reg.race.name === data.race.name);
					assert(reg.user.name === data.user.name);
					assert(reg.category.name === cat1.name);
					assert(reg.paid === false);
					assert(reg.registerForSelf === true);
					assert(reg.participant.fullName === data.participant.fullName);
					done();
				} catch (err) {
					console.log(err);
					done();
				}
			});
	});
});
