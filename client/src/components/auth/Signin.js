import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import * as authActions from '../../actions/authActions';
import { openSnackbar } from '../../actions/snackbarActions';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import renderField from '../../utils/renderField';
import Paper from 'material-ui/Paper';
import { Link } from 'react-router-dom';

const style = {
	paper: {
		height: '100%',
		width: '100%',
		maxWidth: '500px',
		margin: '30px auto',
		padding: '20px'
	},
	alert: {
		color: 'red'
	}
};

class Signin extends Component {
	handleFormSubmit({ email, password }) {
		return new Promise((resolve, reject) => {
			return this.props.signinUser({ email, password }, err => {
				if (err) return reject(err);
				this.props.openSnackbar(`Signed in as ${email}`);
				this.props.history.push('/');
				resolve();
			});
		});
	}

	renderAlert() {
		if (this.props.errorMessage) {
			return (
				<div style={style.alert}>
					<strong>Opps!</strong> {this.props.errorMessage}
				</div>
			);
		}
	}

	render() {
		const { handleSubmit, pristine, submitting } = this.props;
		return (
			<Paper zDepth={3} style={style.paper}>
				<form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
					<h2>Sign In</h2>
					<Field
						label="Email"
						name="email"
						type="text"
						component={renderField}
					/>
					<br />
					<Field
						label="Password"
						name="password"
						type="password"
						component={renderField}
					/>
					<br />
					{this.renderAlert()}
					<br />
					<br />
					<RaisedButton
						primary={true}
						type="submit"
						label="Login"
						className="button-submit"
						disabled={pristine || submitting}
					/>
					<br />
					<br />
					<h5>
						Not a member? <Link to="/signup">Sign up here!</Link>
					</h5>
					<br />
					<br />
				</form>
			</Paper>
		);
	}
}

function mapStateToProps(state) {
	return { errorMessage: state.auth.signinError };
}

export default reduxForm({
	form: 'signin'
})(connect(mapStateToProps, { ...authActions, openSnackbar })(Signin));
