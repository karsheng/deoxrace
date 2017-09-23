const request = require('supertest');
const app = require('../app');

const data = require('../utils/test_data');
const createAdmin = require('../utils/create_admin_helper');
const createUser = require('../utils/create_user_helper');
const createRace = require('../utils/create_race_helper');
const createCategory = require('../utils/create_category_helper');
const createMeal = require('../utils/create_meal_helper');
const updateRace = require('../utils/update_race_helper');

const seeding = async () => {
	const adminToken = await createAdmin(data.admin);
	const runRace = await createRace(adminToken, { name: 'Running Race 1' });
	const runRace2 = await createRace(adminToken, { name: 'Running Race 2' });
	const runRace3 = await createRace(adminToken, { name: 'Running Race 3' });
	const swimRace = await createRace(adminToken, { name: 'Swimming Race 1' });
	const cyclingRace = await createRace(adminToken, { name: 'Cycling Race 1' });
	const multiRace = await createRace(adminToken, {
		name: 'Multisports Race 1'
	});
	const obsRace = await createRace(adminToken, { name: 'Obstacle Race 1' });

	const runCat = await createCategory(adminToken, runRace._id, {
		...data.categories.one,
		type: 'run'
	});
	const runCat2 = await createCategory(adminToken, runRace2._id, {
		...data.categories.one,
		type: 'run'
	});
	const runCat3 = await createCategory(adminToken, runRace3._id, {
		...data.categories.one,
		type: 'run'
	});
	const swimCat = await createCategory(adminToken, swimRace._id, {
		...data.categories.one,
		type: 'swim'
	});
	const cyclingCat = await createCategory(adminToken, cyclingRace._id, {
		...data.categories.one,
		type: 'cycling'
	});
	const multiCat = await createCategory(adminToken, multiRace._id, {
		...data.categories.one,
		type: 'multi'
	});
	const obsCat = await createCategory(adminToken, obsRace._id, {
		...data.categories.one,
		type: 'obstacle'
	});

	const meal1 = await createMeal(adminToken, data.meals.one);
	const meal2 = await createMeal(adminToken, data.meals.two);

	await updateRace(adminToken, runRace._id, {
		...data.race,
		organizer: data.organizer,
		apparel: data.apparel,
		delivery: data.delivery,
		collectionInfo: data.collection,
		name: 'Running Race 1',
		meals: [meal1],
		datetime: Date.now() + 1000 * 3600 * 24 * 300
	});
	await updateRace(adminToken, runRace2._id, {
		...data.race,
		organizer: data.organizer,
		apparel: data.apparel,
		delivery: data.delivery,
		collectionInfo: data.collection,
		name: 'Running Race 2',
		meals: [meal2],
		datetime: Date.now() + 1000 * 3600 * 24 * 270
	});
	await updateRace(adminToken, runRace3._id, {
		...data.race,
		organizer: data.organizer,
		apparel: data.apparel,
		delivery: data.delivery,
		collectionInfo: data.collection,
		name: 'Running Race 3',
		meals: [meal1, meal2],
		datetime: Date.now() + 1000 * 3600 * 24 * 240
	});
	await updateRace(adminToken, swimRace._id, {
		...data.race,
		organizer: data.organizer,
		apparel: data.apparel,
		delivery: data.delivery,
		collectionInfo: data.collection,
		name: 'Swimming Race 1',
		meals: [meal1],
		datetime: Date.now() + 1000 * 3600 * 24 * 210
	});
	await updateRace(adminToken, cyclingRace._id, {
		...data.race,
		organizer: data.organizer,
		apparel: data.apparel,
		delivery: data.delivery,
		collectionInfo: data.collection,
		name: 'Cycling Race 1',
		meals: [meal2],
		datetime: Date.now() + 1000 * 3600 * 24 * 180
	});

	await updateRace(adminToken, multiRace._id, {
		...data.race,
		organizer: data.organizer,
		apparel: data.apparel,
		delivery: data.delivery,
		collectionInfo: data.collection,
		name: 'Multisports Race 1',
		meals: [meal1, meal2],
		datetime: Date.now() + 1000 * 3600 * 24 * 150
	});

	await updateRace(adminToken, obsRace._id, {
		...data.race,
		organizer: data.organizer,
		apparel: data.apparel,
		delivery: data.delivery,
		collectionInfo: data.collection,
		name: 'Obstacle Race 1',
		meals: [meal1],
		datetime: Date.now() + 1000 * 3600 * 24 * 120
	});

	// closed race
	const closedRace = await createRace(adminToken, { name: 'Closed Race 1' });
	const closedRaceCat = await createCategory(
		adminToken,
		closedRace._id,
		data.categories.one
	);
	await updateRace(adminToken, closedRace._id, {
		...data.race,
		organizer: data.organizer,
		apparel: data.apparel,
		delivery: data.delivery,
		collectionInfo: data.collection,
		name: 'Closed Race 1',
		open: false,
		datetime: Date.now() - 1000 * 3600 * 24 * 210
	});

	console.log('done seeding');
	process.exit();
};

seeding();
