import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import raceReducer from './raceReducer';
import authReducer from './authReducer';
import userReducer from './userReducer';
import snackbarReducer from './snackbarReducer';
import stepperReducer from './stepperReducer';
import participantReducer from './participantReducer';
import registrationReducer from './registrationReducer';
import categoryReducer from './categoryReducer';

const rootReducer = combineReducers({
	form,
	races: raceReducer,
	auth: authReducer,
	snackbar: snackbarReducer,
	user: userReducer,
	stepper: stepperReducer,
	participant: participantReducer,
	registration: registrationReducer,
	categories: categoryReducer
});

export default rootReducer;
