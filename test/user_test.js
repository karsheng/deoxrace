const request = require('supertest');
const assert = require('assert');
const app = require('../app');
const mongoose = require('mongoose');
const createUser = require('../utils/create_user_helper');
const updateUser = require('../utils/update_user_helper');
const data = require('../utils/test_data');
const signinUser = require('../utils/user_signin_helper');
const {
	fullName,
	phone,
	gender,
	identityNumber,
	nationality,
	countryOfResidence,
	city,
	postcode,
	stateName,
	emergencyContact,
	medicalCondition,
	dateOfBirth,
	postalAddress
} = data.participant;

describe('User Routes', function(done) {
	this.timeout(15000);
	var token;

	beforeEach(async () => {
		token = await createUser('gavin@hooli.com', 'qwerty123');
		await updateUser(
			token,
			fullName,
			phone,
			gender,
			identityNumber,
			nationality,
			countryOfResidence,
			city,
			postcode,
			stateName,
			emergencyContact,
			medicalCondition,
			dateOfBirth,
			postalAddress
		);
	});

	it('PUT to /api/user/profile updates the profile of the user', done => {
		request(app)
			.put('/api/user/profile')
			.set('authorization', token)
			.send({
				fullName: 'Gavin Belson',
				gender: 'male',
				identityNumber: 'A12345',
				nationality: 'United States',
				countryOfResidence: 'United States',
				city: 'San Francisco',
				postcode: 'ABC123',
				stateName: 'California',
				emergencyContact: 'Richard Hendricks',
				medicalCondition: 'High Cholestrol',
				dateOfBirth: new Date(1957, 1, 1),
				postalAddress: null
			})
			.end((err, res) => {
				const User = mongoose.model('user');
				User.findOne({ email: 'gavin@hooli.com' }).then(user => {
					assert(res.body.password === undefined);
					assert(user.fullName === 'Gavin Belson');
					assert(user.gender === 'male');
					assert(user.city === 'San Francisco');
					assert(user.postcode === 'ABC123');
					done();
				});
			});
	});

	it('GET to /api/user/profile returns profile of the user', done => {
		request(app)
			.get('/api/user/profile')
			.set('authorization', token)
			.end((err, res) => {
				assert(res.body.fullName === fullName);
				assert(res.body.phone === phone);
				assert(res.body.postcode === postcode);
				done();
			});
	});

	it('Failed login more than five times locks the account for two hours', async () => {
		var res = await signinUser('gavin@hooli.com', 'qwerty123');
		assert(res.body.token);
		await signinUser('gavin@hooli.com', 'wrongpassword');
		await signinUser('gavin@hooli.com', 'wrongpassword');
		await signinUser('gavin@hooli.com', 'wrongpassword');
		await signinUser('gavin@hooli.com', 'wrongpassword');
		await signinUser('gavin@hooli.com', 'wrongpassword');
		res = await signinUser('gavin@hooli.com', 'qwerty123');
		assert(res.body.token === undefined);
	});
});
