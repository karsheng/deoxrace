import axios from 'axios';

export const handleStripeToken = (
	stripeToken,
	registrationId,
	cb
) => async dispatch => {
	try {
		const token = localStorage.getItem('deotoken');

		let config = {
			headers: { authorization: token }
		};

		const res = await axios.post(
			`/api/stripe/${registrationId}`,
			stripeToken,
			config
		);
		cb();
	} catch (e) {
		console.log(e);
	}
};
