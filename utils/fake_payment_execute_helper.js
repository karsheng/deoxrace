const request = require('supertest');
const app = require('../app');

module.exports = (token, { registration_id }) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post(`/api/fakepayment/${registration_id}`)
			.set('authorization', token)
			.end((err, res) => {
				resolve(res.body);
			});
	});
};
