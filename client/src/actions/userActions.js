import axios from 'axios';
import { FETCH_USER, UPDATE_USER } from './types';

export const fetchUser = () => async dispatch => {
	const token = localStorage.getItem('deotoken');
	const config = {
		headers: { authorization: token }
	};
	if (token) {
		const response = await axios.get('/api/user/profile', config);
		try {
			dispatch({ type: FETCH_USER, payload: response.data });
		} catch (e) {
			console.log(e);
		}
	}
};

export const updateUser = (profile, cb) => async dispatch => {
	const token = localStorage.getItem('deotoken');
	const config = {
		headers: { authorization: token }
	};
	if (token) {
		const response = await axios.put('/api/user/profile', profile, config);
		try {
			dispatch({ type: UPDATE_USER, payload: response.data });
			cb(null);
		} catch (e) {
			console.log(e);
			cb(e);
		}
	}
};
