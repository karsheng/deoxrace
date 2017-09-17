const mongoose = require('mongoose');
const Registration = mongoose.model('registration');
const Payment = mongoose.model('payment');

module.exports = (app, requireAuth) => {
	app.post(
		'/api/fakepayment/:registration_id',
		requireAuth,
		async (req, res, next) => {
			const { registration_id } = req.params;
			const { user } = req;
			try {
				const reg = await Registration.findById(registration_id);

				if (reg && !reg.paid) {
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
				next(err);
			}
		}
	);
};
