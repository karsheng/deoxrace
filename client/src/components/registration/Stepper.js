import React, { Component } from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import IconButton from 'material-ui/IconButton';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

const style = {
	parent: {
		display: 'table',
		margin: '8px auto'
	},
	arrow: {
		display: 'table-cell',
		verticalAlign: 'middle'
	},
	floatingActionBtn: {
		verticalAlign: 'middle',
		color: 'white'
	},
	innerDiv: {
		height: '100%'
	}
};

const links = [
	'/registration/participant',
	'/registration/category',
	'/registration/meal',
	'/registration/checkout'
];

class Stepper extends Component {
	renderArrow() {
		return (
			<IconButton style={style.arrow}>
				<ArrowForward />
			</IconButton>
		);
	}
	renderFloatingButton(step) {
		const { stepper, history } = this.props;
		const { race_id } = this.props.match.params;
		return (
			<FloatingActionButton
				zDepth={3}
				mini={true}
				disabled={stepper[step]}
				style={style.floatingActionBtn}
				onClick={() => history.push(`${links[step]}/${race_id}`)}
			>
				<div style={style.innerDiv}>{step + 1}</div>
			</FloatingActionButton>
		);
	}

	render() {
		return (
			<div style={style.parent}>
				{this.renderFloatingButton(0)}
				{this.renderArrow()}
				{this.renderFloatingButton(1)}
				{this.renderArrow()}
				{this.renderFloatingButton(2)}
				{this.renderArrow()}
				{this.renderFloatingButton(3)}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		stepper: state.stepper
	};
};

export default connect(mapStateToProps)(withRouter(Stepper));
