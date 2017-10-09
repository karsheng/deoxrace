import _ from 'lodash';
import { SET_FILTERED_RACES } from '../actions/types';

export default function(state = [], action) {
	switch (action.type) {
		case SET_FILTERED_RACES:
			return _.map(action.payload, '_id');
		default:
			return state;
	}
}
