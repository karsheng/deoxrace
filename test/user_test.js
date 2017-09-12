const request = require('supertest');
const assert = require('assert');
const app = require('../app');
const mongoose = require('mongoose');

describe('User Routes', function(done) {
	this.timeout(15000);
	var token;

	beforeEach(done => {
		request(app)
			.post('/api/signup')
			.send({
				email: 'gavin@hooli.com',
				password: 'qwerty123'
			})
			.end((err, res) => {
				token = res.body.token;
				done();
			});
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
});
