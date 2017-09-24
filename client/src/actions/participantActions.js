import { UPDATE_PARTICIPANT } from './types';

export const updateParticipant = participant => dispatch => {
	dispatch({ type: UPDATE_PARTICIPANT, payload: participant });
};
