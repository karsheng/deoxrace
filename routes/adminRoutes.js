const mongoose = require('mongoose');
const Race = mongoose.model('race');
const Category = mongoose.model('category');
const Meal = mongoose.model('meal');

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

	app.put(
		'/api/admin/race/:race_id',
		requireAdminAuth,
		async (req, res, next) => {
			try {
				const { race_id } = req.params;
				const {
					name,
					datetime,
					address,
					lat,
					lng,
					description,
					imageUrl,
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
				} = req.body;

				// findByIdAndUpdate doesnt support pre hooks
				// hence use findById and save instead
				// pre 'save' hook is used to update race type
				const race = await Race.findById(race_id);
				race.name = name;
				race.datetime = datetime;
				race.address = address;
				race.lat = lat;
				race.lng = lng;
				race.description = description;
				race.imageUrl = imageUrl;
				race.meals = meals;
				race.open = open;
				race.collectionInfo = collectionInfo;
				race.resultUrl = resultUrl;
				race.stateName = stateName;
				race.earlyBirdDeadline = earlyBirdDeadline;
				race.registrationDeadline = registrationDeadline;
				race.organizer = organizer;
				race.apparel = apparel;
				race.delivery = delivery;

				res.json(await race.save());
			} catch (err) {
				next(err);
			}
		}
	);

	app.delete(
		'/api/admin/race/:race_id',
		requireAdminAuth,
		async (req, res, next) => {
			const { race_id } = req.params;

			try {
				res.json(await Race.findByIdAndRemove(race_id));
			} catch (err) {
				next(err);
			}
		}
	);

	app.post(
		'/api/admin/category/create/:race_id',
		requireAdminAuth,
		async (req, res, next) => {
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
			const { race_id } = req.params;

			try {
				const race = await Race.findById(race_id);

				if (!race) return res.status(422).send({ error: 'Race not found' });

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

	app.delete(
		'/api/admin/category/:category_id',
		requireAdminAuth,
		async (req, res, next) => {
			const { category_id } = req.params;
			try {
				const removedCategory = await Category.findByIdAndRemove(category_id);
				res.json(removedCategory);
			} catch (err) {
				next(err);
			}
		}
	);

	app.post(
		'/api/admin/meal/create',
		requireAdminAuth,
		async (req, res, next) => {
			const { name, price, description, imageUrl } = req.body;
			try {
				const meal = new Meal({ name, price, description, imageUrl });
				res.json(await meal.save());
			} catch (err) {
				next(err);
			}
		}
	);

	app.delete(
		'/api/admin/meal/:meal_id',
		requireAdminAuth,
		async (req, res, next) => {
			const { meal_id } = req.params;
			try {
				res.json(await Meal.findByIdAndRemove(meal_id));
			} catch (err) {
				next(err);
			}
		}
	);
};
