const request = require('supertest');
const app = require('../app');

module.exports = (
	token,
	race_id,
	{
		name,
		price,
		gender,
		ageMin,
		ageMax,
		participantLimit,
		prize,
		type,
		distance
	}
) => {
	return new Promise((resolve, reject) => {
		request(app)
			.post(`/api/admin/category/create/${race_id}`)
			.set('admin-authorization', token)
			.send({
				name,
				price,
				gender,
				ageMin,
				ageMax,
				participantLimit,
				prize,
				type,
				distance
			})
			.end((err, res) => {
				resolve(res.body);
			});
	});
};
