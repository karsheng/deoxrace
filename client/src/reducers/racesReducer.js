import _ from 'lodash';
import { FETCH_RACES } from '../actions/types';

export default function(state = {}, action) {
	switch (action.type) {
		case FETCH_RACES:
			return _.mapKeys(action.payload, '_id');
		default:
			return state;
	}
}
