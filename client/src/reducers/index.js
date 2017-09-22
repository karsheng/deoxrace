import { combineReducers } from 'redux';
import racesReducer from './racesReducer';

const rootReducer = combineReducers({
	races: racesReducer
});

export default rootReducer;
