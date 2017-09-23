import axios from 'axios';
import {
	AUTH_USER,
	UNAUTH_USER,
	AUTH_SIGNIN_ERROR,
	AUTH_SIGNUP_ERROR,
	OPEN_AUTH_DIALOG,
	CLOSE_AUTH_DIALOG,
	FETCH_USER_INFO,
	UPDATE_USER_INFO
} from './types';

export const signinUser = ({ email, password }, cb) => async dispatch => {
	try {
		const res = await axios.post('/api/signin', { email, password });
		localStorage.setItem('deotoken', res.data.token);
		const config = { headers: { authorization: res.data.token } };

		const res2 = await axios.get('/api/user/profile', config);
		dispatch({ type: AUTH_USER });
		dispatch({ type: FETCH_USER_INFO, payload: res2.data });
		cb(null);
	} catch (e) {
		console.log(e);
		dispatch(authSigninError('Bad Sign In Info'));
		cb(e);
	}
};

export const authSigninError = error => {
	return {
		type: AUTH_SIGNIN_ERROR,
		payload: error
	};
};

export const signupUser = (formProps, cb) => async dispatch => {
	try {
		const res = await axios.post('/api/signup', formProps);
		localStorage.setItem('deotoken', res.data.token);
		const config = { headers: { authorization: res.data.token } };

		const res2 = await axios.get('/api/user/profile', config);
		dispatch({ type: AUTH_USER });
		dispatch({ type: FETCH_USER_INFO, payload: res2.data });
		cb(null);
	} catch (e) {
		console.log(e);
		dispatch(authSignupError(e.response.data.error));
		cb(e);
	}
};

export const authSignupError = error => {
	return {
		type: AUTH_SIGNUP_ERROR,
		payload: error
	};
};

export const signoutUser = () => async dispatch => {
	localStorage.removeItem('deotoken');
	dispatch({ type: UNAUTH_USER });
	dispatch({ type: UPDATE_USER_INFO, payload: {} });
};

export const openAuthDialog = () => async dispatch => {
	dispatch({ type: OPEN_AUTH_DIALOG });
};

export const closeAuthDialog = () => async dispatch => {
	dispatch({ type: CLOSE_AUTH_DIALOG });
};
