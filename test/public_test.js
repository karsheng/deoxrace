const assert = require('assert');
const request = require('supertest');
const app = require('../app');

const data = require('../utils/test_data');
const createAdmin = require('../utils/create_admin_helper');
const createUser = require('../utils/create_user_helper');
const createRace = require('../utils/create_race_helper');
const createCategory = require('../utils/create_category_helper');
const createMeal = require('../utils/create_meal_helper');
const updateRace = require('../utils/update_race_helper');

describe('GET to /api/race/:race_id returns race info', function() {
	this.timeout(20000);
	// 8 races: 7 open, 1 closed;
	var runRace, runRace2, runRace3;
	var swimRace, cyclingRace, multiRace, obsRace;
	var runCat, runCat2, runCat3;
	var swimCat, cyclingCat, multiCat, obsCat;
	var meal1, meal2;
	var closedRace, closedRaceCat;

	beforeEach(async () => {
		adminToken = await createAdmin(data.admin);
		userToken = await createUser({
			email: data.user.email,
			password: data.user.password
		});

		runRace = await createRace(adminToken, { name: 'Running Race 1' });
		runRace2 = await createRace(adminToken, { name: 'Running Race 2' });
		runRace3 = await createRace(adminToken, { name: 'Running Race 3' });
		swimRace = await createRace(adminToken, { name: 'Swimming Race 1' });
		cyclingRace = await createRace(adminToken, { name: 'Cycling Race 1' });
		multiRace = await createRace(adminToken, { name: 'Multisports Race 1' });
		obsRace = await createRace(adminToken, { name: 'Obstacle Race 1' });

		runCat = await createCategory(adminToken, runRace._id, { type: 'run' });
		runCat2 = await createCategory(adminToken, runRace2._id, { type: 'run' });
		runCat3 = await createCategory(adminToken, runRace3._id, { type: 'run' });
		swimCat = await createCategory(adminToken, swimRace._id, { type: 'swim' });
		cyclingCat = await createCategory(adminToken, cyclingRace._id, {
			type: 'cycling'
		});
		multiCat = await createCategory(adminToken, multiRace._id, {
			type: 'multi'
		});
		obsCat = await createCategory(adminToken, obsRace._id, {
			type: 'obstacle'
		});

		meal1 = await createMeal(adminToken, data.meals.one);
		meal2 = await createMeal(adminToken, data.meals.two);

		runRace = await updateRace(adminToken, runRace._id, {
			...data.race,
			name: 'Running Race 1',
			meals: [meal1]
		});
		runRace2 = await updateRace(adminToken, runRace2._id, {
			...data.race,
			name: 'Running Race 2',
			meals: [meal2]
		});
		runRace3 = await updateRace(adminToken, runRace3._id, {
			...data.race,
			name: 'Running Race 3',
			meals: [meal1, meal2]
		});
		swimRace = await updateRace(adminToken, swimRace._id, {
			...data.race,
			name: 'Swimming Race 1',
			meals: [meal1]
		});
		cyclingRace = await updateRace(adminToken, cyclingRace._id, {
			...data.race,
			name: 'Cycling Race 1',
			meals: [meal2]
		});

		multiRace = await updateRace(adminToken, multiRace._id, {
			...data.race,
			name: 'Multisports Race 1',
			meals: [meal1, meal2]
		});

		obsRace = await updateRace(adminToken, obsRace._id, {
			...data.race,
			name: 'Obstacle Race 1',
			meals: [meal1]
		});

		// closed race
		closedRace = await createRace(adminToken, { name: 'Closed Race 1' });
		closedRaceCat = await createCategory(
			adminToken,
			closedRace._id,
			data.categories.one
		);
		closedRace = await updateRace(adminToken, closedRace._id, {
			...data.race,
			name: 'Closed Race 1',
			open: false
		});
	});

	it('GET to /api/race/:race_id returns race info', done => {
		request(app)
			.get(`/api/race/${swimRace._id}`)
			.end((err, res) => {
				try {
					assert(res.body.name === swimRace.name);
					assert(res.body.types[0] === 'swim');
				} catch (e) {
					console.log(e);
				} finally {
					done();
				}
			});
	});
});
