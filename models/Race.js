const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CollectionSchema = require('./CollectionSchema');
const OrganizerSchema = require('./OrganizerSchema');
const ApparelSchema = require('./ApparelSchema');
const DeliverySchema = require('./DeliverySchema');

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
	open: Boolean,
	collectionInfo: [CollectionSchema],
	resultUrl: String,
	types: [String],
	stateName: String,
	earlyBirdDeadline: Date,
	registrationDeadline: Date,
	organizer: [OrganizerSchema],
	apparel: ApparelSchema,
	delivery: DeliverySchema
});

RaceSchema.pre('save', async function(next) {
	const race = this;
	const Category = mongoose.model('category');
	race.categories = await Category.find({ race: race._id });

	_getRaceTypes(race, function(err, types) {
		if (err) {
			return next(err);
		}
		race.types = types;
		next();
	});
});

async function _getRaceTypes(race, cb) {
	let types = [];
	const Category = mongoose.model('category');
	try {
		const result = await Category.populate(race, { path: 'categories' });

		result.categories.map(cat => {
			if (types.indexOf(cat.type) === -1) {
				types.push(cat.type);
			}
		});
		return cb(null, types);
	} catch (err) {
		next(err);
	}
}

const Race = mongoose.model('race', RaceSchema);

module.exports = Race;
