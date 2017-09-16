const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const data = require('../utils/test_data');

const mongoose = require('mongoose');
const Race = mongoose.model('race');
const Category = mongoose.model('category');
const Meal = mongoose.model('meal');

const createAdmin = require('../utils/create_admin_helper');
const createRace = require('../utils/create_race_helper');
const createCategory = require('../utils/create_category_helper');
const createMeal = require('../utils/create_meal_helper');

describe('Admin Routes', function(done) {
	this.timeout(20000);
	var adminToken, race;
	var cat1;
	var meal1;

	beforeEach(async () => {
		adminToken = await createAdmin(data.admin);
		race = await createRace(adminToken, { name: data.race.name });
		cat1 = await createCategory(adminToken, race._id, data.categories.one);
		meal1 = await createMeal(adminToken, data.meals.one);
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

	it('PUT to /api/admin/race/:race_id updates the race', done => {
		request(app)
			.put(`/api/admin/race/${race._id}`)
			.set('admin-authorization', adminToken)
			.send({
				...data.race,
				meals: [meal1._id],
				collectionInfo: data.collection
			})
			.end(async (err, res) => {
				const result = await Race.findById(race._id)
					.populate({
						path: 'meals',
						ref: 'meal'
					})
					.populate({
						path: 'categories',
						ref: 'category'
					});
				assert(result.meals[0].name === meal1.name);
				assert(result.categories[0].name === cat1.name);
				assert(
					new Date(result.earlyBirdDeadline).getYear() ===
						data.race.earlyBirdDeadline.getYear()
				);
				assert(result.types[0] === 'run');
				done();
			});
	});

	it('DELETE to /api/admin/race/:race_id deletes a race', done => {
		request(app)
			.delete(`/api/admin/race/${race._id}`)
			.set('admin-authorization', adminToken)
			.end(async (err, res) => {
				const result = await Race.findById(race._id);
				assert(result === null);
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

	it('DELETE to /api/admin/category/:category_id deletes a category', done => {
		request(app)
			.delete(`/api/admin/category/${cat1._id}`)
			.set('admin-authorization', adminToken)
			.end(async (err, res) => {
				const result = await Category.findOne({ name: cat1.name });
				assert(result === null);
				done();
			});
	});

	it('POST to /api/admin/meal/create creates a new meal', done => {
		request(app)
			.post('/api/admin/meal/create')
			.set('admin-authorization', adminToken)
			.send({
				name: 'Burger',
				price: 1900,
				description: 'McDonalds',
				imageUrl: 'image.jpg'
			})
			.end(async (err, res) => {
				const result = await Meal.findOne({ name: 'Burger' });
				assert(result.price === 1900);
				assert(result.description === 'McDonalds');
				assert(result.imageUrl === 'image.jpg');
				done();
			});
	});

	it('DELETE to /api/admin/meal/:meal_id deletes a meal', done => {
		request(app)
			.delete(`/api/admin/meal/${meal1._id}`)
			.set('admin-authorization', adminToken)
			.end(async (err, res) => {
				const result = await Meal.findById(meal1._id);
				assert(result === null);
				done();
			});
	});
});
