import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import raceReducer from './raceReducer';
import authReducer from './authReducer';
import userReducer from './userReducer';
import snackbarReducer from './snackbarReducer';

const rootReducer = combineReducers({
	form,
	races: raceReducer,
	auth: authReducer,
	snackbar: snackbarReducer,
	user: userReducer
});

export default rootReducer;
