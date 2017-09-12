const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssociateSchema = new Schema({
	name: String,
	logo: String,
	imageUrl: String,
	address1: String,
	address2: String,
	address3: String,
	city: String,
	postcode: String,
	country: String,
	description: String
});

const Associate = mongoose.model('associate', AssociateSchema);

module.exports = Associate;
