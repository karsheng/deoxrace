const mongoose = require('mongoose');
const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const Registration = mongoose.model('registration');
const Payment = mongoose.model('payment');

module.exports = (app, requireAuth) => {
	app.post(
		'/api/stripe/:registration_id',
		requireAuth,
		async (req, res, next) => {
			const { registration_id } = req.params;
			const { user } = req;
			try {
				const reg = await Registration.findById(registration_id);

				if (reg && !reg.paid) {
					const charge = await stripe.charges.create({
						amount: reg.totalBill,
						currency: 'myr',
						description: 'registration and orders',
						source: req.body.id
					});

					const payment = new Payment({
						user: user._id,
						registration: reg._id,
						amount: reg.totalBill,
						currency: 'MYR'
					});

					await payment.save();
					res.send(payment);
				} else {
					res.status(422).send({ message: 'Payment already made' });
				}
			} catch (err) {
				console.log(err);
				next(err);
			}
		}
	);
};
