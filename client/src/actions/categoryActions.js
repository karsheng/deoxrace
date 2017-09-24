import axios from 'axios';
import { FETCH_CATEGORIES_AVAILABILITY } from './types';

export const fetchCategoriesAvailability = race_id => async dispatch => {
	const token = localStorage.getItem('deotoken');
	const config = {
		headers: { authorization: token }
	};
	if (token) {
		const response = await axios.get(
			`/api/race/category/availability/${race_id}`,
			config
		);
		try {
			dispatch({
				type: FETCH_CATEGORIES_AVAILABILITY,
				payload: { [race_id]: response.data }
			});
		} catch (e) {
			console.log(e);
		}
	}
};
