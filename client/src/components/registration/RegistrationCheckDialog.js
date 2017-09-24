import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { updateParticipant } from '../../actions/participantActions';

const style = {
	contentStyle: {
		maxWidth: '300px'
	},
	selfBtn: {
		margin: '16px auto'
	},
	h5: {
		textAlign: 'center'
	}
};

class RegistrationCheckDialog extends Component {
	handleSelfRegistration() {
		let participant = {
			...this.props.user,
			registerForSelf: true
		};
		this.props.updateParticipant(participant);
		this.props.closeRegCheckDialog();
		this.props.history.push(
			'/registration/participant/' + this.props.match.params.race_id
		);
	}

	handleOthersRegistration() {
		const participant = {
			registerForSelf: false
		};

		this.props.updateParticipant(participant);
		this.props.closeRegCheckDialog();
		this.props.history.push(
			'/registration/participant/' + this.props.match.params.race_id
		);
	}

	render() {
		return (
			<Dialog
				title="Are you registering for yourself or others?"
				modal={false}
				contentStyle={style.contentStyle}
				open={this.props.regCheckDialogOpen}
				onRequestClose={this.props.closeRegCheckDialog}
				autoScrollBodyContent={true}
			>
				<br />
				<RaisedButton
					primary={true}
					label="Self"
					fullWidth={true}
					style={style.selfBtn}
					onClick={this.handleSelfRegistration.bind(this)}
				/>
				<RaisedButton
					secondary={true}
					label="Others"
					fullWidth={true}
					onClick={this.handleOthersRegistration.bind(this)}
				/>
				<Link to="/profile">
					<h5 style={style.h5}>
						Or update profile for faster registration in future!
					</h5>
				</Link>
			</Dialog>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: state.user
	};
};

export default connect(mapStateToProps, { updateParticipant })(
	withRouter(RegistrationCheckDialog)
);
