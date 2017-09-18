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
const getAge = require('../utils/calculate_age_helper');
const executeFakePayment = require('../utils/fake_payment_execute_helper');

const Registration = mongoose.model('registration');

describe('Registration rules', function() {
	this.timeout(20000);
	var adminToken, userToken;
	var race;

	beforeEach(async () => {
		adminToken = await createAdmin(data.admin);
		userToken = await createUser({
			email: data.user.email,
			password: data.user.password
		});
		race = await createRace(adminToken, { name: 'Race ' });
	});

	it('returns error if user age does not fall within allowable age range', async () => {
		const participant = { ...data.participant };
		const age = getAge(participant.dateOfBirth);
		const ageMax = age - 5;

		const category = await createCategory(adminToken, race._id, {
			...data.categories.one,
			ageMin: 0,
			ageMax
		});
		await updateRace(adminToken, race._id, {
			...data.race,
			delivery: data.delivery
		});
		const regError = await createRegistration(
			userToken,
			race._id,
			category._id,
			{
				orders: [],
				participant,
				registerForSelf: true
			}
		);
		assert(regError.message === 'Not allowed to register for this category');
	});

	it('returns error if user gender does not match category gender', async () => {
		const participant = { ...data.participant, gender: 'male' };

		const category = await createCategory(adminToken, race._id, {
			...data.categories.one,
			gender: 'female'
		});

		await updateRace(adminToken, race._id, {
			...data.race,
			delivery: data.delivery
		});
		const regError = await createRegistration(
			userToken,
			race._id,
			category._id,
			{
				orders: [],
				participant,
				registerForSelf: true
			}
		);
		assert(regError.message === 'Not allowed to register for this category');
	});

	it('returns error if user tries to register to a category that is full', async () => {
		// create category and set participantLimit to 1
		const category = await createCategory(adminToken, race._id, {
			...data.categories.one,
			participantLimit: 1
		});
		await updateRace(adminToken, race._id, {
			...data.race,
			delivery: data.delivery
		});

		// registration for first participant to make category reaches its participant limit
		const participant = { ...data.participant, fullName: 'P1' };
		const reg = await createRegistration(userToken, race._id, category._id, {
			orders: [],
			participant,
			registerForSelf: true
		});
		const payment = await executeFakePayment(userToken, {
			registration_id: reg._id
		});
		// ensures first registration is successful by checking if the
		// payment object returned has the correct registration id
		assert(payment.registration.toString() === reg._id.toString());

		// registration for second participant
		const participant2 = { ...data.participant, fullName: 'P2' };
		const anotherRegistration = await createRegistration(
			userToken,
			race._id,
			category._id,
			{
				orders: [],
				participant: participant2,
				registerForSelf: true
			}
		);
		assert(
			anotherRegistration.message === 'Registration for this category is closed'
		);
	});

	it('returns error if user tries to register to a race that is already closed', async () => {
		const category = await createCategory(
			adminToken,
			race._id,
			data.categories.one
		);
		await updateRace(adminToken, race._id, { ...data.race, open: false });
		const regError = await createRegistration(
			userToken,
			race._id,
			category._id,
			{
				orders: [],
				participant: data.participant,
				registerForSelf: true
			}
		);
		assert(regError.message === 'Registration for this category is closed');
	});

	it('returns error if user tries to register for race that where the registration deadline has passed', async () => {
		const category = await createCategory(
			adminToken,
			race._id,
			data.categories.one
		);
		await updateRace(adminToken, race._id, {
			...data.race,
			registrationDeadline: Date.now() - 5 * 24 * 60 * 60 * 1000
		});
		const regError = await createRegistration(
			userToken,
			race._id,
			category._id,
			{
				orders: [],
				participant: data.participant,
				registerForSelf: true
			}
		);
		assert(regError.message === 'Registration for this category is closed');
	});
});
