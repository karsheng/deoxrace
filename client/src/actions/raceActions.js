import axios from 'axios';
import { FETCH_RACES, FETCH_RACE } from './types';

export const fetchRaces = () => async dispatch => {
	try {
		const res = await axios.get('/api/race/open/all');
		dispatch({ type: FETCH_RACES, payload: res.data });
	} catch (e) {
		console.log(e);
	}
};

export const fetchRace = race_id => async dispatch => {
	try {
		const res = await axios.get(`/api/race/${race_id}`);
		dispatch({ type: FETCH_RACE, payload: res.data });
	} catch (e) {
		console.log(e);
	}
};
