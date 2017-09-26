import _ from 'lodash';
import {
	DISPATCH_RACES_CATEGORIES,
	DISPATCH_RACE_CATEGORIES,
	FETCH_CATEGORIES_AVAILABILITY
} from '../actions/types';

export default function(state = {}, action) {
	switch (action.type) {
		case DISPATCH_RACES_CATEGORIES:
			const races = action.payload;
			races.map(race => {
				const categories = _.mapKeys(race.categories, '_id');
				state = { ...state, [race._id]: categories };
				return null;
			});
			return state;

		case DISPATCH_RACE_CATEGORIES:
			const race = action.payload;
			const categories = _.mapKeys(race.categories, '_id');
			return { ...state, [race._id]: categories };

		case FETCH_CATEGORIES_AVAILABILITY:
			const race_id = _.keys(action.payload)[0];
			_.map(action.payload[race_id], availability => {
				const cat_id = _.keys(availability)[0];
				state[race_id][cat_id].available = availability[cat_id];
			});
			return state;

		default:
			return state;
	}
}
