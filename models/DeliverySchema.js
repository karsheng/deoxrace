const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DeliverySchema = new Schema({
	postalCharges: {
		eastMalaysia: Number,
		westMalaysia: Number,
		international: Number,
		others: Number
	}
});

module.exports = DeliverySchema;
