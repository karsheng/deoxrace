const request = require('supertest');
const app = require('../app');

module.exports = (
	token,
	race_id,
	category,
	orders,
	participant,
	registerForSelf
) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post(`/api/race/register/${race_id}`)
			.send({
				category,
				orders,
				participant,
				registerForSelf
			})
			.set('authorization', token)
			.end((err, res) => {
				resolve(res.body);
			});
	});
};
