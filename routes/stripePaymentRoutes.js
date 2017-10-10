const mongoose = require('mongoose');
const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
const Registration = mongoose.model('registration');
const Payment = mongoose.model('payment');
const Mailer = require('../services/Mailer');
const confirmationTemplate = require('../services/emailTemplates/confirmationTemplate');

module.exports = (app, requireAuth) => {
	app.post(
		'/api/stripe/:registration_id',
		requireAuth,
		async (req, res, next) => {
			const { registration_id } = req.params;
			const { user } = req;
			try {
				const reg = await Registration.findById(registration_id)
					.populate({ path: 'participant', model: 'participant' })
					.populate({ path: 'race', model: 'race' });

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

					// sends confirmation email to user
					const { race } = reg;

					// TODO: content for confirmation email templates
					const mailOptions = {
						title: 'DeoXrace - Confirmation',
						subject: `DeoXrace - Confirmation of registration for ${race.name}`,
						body: 'This is a confirmation that you have registered',
						recipients: [user]
					};

					const mailer = new Mailer(
						mailOptions,
						confirmationTemplate(mailOptions.body)
					);

					await payment.save();
					await mailer.send();
					res.send(payment);
				} else {
					res.status(422).send({ message: 'Payment already made' });
				}
			} catch (err) {
				next(err);
			}
		}
	);
};
