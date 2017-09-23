import { combineReducers } from 'redux';
import raceReducer from './raceReducer';

const rootReducer = combineReducers({
	races: raceReducer
});

export default rootReducer;
