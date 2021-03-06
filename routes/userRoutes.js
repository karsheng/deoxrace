const mongoose = require('mongoose');
const User = mongoose.model('user');

module.exports = (app, requireAuth) => {
	app.get('/api/user/profile', requireAuth, async (req, res, next) => {
		try {
			const user = await User.findById(req.user._id)
				.populate({
					path: 'registrations',
					populate: {
						path: 'race',
						model: 'race'
					}
				})
				.populate({
					path: 'registrations',
					populate: {
						path: 'participant',
						model: 'participant'
					}
				})
				.select('-password -loginAttempts');

			res.json(user);
		} catch (err) {
			next(err);
		}
	});

	app.put('/api/user/profile', requireAuth, async (req, res, next) => {
		const {
			fullName,
			phone,
			gender,
			identityNumber,
			nationality,
			countryOfResidence,
			city,
			postcode,
			stateName,
			emergencyContact,
			hasMedicalCondition,
			medicalConditionDescription,
			interests,
			dateOfBirth,
			postalAddress
		} = req.body;

		try {
			const user = await User.findByIdAndUpdate(
				req.user._id,
				{
					fullName,
					phone,
					gender,
					identityNumber,
					nationality,
					countryOfResidence,
					city,
					postcode,
					stateName,
					emergencyContact,
					hasMedicalCondition,
					medicalConditionDescription,
					interests,
					dateOfBirth,
					postalAddress
				},
				{ new: true }
			).select('-password -loginAttempts');
			res.json(user);
		} catch (err) {
			next(err);
		}
	});
};
