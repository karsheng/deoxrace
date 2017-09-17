const request = require('supertest');
const app = require('../app');

module.exports = (
	token,
	race_id,
	{
		name,
		datetime,
		address,
		lat,
		lng,
		description,
		imageUrl,
		categories,
		meals,
		open,
		collectionInfo,
		resultUrl,
		stateName,
		earlyBirdDeadline,
		registrationDeadline,
		organizer,
		apparel,
		delivery
	}
) => {
	return new Promise((resolve, reject) => {
		request(app)
			.put(`/api/admin/race/${race_id}`)
			.set('admin-authorization', token)
			.send({
				name,
				datetime,
				address,
				lat,
				lng,
				description,
				imageUrl,
				categories,
				meals,
				open,
				collectionInfo,
				resultUrl,
				stateName,
				earlyBirdDeadline,
				registrationDeadline,
				organizer,
				apparel,
				delivery
			})
			.end((err, res) => {
				resolve(res.body);
			});
	});
};
