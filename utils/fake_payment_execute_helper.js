const request = require('supertest');
const app = require('../app');

module.exports = (token, { reg_id }) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post(`/api/fakepayment/${reg_id}`)
			.set('authorization', token)
			.end((err, res) => {
				resolve(res.body);
			});
	});
};
