import { OPEN_SNACKBAR, CLOSE_SNACKBAR } from './types';

export const openSnackbar = message => async dispatch => {
	dispatch({ type: OPEN_SNACKBAR, payload: message });
};

export const closeSnackbar = () => async dispatch => {
	dispatch({ type: CLOSE_SNACKBAR });
};
