const Race = require('../models/Race');

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
};
