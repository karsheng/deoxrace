import { UPDATE_STEPPER } from '../actions/types';

export default function(state = [], action) {
	switch (action.type) {
		case UPDATE_STEPPER:
			return changeStepperState(action.payload);
		default:
			return state;
	}
}

const changeStepperState = step => {
	let stepperState = [];

	for (let i = 0; i < 4; i++) {
		if (i <= step) {
			stepperState.push(false);
		} else {
			stepperState.push(true);
		}
	}

	return stepperState;
};
