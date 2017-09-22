import axios from 'axios';
import { FETCH_RACES } from './types';

export const fetchRaces = () => async dispatch => {
	const res = await axios.get('/api/race/open/all');

	dispatch({ type: FETCH_RACES, payload: res.data });
};
