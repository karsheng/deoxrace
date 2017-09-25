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
	email,
	password,
	phone,
	gender,
	identityNumber,
	nationality,
	countryOfResidence,
	city,
	postcode,
	stateName,
	emergencyContact,
	hasMedicalCondition,
	medicalConditionDescription,
	dateOfBirth,
	postalAddress
} = data.user;

describe('User Routes', function(done) {
	this.timeout(20000);
	var token;

	beforeEach(async () => {
		token = await createUser({ email, password });
		await updateUser(token, {
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
			hasMedicalCondition,
			medicalConditionDescription,
			dateOfBirth,
			postalAddress
		});
	});

	it('PUT to /api/user/profile updates the profile of the user', done => {
		request(app)
			.put('/api/user/profile')
			.set('authorization', token)
			.send({
				fullName: 'Gavin Belson',
				phone: '1234567',
				gender: 'male',
				identityNumber: 'A12345',
				nationality: 'Malaysia',
				countryOfResidence: 'Malaysia',
				city: 'Kuala Lumpur',
				postcode: '54321',
				stateName: 'Kuala Lumpur',
				emergencyContact: {
					name: 'Jared Dunn',
					relationship: 'friend',
					phone: '1234567'
				},
				hasMedicalCondition: true,
				medicalConditionDescription: 'high cholesterol',
				dateOfBirth: new Date(1957, 1, 1),
				postalAddress: null
			})
			.end(async (err, res) => {
				const User = mongoose.model('user');
				const user = await User.findOne({ email });
				assert(res.body.password === undefined);
				assert(user.fullName === 'Gavin Belson');
				assert(user.gender === 'male');
				assert(user.city === 'Kuala Lumpur');
				assert(user.emergencyContact.name === 'Jared Dunn');
				done();
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
				assert(res.body.hasMedicalCondition === hasMedicalCondition);
				done();
			});
	});

	it('Failed login more than five times locks the account for two hours', async () => {
		var res = await signinUser({ email, password });
		assert(res.body.token);
		await signinUser({ email, password: 'wrongpassword' });
		await signinUser({ email, password: 'wrongpassword' });
		await signinUser({ email, password: 'wrongpassword' });
		await signinUser({ email, password: 'wrongpassword' });
		await signinUser({ email, password: 'wrongpassword' });
		res = await signinUser({ email, password });
		assert(res.body.token === undefined);
	});
});
