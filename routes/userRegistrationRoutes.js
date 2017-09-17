const Category = require('../models/Category');
const Registration = require('../models/Registration');
const Participant = require('../models/Participant');

module.exports = (app, requireAuth) => {
	app.post(
		'/api/registration/:race_id/:category_id',
		requireAuth,
		async (req, res, next) => {
			const { race_id, category_id } = req.params;
			const { orders, participant, registerForSelf } = req.body;
			const { user } = req;
			try {
				checkRegistrationEligibity(
					participant,
					category_id,
					next,
					async (errMessage, isEligible) => {
						if (!isEligible) res.status(422).send(errMessage);

						// check if user already has an unpaid registration
						const unpaidReg = await Registration.findOne({ user, paid: false });
						if (unpaidReg) {
							// if there is an unpaid registration, update the registration
							// info of the registration document and update participant info
							unpaidReg.category = category_id;
							unpaidReg.orders = orders;
							unpaidReg.race = race_id;
							unpaidReg.registerForSelf = registerForSelf;

							const updatedParticipant = await Participant.findByIdAndUpdate(
								unpaidReg.participant,
								participant
							);
							res.json(await unpaidReg.save());
						} else {
							// if no unpaid registration, create a new registration document
							// and update participant info
							const p = new Participant(participant);
							const registration = new Registration({
								user: user._id,
								race: race_id,
								category: category_id,
								orders,
								participant: p._id,
								registerForSelf
							});

							const results = await Promise.all([
								p.save(),
								registration.save()
							]);
							res.json(results[1]);
						}
					}
				);
			} catch (err) {
				next(err);
			}
		}
	);
};

async function checkRegistrationEligibity(participant, category_id, next, cb) {
	try {
		const category = await Category.findById(category_id).populate({
			path: 'race',
			model: 'race'
		});
		const isOpen = await Registration.checkStatus(category);
		if (isOpen) {
			const isEligible = category.checkEligibility(participant);
			if (isEligible) return cb(null, true);
			return cb(
				{ message: 'Not allowed to register for this category' },
				false
			);
		}
		return cb({ message: 'Registration for this category is closed' }, false);
	} catch (err) {
		next(err);
	}
}
