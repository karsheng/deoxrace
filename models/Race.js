const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CollectionSchema = require('./collection_schema');
const OrganizerSchema = require('./organizer_schema');
const ApparelSchema = require('./apparel_schema');
const DeliverySchema = require('./delivery_schema');

const RaceSchema = new Schema({
	name: String,
	datetime: Date,
	address: String,
	lat: Number,
	lng: Number,
	description: String,
	imageUrl: String,
	categories: [
		{
			type: Schema.Types.ObjectId,
			ref: 'category'
		}
	],
	meals: [
		{
			type: Schema.Types.ObjectId,
			ref: 'meal'
		}
	],
	open: Boolean
	collectionInfo: [CollectionSchema],
	resultUrl: String,
	types: [String],
	stateName: String,
	earlyBirdDealine: Date,
	registrationDeadline: Date,
	organizer: [OrganizerSchema],
	apparel: ApparelSchema,
	delivery: DeliverySchema
});

RaceSchema.pre('save', function(next) {
	const race = this;
	
	_getRaceTypes(race, function(err, types) {
		if (err) {
			return next(err);
		}
		race.types = types;
		next();
	});
});

async function _getRaceTypes(race, cb) {
	const Category = mongoose.model('category');
	let types = [];

	try {
		const result = await Category.populate(race, { path: 'categories' });
		
		result.categories.map(cat => {
			if (types.indexOf(cat.type) === -1) {
				types.push(cat.type);
			}

		return cb(null, types);

		});

	} catch(err) {
		next(err);
	}

}

const Race = mongoose.model('race', RaceSchema);

module.exports = Race;