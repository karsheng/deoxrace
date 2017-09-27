import React, { Component } from 'react';
import { connect } from 'react-redux';
import Progress from '../Progress';
import RaisedButton from 'material-ui/RaisedButton';
import MealCard from './MealCard';
import _ from 'lodash';
import { resetMealSelection } from '../../actions/registrationActions';
import Stepper from './Stepper';
import { updateStepper } from '../../actions/stepperActions';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

const style = {
	paper: {
		height: '100%',
		width: '100%',
		maxWidth: '768px',
		margin: 'auto',
		padding: '20px'
	},
	nextBtn: {
		float: 'right'
	}
};

class MealSelection extends Component {
	componentWillMount() {
		const { selectedCategory, selectedMeals } = this.props;
		const { race_id } = this.props.match.params;

		if (!selectedCategory) return this.props.history.push(`/race/${race_id}`);
		if (selectedCategory.race !== race_id)
			return this.props.history.push(`/race/${race_id}`);
		// if selectedMeals' race is not equal to race_id
		// set selectedMeals to {} with resetMealSelection action
		if (!_.findKey(selectedMeals, { race: race_id }))
			this.props.resetMealSelection();
		this.props.updateStepper(2);
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	renderMealForm(race) {
		return race.meals.map(meal => {
			return <MealCard key={meal._id} meal={meal} race={race} />;
		});
	}

	render() {
		const { race } = this.props;
		if (!race) return <Progress />;

		return (
			<div>
				<Stepper />
				<Paper zDepth={3} style={style.paper}>
					<h2>{race.name}</h2>
					<h3>Step 3: Order Meal</h3>
					<div className="row">{this.renderMealForm(race)}</div>
					<div>
						<br />
						<br />
						<br />
						<br />
						<Divider />
						<br />
						<RaisedButton
							label="Back"
							secondary={true}
							onClick={() =>
								this.props.history.push(`/registration/category/${race._id}`)}
						/>
						<RaisedButton
							label="Next"
							primary={true}
							style={style.nextBtn}
							onClick={() =>
								this.props.history.push(`/registration/checkout/${race._id}`)}
						/>
					</div>
				</Paper>
			</div>
		);
	}
}

const mapStateToProps = (state, ownProps) => {
	return {
		race: state.races[ownProps.match.params.race_id],
		selectedCategory: state.registration.selectedCategory,
		selectedMeals: state.registration.selectedMeals
	};
};

export default connect(mapStateToProps, { resetMealSelection, updateStepper })(
	MealSelection
);
