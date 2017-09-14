const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Registration = require('./Registration');

const CategorySchema = new Schema({
	name: String,
	price: {
		earlyBird: { type: Number, default: null },
		normal: Number
	},
	gender: Boolean,
	ageMin: Number,
	ageMax: Number,
	participantLimit: Number,
	race: {
		type: Schema.Types.ObjectId,
		ref: 'race'
	},
	prize: String,
	type: String,
	distance: Number
});

CategorySchema.methods.checkEligibility = function(participant, cb) {
	const category = this;
	const age = _calculateAge(participant.dateOfBirth);
	if (
		age >= category.ageMin &&
		age <= category.ageMax &&
		participant.gender === category.gender
	) {
		return cb(true);
	}

	return cb(false);
};

CategorySchema.methods.checkAvailability = function(cb) {
	const category = this;

	Registration.find({ category, paid: true }, function(err, result) {
		if (err) return cb(err, null);
		return cb(null, result.length < category.participantLimit);
	});
};

function _calculateAge(birthday) {
	const ageDifMs = Date.now() - new Date(birthday);
	const ageDate = new Date(ageDifMs);
	return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const Category = mongoose.model('category', CategorySchema);

module.exports = Category;
