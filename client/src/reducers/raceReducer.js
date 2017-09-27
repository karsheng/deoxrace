import _ from 'lodash';
import {
	FETCH_RACES,
	FETCH_RACE,
	FETCH_SPECIFIC_RACES
} from '../actions/types';

export default function(state = {}, action) {
	switch (action.type) {
		case FETCH_RACES:
			return _.mapKeys(action.payload, '_id');
		case FETCH_RACE:
			return { ...state, [action.payload._id]: action.payload };
		case FETCH_SPECIFIC_RACES:
			const specificRaces = _.mapKeys(action.payload, '_id');
			return {
				...state,
				...specificRaces,
				filteredRaces: _.map(specificRaces, '_id')
			};
		default:
			return state;
	}
}
