import React, { Component } from 'react';
import { fetchRegistration } from '../../actions/registrationActions';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Progress from '../Progress';
import StripePayments from '../payments/StripePayments';

const style = {
	paper: {
		height: '100%',
		width: '100%',
		maxWidth: '768px',
		margin: 'auto',
		padding: '20px',
		marginTop: '30px'
	}
};

class Payment extends Component {
	componentWillMount() {
		const { registration_id } = this.props.match.params;
		this.props.fetchRegistration(registration_id, (err, reg) => {
			if (err) alert('Something went wrong, please try again later');
		});
	}

	render() {
		const { race, totalBill } = this.props.info;

		if (!race) return <Progress />;

		return (
			<Paper zDepth={3} style={style.paper}>
				<h2>Payment</h2>
				<h3>{race.name}</h3>
				<h4>Total: RM {(totalBill / 100).toFixed(2)}</h4>
				<br />
				<br />
				<br />
				<br />
				<h6 style={{ textAlign: 'center' }}>
					This is to simulate payment by user. Payment system will be integrated
					as part of Milestone 2
				</h6>
				<StripePayments
					registrationId={this.props.info._id}
					totalBill={totalBill}
					history={this.props.history}
				/>
			</Paper>
		);
	}
}

const mapStateToProps = state => {
	return {
		info: state.registration.info
	};
};

export default connect(mapStateToProps, { fetchRegistration })(Payment);
