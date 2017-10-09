import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import RaisedButton from 'material-ui/RaisedButton';
import axios from 'axios';

class StripePayments extends Component {
	async handlePayment(stripeToken) {
		try {
			const { registrationId } = this.props;
			const token = localStorage.getItem('deotoken');

			let config = { headers: { authorization: token } };

			await axios.post(`/api/stripe/${registrationId}`, stripeToken, config);

			this.props.history.push(`/registration/confirmation/${registrationId}`);
		} catch (e) {
			alert('Something went wrong. Please try again later.');
			console.log(e);
		}
	}
	render() {
		const { totalBill } = this.props;
		return (
			<StripeCheckout
				name="DeoXRace"
				description="Registration and order payments"
				amount={totalBill}
				token={this.handlePayment.bind(this)}
				stripeKey={process.env.REACT_APP_STRIPE_KEY}
			>
				<RaisedButton secondary={true} label="Pay using Stripe" />
			</StripeCheckout>
		);
	}
}

export default StripePayments;
