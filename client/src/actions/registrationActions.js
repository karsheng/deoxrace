import axios from 'axios';
import {
	SELECT_CATEGORY,
	SELECT_MEAL,
	DESELECT_MEAL,
	RESET_MEAL_SELECTION,
	SET_TOTAL_PRICE,
	FETCH_REGISTRATION
} from './types';

export const selectCategory = (category, cb) => dispatch => {
	dispatch({ type: SELECT_CATEGORY, payload: category });
	if (cb) cb();
};

export const selectMeal = ({ meal, quantity, race }) => dispatch => {
	// race is included to verify if
	// selectedMeal is for which race
	dispatch({ type: SELECT_MEAL, payload: { meal, quantity, race } });
};

export const deselectMeal = meal_id => dispatch => {
	dispatch({ type: DESELECT_MEAL, payload: meal_id });
};

export const resetMealSelection = () => dispatch => {
	dispatch({ type: RESET_MEAL_SELECTION });
};

export const setTotalPrice = totalPrice => dispatch => {
	dispatch({ type: SET_TOTAL_PRICE, payload: totalPrice });
};

export const createRegistration = (
	{ race, category, orders, participant, registerForSelf },
	cb
) => async dispatch => {
	const token = localStorage.getItem('deotoken');

	let config = {
		headers: { authorization: token }
	};
	delete participant._id;
	try {
		const response = await axios.post(
			`/api/registration/${race._id}/${category._id}`,
			{ orders, participant, registerForSelf },
			config
		);

		cb(null, response.data);
	} catch (e) {
		console.log(e);
		cb(e, null);
	}
};

export const fetchRegistration = (registration_id, cb) => async dispatch => {
	const token = localStorage.getItem('deotoken');
	let config = {
		headers: { authorization: token }
	};

	try {
		const response = await axios.get(
			`/api/registration/${registration_id}`,
			config
		);
		dispatch({ type: FETCH_REGISTRATION, payload: response.data });
		cb(null, response.data);
	} catch (e) {
		console.log(e);
		cb(e);
	}
};
