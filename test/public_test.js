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

describe('Public Routes', function() {
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
			meals: [meal1],
			datetime: Date.now() + 1000 * 3600 * 24 * 300
		});
		runRace2 = await updateRace(adminToken, runRace2._id, {
			...data.race,
			name: 'Running Race 2',
			meals: [meal2],
			datetime: Date.now() + 1000 * 3600 * 24 * 270
		});
		runRace3 = await updateRace(adminToken, runRace3._id, {
			...data.race,
			name: 'Running Race 3',
			meals: [meal1, meal2],
			datetime: Date.now() + 1000 * 3600 * 24 * 240
		});
		swimRace = await updateRace(adminToken, swimRace._id, {
			...data.race,
			name: 'Swimming Race 1',
			meals: [meal1],
			datetime: Date.now() + 1000 * 3600 * 24 * 210
		});
		cyclingRace = await updateRace(adminToken, cyclingRace._id, {
			...data.race,
			name: 'Cycling Race 1',
			meals: [meal2],
			datetime: Date.now() + 1000 * 3600 * 24 * 180
		});

		multiRace = await updateRace(adminToken, multiRace._id, {
			...data.race,
			name: 'Multisports Race 1',
			meals: [meal1, meal2],
			datetime: Date.now() + 1000 * 3600 * 24 * 150
		});

		obsRace = await updateRace(adminToken, obsRace._id, {
			...data.race,
			name: 'Obstacle Race 1',
			meals: [meal1],
			datetime: Date.now() + 1000 * 3600 * 24 * 120
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
			open: false,
			datetime: Date.now() - 1000 * 3600 * 24 * 210
		});
	});

	it('GET to /api/race/:race_id returns race info', done => {
		request(app)
			.get(`/api/race/${swimRace._id}`)
			.end((err, res) => {
				assert(res.body.name === swimRace.name);
				assert(res.body.types[0] === 'swim');
				assert(res.body.meals[0].name === meal1.name);
				done();
			});
	});

	// TODO: upate with pagination
	it('GET to /api/race/open/all returns all open race info sorted by date (soonest first)', done => {
		request(app)
			.get('/api/race/open/all')
			.end((err, res) => {
				assert(res.body.length === 7);
				assert(res.body[0].name === 'Obstacle Race 1');
				assert(res.body[6].name === 'Running Race 1');
				done();
			});
	});

	it('GET to /api/race/open with types query returns all open specific race sorted by date (soonest first)', done => {
		request(app)
			.get('/api/race/open?types=run')
			.end((err, res) => {
				assert(res.body.length === 3);
				assert(res.body[0].name === 'Running Race 3');
				request(app)
					.get('/api/race/open?types=swim')
					.end((err, res) => {
						assert(res.body.length === 1);
						assert(res.body[0].name === 'Swimming Race 1');
						done();
					});
			});
	});
});
