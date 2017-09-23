import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import raceReducer from './raceReducer';
import authReducer from './authReducer';
import snackbarReducer from './snackbarReducer';

const rootReducer = combineReducers({
	form,
	races: raceReducer,
	auth: authReducer,
	snackbar: snackbarReducer
});

export default rootReducer;
