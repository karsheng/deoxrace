const Race = require('../models/Race');
const Category = require('../models/Category');

module.exports = (app, requireAdminAuth) => {
	app.post(
		'/api/admin/race/create',
		requireAdminAuth,
		async (req, res, next) => {
			try {
				const { name } = req.body;
				const race = new Race({ name });
				res.json(await race.save());
			} catch (err) {
				next(err);
			}
		}
	);

	app.post(
		'/api/admin/category/create/:race_id',
		requireAdminAuth,
		async (req, res, next) => {
			try {
				const { race_id } = req.params;
				const stuff = req.body;

				const race = await Race.findById(race_id);

				if (!race) return res.status(422).send({ error: 'Race not found' });

				const {
					name,
					price,
					gender,
					ageMin,
					ageMax,
					participantLimit,
					prize,
					type,
					distance
				} = req.body;

				const category = new Category({
					name,
					price,
					gender,
					ageMin,
					ageMax,
					participantLimit,
					race,
					prize,
					type,
					distance
				});

				await category.save();
				res.send(category);
			} catch (err) {
				next(err);
			}
		}
	);
};
