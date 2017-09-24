import { UPDATE_STEPPER } from './types';

export const updateStepper = step => dispatch => {
	dispatch({ type: UPDATE_STEPPER, payload: step });
};
