import React, { Component } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { connect } from 'react-redux';
import { handleStripeToken } from '../../actions/paymentActions';
import RaisedButton from 'material-ui/RaisedButton';

class StripePayments extends Component {
	handlePayment(token) {
		const { registrationId } = this.props;
		this.props.handleStripeToken(token, registrationId, () => {
			this.props.history.push(`/registration/confirmation/${registrationId}`);
		});
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

export default connect(null, { handleStripeToken })(StripePayments);
