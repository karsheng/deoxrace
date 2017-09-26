import React, { Component } from 'react';
import { connect } from 'react-redux';
import CategoryCard from './CategoryCard';
import Progress from '../Progress';
import _ from 'lodash';
import { selectCategory } from '../../actions/registrationActions';
import RaisedButton from 'material-ui/RaisedButton';
import calculateAge from '../../utils/calculateAge';
import Stepper from './Stepper';
import { updateStepper } from '../../actions/stepperActions';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import { fetchCategoriesAvailability } from '../../actions/categoryActions';

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

class CategorySelection extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selection: {},
			earlyBirdValid: false
		};
	}

	componentWillMount() {
		this.props.updateStepper(1);
		const { race_id } = this.props.match.params;
		if (!this.props.race) this.props.history.push(`/race/${race_id}`);
		this.props.fetchCategoriesAvailability(race_id);
	}

	componentDidMount() {
		window.scrollTo(0, 0);
		const { race_id } = this.props.match.params;
		const { race } = this.props;
		const { selectedCategory } = this.props;

		if (race) {
			const { categories } = race;
			const selection = _.reduce(
				categories,
				function(result, val, key) {
					result[val._id] = false;
					return result;
				},
				{}
			);
			// check if any category was previously selected
			// if yes, pre select the category
			if (selectedCategory && selectedCategory.race === race_id)
				selection[selectedCategory._id] = true;
			this.setState({ selection });

			const { hasEarlyBirdRate, earlyBirdDeadline } = this.props.race;

			if (
				hasEarlyBirdRate === true &&
				new Date(earlyBirdDeadline) > Date.now()
			) {
				this.setState({ earlyBirdValid: true });
			}
		}
	}
	renderCategoryCard(categories, participant) {
		const participantAge = calculateAge(participant.dateOfBirth);

		return _.map(categories, category => {
			return (
				<div key={category._id}>
					<CategoryCard
						category={category}
						key={category._id}
						selected={this.state.selection[category._id]}
						setSelectedCategory={this.setSelectedCategory.bind(this)}
						earlyBirdValid={this.state.earlyBirdValid}
						participantAge={participantAge}
						participantGender={participant.gender}
					/>
				</div>
			);
		});
	}

	setSelectedCategory(category) {
		const { selectedCategory } = this.props;
		const { selection } = this.state;

		// if there is a selectedCategory
		// deselects the selectedCategory and selected new category
		if (selectedCategory) {
			selection[selectedCategory._id] = false;
		}

		// update selectedCategory to category or null
		this.props.selectCategory(category, () => {
			// if category is not null
			// update selection
			if (category) {
				selection[category._id] = true;
				this.setState({ selection });
			}
		});
	}

	render() {
		const { race, participant, categories } = this.props;
		// disable next button if no category was selected
		const disabled = !Object.values(this.state.selection).includes(true);
		if (!race || !categories) return <Progress />;

		return (
			<div>
				<Stepper />
				<Paper zDepth={3} style={style.paper}>
					<h2>{race.name}</h2>
					<h3>Step 2: Category Selection</h3>
					<h5>
						Participant:{' '}
						{`${participant.fullName} (${participant.gender}, ${calculateAge(
							participant.dateOfBirth
						)} years old)`}{' '}
					</h5>
					<div className="row">
						{this.renderCategoryCard(categories, participant)}
					</div>
					<br />
					<br />
					<br />
					<br />
					<Divider />
					<br />
					<div>
						<RaisedButton
							label="Back"
							secondary={true}
							onClick={() =>
								this.props.history.push(
									`/registration/participant/${race._id}`
								)}
						/>
						<RaisedButton
							label="Next"
							primary={true}
							disabled={disabled}
							style={style.nextBtn}
							onClick={() =>
								this.props.history.push(`/registration/meal/${race._id}`)}
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
		participant: state.participant,
		categories: state.categories[ownProps.match.params.race_id]
	};
};

export default connect(mapStateToProps, {
	selectCategory,
	updateStepper,
	fetchCategoriesAvailability
})(CategorySelection);
