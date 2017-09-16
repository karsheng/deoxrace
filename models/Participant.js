const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParticipantSchema = new Schema({
	fullName: String,
	identityNumber: String,
	nationality: String,
	countryOfResidence: String,
	gender: String,
	dateOfBirth: Date,
	email: { type: String, lowercase: true },
	phone: String,
	postcode: String,
	city: String,
	stateName: String,
	emergencyContact: {
		name: String,
		relationship: String,
		phone: String
	},
	hasMedicalCondition: Boolean,
	medicalConditionDescription: String,
	apparelSize: String,
	waiverDeclaration: Boolean,
	registration: {
		type: Schema.Types.ObjectId,
		ref: 'registration'
	},
	postalAddress: {
		line1: String,
		line2: String,
		line3: String,
		city: String,
		stateName: String,
		postcode: String,
		country: String
	},
	wantsPostalService: Boolean
});

const Participant = mongoose.model('participant', ParticipantSchema);

module.exports = Participant;
