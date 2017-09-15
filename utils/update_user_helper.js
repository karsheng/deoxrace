const request = require('supertest');
const app = require('../app');

module.exports = (
	token,
	{
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
	}
) => {
	return new Promise((resolve, reject) => {
		request(app)
			.put('/api/user/profile')
			.set('authorization', token)
			.send({
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
			})
			.end((err, res) => {
				resolve(res.body);
			});
	});
};
