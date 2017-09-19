const mongoose = require('mongoose');
const Race = mongoose.model('race');

module.exports = app => {
	app.get('/api/race/:race_id', async (req, res, next) => {
		const { race_id } = req.params;
		try {
			const race = await Race.findById(race_id)
				.populate({ path: 'categories', model: 'category' })
				.populate({ path: 'meals', model: 'meal' });
			res.json(race);
		} catch (err) {
			next(err);
		}
	});

	app.get('/api/race/open/all', async (req, res, next) => {
		try {
			const races = Race.find({ open: true })
				.populate({ path: 'categories', model: 'category' })
				.sort({ datetime: 1 });

			res.json(races);
		} catch (err) {
			next(err);
		}
	});

	app.get('/api/race/open', async (req, res, next) => {
		// example: /api/race/open?type=run
		const { type } = req.query;
		// returns all open races if type === 'any'
		const query = type === 'any' ? { open: true } : { type, open: true };

		try {
			const races = await Race.find(query)
				.populate({ path: 'categories', model: 'category' })
				.sort({ datetime: 1 });
		} catch (err) {
			next(err);
		}
	});
};
