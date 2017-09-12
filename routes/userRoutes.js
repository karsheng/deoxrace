const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = (app, requireAuth) => {
	app.get('/api/user/profile', requireAuth, async (req, res, next) => {
		try {
			const user = await User.findById(req.user._id).select(
				'-password -loginAttempts'
			);

			res.json(user);
		} catch (err) {
			next(err);
		}
	});

	app.put('/api/user/profile', requireAuth, async (req, res, next) => {
		const {
			name,
			fullName,
			phone,
			gender,
			identityNumber,
			nationality,
			countryOfResidence,
			city,
			postcode,
			state,
			emergencyContact,
			medicalCondition,
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
					state,
					emergencyContact,
					medicalCondition,
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
