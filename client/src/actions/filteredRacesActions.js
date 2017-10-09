import axios from 'axios';
import { FETCH_FILTERED_RACES, SET_FILTERED_RACES } from './types';
import _ from 'lodash';

export const fetchFilteredRaces = (type, cb) => async dispatch => {
	try {
		const res = await axios.get(`/api/race/open?types=${type}`);
		const specificRaces = _.mapKeys(res.data, '_id');
		dispatch({ type: FETCH_FILTERED_RACES, payload: specificRaces });
		dispatch({ type: SET_FILTERED_RACES, payload: specificRaces });

		cb(null);
	} catch (e) {
		cb(e);
		console.log(e);
	}
};
