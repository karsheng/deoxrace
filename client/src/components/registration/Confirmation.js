import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchRegistration } from '../../actions/registrationActions';
import { openSnackbar } from '../../actions/snackbarActions';
import Paper from 'material-ui/Paper';

const style = {
	paper: {
		height: '100%',
		width: '100%',
		maxWidth: '768px',
		margin: 'auto',
		padding: '20px',
		marginTop: '30px'
	},
	h4: {
		textAlign: 'center'
	}
};

class Confirmation extends Component {
	componentDidMount() {
		const { registration_id } = this.props.match.params;
		this.props.fetchRegistration(registration_id, (err, registration) => {
			// TODO: if no registration found, show default error page
			// if registration is not paid, redirect to payment
			if (err) alert('Something went wrong, please try again later');
			if (!registration.paid) {
				this.props.history.push(`/registration/payment/${registration_id}`);
				return;
			}
			this.props.openSnackbar('Event registered successfully!');
		});
	}

	render() {
		const { race, totalBill, participant } = this.props.info;
		return (
			<Paper zDepth={3} style={style.paper}>
				<h2>Confirmation</h2>
				<h3>{race.name}</h3>
				<p>Total: RM {(totalBill / 100).toFixed(2)}</p>
				<br />
				<br />
				<h4 style={style.h4}>
					Thank you for registering with us! A confirmation email will be sent
					to {participant.email}.
				</h4>
			</Paper>
		);
	}
}

const mapStateToProps = state => {
	return {
		info: state.registration.info
	};
};

export default connect(mapStateToProps, {
	fetchRegistration,
	openSnackbar
})(Confirmation);
