import { UPDATE_PARTICIPANT } from '../actions/types';

export default function(state = {}, action) {
	switch (action.type) {
		case UPDATE_PARTICIPANT:
			return { ...action.payload, apparelSize: 'M', wantsPostalService: false };
		default:
			return state;
	}
}
