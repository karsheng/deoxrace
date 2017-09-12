const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderSchema = require('./OrderSchema');
const Race = mongoose.model('race');
const Category = mongoose.model('category');
const Meal = mongoose.model('meal');
const Participant = mongoose.model('participant');

const RegistrationSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'user'
		},
		race: {
			type: Schema.Types.ObjectId,
			ref: 'race'
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: 'category'
		},
		orders: [OrderSchema],
		totalBill: Number,
		paid: {
			type: Boolean,
			default: false
		},
		registerForSelf: {
			type: Boolean,
			default: false
		},
		participant: {
			type: Schema.Types.ObjectId,
			ref: 'participant'
		}
	},
	{ timestamps: { createdAt: 'timeRegistered' } }
);

RegistrationSchema.statics.checkStatus = async function(category, cb) {
	try {
		const regs = await this.find({ category, paid: true });
		if (
			regs.length < category.participantLimit &&
			category.race.open &&
			category.race.registrationDeadline > Date.now()
		) {
			return cb(null, true);
		} else {
			return cb(null, false);
		}
	} catch (err) {
		cb(err);
	}
};

RegistrationSchema.pre('save', async function(next) {
	var reg_bill = 0,
		orders_bill = 0,
		postal_bill = 0;

	try {
		let reg = await Category.populate(this, { path: 'category' });
		reg = await Race.populate(reg, { path: 'race' });
		reg = await Participant.populate(reg, { path: 'participant' });

		const { race, participant, orders, category } = reg;

		// this part calculates fee for category registration
		// and determine if early bird price is valid
		if (race.earlyBirdDeadline && race.earlyBirdEndDate > Date.now()) {
			reg_bill += category.price.earlyBird;
		} else {
			reg_bill += category.price.normal;
		}

		// this part calculates fee for postal
		if (participant.wantsPostalService) {
			const { postalCharges } = race.delivery;

			postal_bill = _determinePostalCharges(
				participant.postalAddress,
				postalCharges
			);
		}

		// if there are orders
		// this part calculates any fee for meal orders
		if (orders.length > 0) {
			reg = await Meal.populate(reg, { path: 'orders.meal' });
			orders.map(order => {
				orders_bill += order.meal.price * order.quantity;
			});
			registration.totalBill = reg_bill + orders_bill + postal_bill;
			next();
		} else {
			// if no orders, add only registration bill and postal bill
			registration.totalBill = reg_bill + postal_bill;
			next();
		}
	} catch (err) {
		next(err);
	}
});

const Registration = mongoose.model('registration', RegistrationSchema);

module.exports = Registration;

function _determinePostalCharges(postalAddress, racePostalCharges) {
	if (postalAddress.country.toLowerCase() === 'malaysia') {
		if (
			postalAddress.stateName.toLowerCase() === 'sabah' ||
			postalAddress.stateName.toLowerCase() === 'sarawak' ||
			postalAddress.stateName.toLowerCase() === 'labuan'
		) {
			return racePostalCharges.eastMalaysia;
		} else {
			return racePostalCharges.westMalaysia;
		}
	} else {
		return racePostalCharges.international;
	}
}
