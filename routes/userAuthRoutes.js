const mongoose = require('mongoose');
const jwt = require('jwt-simple');
const config = require('../config/keys');
const User = mongoose.model('user');

const tokenForUser = user => {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
};

module.exports = (app, requireSignin) => {
	app.post('/api/signin', requireSignin, (req, res) => {
		res.send({ token: tokenForUser(req.user) });
	});

	app.post('/api/signup', async (req, res, next) => {
		const { email, password } = req.body;
		if (!email || !password) {
			return res
				.status(422)
				.send({ error: 'You must provide email and password' });
		}

		// TODO: email and password validation

		// see if a user with a given email exists
		try {
			const existingUser = await User.findOne({ email: email });
			// if a user with email does exist, return an error
			if (existingUser) {
				return res.status(422).send({ error: 'Email is in use' }); //unprocessable entity
			}

			// if a user with email does not exit, create and save user record
			const user = new User({
				email,
				password
			});

			await user.save();
			// respond to request indicating the user was created
			res.json({ token: tokenForUser(user) });
		} catch (err) {
			next(err);
		}
	});
};
