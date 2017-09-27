// TODO: to be deleted after integration of payment system
import React, { Component } from 'react';
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';

class FakePaymentButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			submitting: false
		};
	}
	async handleFakePayment() {
		this.setState({ submitting: true });

		const { regId } = this.props;
		const token = localStorage.getItem('deotoken');
		let config = {
			headers: { authorization: token }
		};

		try {
			await axios.post(`/api/fakepayment/${regId}`, null, config);
			this.props.history.push(`/registration/confirmation/${regId}`);
		} catch (e) {
			console.log(e);
			this.setState({ submitting: false });
		}
	}

	render() {
		return (
			<div style={{ width: '100%', textAlign: 'center' }}>
				<RaisedButton
					style={{ float: 'center' }}
					label="Pay now"
					secondary={true}
					disabled={this.state.submitting}
					onClick={this.handleFakePayment.bind(this)}
				/>
			</div>
		);
	}
}

export default FakePaymentButton;
