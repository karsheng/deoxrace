const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Registration = mongoose.model('registration');
const User = mongoose.model('user');

const PaymentSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'user'
		},
		registration: {
			type: Schema.Types.ObjectId,
			ref: 'registration'
		},
		amount: Number,
		currency: String
	},
	{ timestamps: { createdAt: 'timePaid' } }
);

PaymentSchema.pre('save', async function(next) {
	const payment = this;
	try {
		const registration = await Registration.findByIdAndUpdate(
			payment.registration,
			{ paid: true }
		);
		const user = await User.findById(payment.user);
		user.registrations.push(payment.registration);
		await user.save();
		next();
	} catch (err) {
		next(err);
	}
});

const Payment = mongoose.model('payment', PaymentSchema);

module.exports = Payment;
