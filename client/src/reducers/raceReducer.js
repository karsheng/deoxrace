import _ from 'lodash';
import {
	FETCH_RACES,
	FETCH_RACE,
	FETCH_FILTERED_RACES
} from '../actions/types';

export default function(state = {}, action) {
	switch (action.type) {
		case FETCH_RACES:
			return _.mapKeys(action.payload, '_id');
		case FETCH_RACE:
			return { ...state, [action.payload._id]: action.payload };
		case FETCH_FILTERED_RACES:
			return { ...state, ...action.payload };
		default:
			return state;
	}
}
