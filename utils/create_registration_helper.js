const request = require('supertest');
const app = require('../app');

module.exports = (
	token,
	race_id,
	category_id,
	{ orders, participant, registerForSelf }
) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post(`/api/registration/${race_id}/${category_id}`)
			.send({
				orders,
				participant,
				registerForSelf
			})
			.set('authorization', token)
			.end((err, res) => {
				if (err) reject(err);
				resolve(res.body);
			});
	});
};
