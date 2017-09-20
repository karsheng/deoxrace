const mongoose = require('mongoose');
const Race = mongoose.model('race');

module.exports = (app, requireAuth) => {
	app.get(
		'/api/race/category/availability/:race_id',
		requireAuth,
		async (req, res, next) => {
			try {
				const { race_id } = req.params;

				const race = await Race.findById(race_id).populate({
					path: 'categories',
					model: 'category'
				});
				const availabilities = race.categories.map(category => {
					return getAvailability(category);
				});

				res.json(await Promise.all(availabilities));
			} catch (err) {
				next(err);
			}
		}
	);
};

function getAvailability(category) {
	return new Promise((resolve, reject) => {
		var availability = {};
		return category.checkAvailability(function(err, available) {
			if (err) return reject(err);
			availability[category._id] = available;
			resolve(availability);
		});
	});
}
