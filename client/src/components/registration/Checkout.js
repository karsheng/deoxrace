import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	setTotalPrice,
	createRegistration
} from '../../actions/registrationActions';
import _ from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';
// import { participantFormCompleted } from '../../helper/';
import Progress from '../Progress';
import formatDate from '../../utils/formatDate';
import getPostalCharges from '../../utils/getPostalCharges';
import Paper from 'material-ui/Paper';
import Stepper from './Stepper';
import { updateStepper } from '../../actions/stepperActions';
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
	},
	priceCol: {
		textAlign: 'center'
	}
};

class Checkout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			earlyBirdValid: false,
			submitting: false
		};
	}

	componentWillMount() {
		this.props.updateStepper(3);
		const { race_id } = this.props.match.params;
		const { selectedCategory, race } = this.props;
		if (!selectedCategory)
			return this.props.history.push(`/registration/participant/${race_id}`);
		// if (!participantFormCompleted(participant)) return this.props.history.push(`/registration/participant/${race_id}`);
		if (!race) return this.props.history.push(`/race/${race_id}`);

		const { earlyBirdDeadline } = race;

		if (earlyBirdDeadline && new Date(earlyBirdDeadline) > Date.now()) {
			this.setState({ earlyBirdValid: true });
		}

		this.props.setTotalPrice(this.getTotalPrice());
	}

	componentDidMount() {
		window.scrollTo(0, 0);
	}

	handleCheckout() {
		this.setState({ submitting: true });
		const { race, selectedCategory, selectedMeals, participant } = this.props;

		const orders = _.values(selectedMeals);

		this.props.createRegistration(
			{
				race,
				category: selectedCategory,
				orders,
				participant,
				registerForSelf: participant.registerForSelf
			},
			(err, registration) => {
				if (err) return this.setState({ submitting: false });
				this.props.history.push(`/registration/payment/${registration._id}`);
			}
		);
	}

	renderCategoryPrice(category) {
		const { earlyBird, normal } = category.price;

		return this.state.earlyBirdValid ? earlyBird : normal;
	}

	getTotalPrice() {
		const { selectedMeals, selectedCategory, race, participant } = this.props;

		let totalPrice = this.state.earlyBirdValid
			? selectedCategory.price.earlyBird
			: selectedCategory.price.normal;

		_.map(selectedMeals, selectedMeal => {
			totalPrice += selectedMeal.meal.price * selectedMeal.quantity;
		});

		if (race.hasDeliveryOption && participant.wantsPostalService) {
			totalPrice += getPostalCharges(
				participant.postalAddress,
				race.delivery.postalCharges,
				function(location, charges) {
					return charges;
				}
			);
		}

		return totalPrice;
	}

	renderPostalCharges(race, participant) {
		if (race.delivery.hasDeliveryOption && participant.wantsPostalService) {
			return getPostalCharges(
				participant.postalAddress,
				race.delivery.postalCharges,
				function(location, charges) {
					return (
						<div>
							<div className="col-xs-8">{`Postal charges: ${location}`}</div>
							<div style={style.priceCol} className="col-xs-4">
								{(charges / 100).toFixed(2)}
							</div>
						</div>
					);
				}
			);
		}
	}

	renderMealNameAndPrice(selectedMeals) {
		return _.map(selectedMeals, selectedMeal => {
			return (
				<div key={selectedMeal.meal._id}>
					<div className="col-xs-8">
						{selectedMeal.meal.name +
							' (RM ' +
							(selectedMeal.meal.price / 100).toFixed(2) +
							') x ' +
							selectedMeal.quantity}
					</div>
					<div style={style.priceCol} className="col-xs-4">
						{(selectedMeal.meal.price * selectedMeal.quantity / 100).toFixed(2)}
					</div>
				</div>
			);
		});
	}

	renderParticipantDetails(participant) {
		const postalDetails = participant => {
			if (participant.wantsPostalService) {
				const { postalAddress } = participant;
				return (
					<div>
						<h4>Postal Address</h4>
						<p>{postalAddress.line1}</p>
						<p>{postalAddress.line2}</p>
						<p>{postalAddress.line3}</p>
						<p>{postalAddress.city}</p>
						<p>{postalAddress.postcode}</p>
						{postalAddress.stateName.toLowerCase() !== 'others' ? (
							<p>{postalAddress.stateName}</p>
						) : (
							''
						)}
						<p>{postalAddress.country}</p>
					</div>
				);
			}
		};

		return (
			<div>
				<div className="col-xs-12 col-md-6">
					<h4>Participant Details</h4>
					<p>Full Name: {participant.fullName}</p>
					<p>Participant Email: {participant.email}</p>
					<p>Identity Number: {participant.identityNumber}</p>
					<p>Gender: {participant.gender}</p>
					<p>Nationality: {participant.nationality}</p>
					<p>Country of Residence: {participant.countryOfResidence}</p>
					<p>Phone: {participant.phone}</p>
					<p>Postcode: {participant.postcode}</p>
					<p>Apparel Size: {participant.apparelSize}</p>
					<p>Date of Birth: {formatDate(participant.dateOfBirth)}</p>
					<h4>Emergency Contact</h4>
					<p>Emergency Contact Name: {participant.emergencyContact.name}</p>
					<p>Relationship: {participant.emergencyContact.relationship}</p>
					<p>Phone: {participant.emergencyContact.phone}</p>
				</div>
				<div className="col-xs-12 col-md-6">
					<h4>Medical Condition</h4>
					<p>
						Medical Condition:{' '}
						{participant.hasMedicalCondition === true ? 'Yes' : 'No'}
					</p>
					<p>Description: {participant.medicalConditionDescription}</p>
					<h4>Racepack Collection</h4>
					<p>
						Collection:{' '}
						{participant.wantsPostalService ? 'by post' : 'self collection'}
					</p>
					{postalDetails(participant)}
				</div>
			</div>
		);
	}

	render() {
		const { race, selectedCategory, selectedMeals, participant } = this.props;

		if (!race) return <Progress />;

		return (
			<div>
				<Stepper />
				<Paper zDepth={3} style={style.paper}>
					<h2>{race.name}</h2>
					<h3>Step 4: Confirmation and Payment</h3>
					<div className="row">
						<div className="col-xs-8">
							<h4>Description</h4>
						</div>
						<div style={style.priceCol} className="col-xs-4">
							<h4>Price (RM)</h4>
						</div>
					</div>
					<div className="row">
						<div className="col-xs-8">{selectedCategory.name}</div>
						<div style={style.priceCol} className="col-xs-4">
							{(this.renderCategoryPrice(selectedCategory) / 100).toFixed(2)}
						</div>
						{this.renderMealNameAndPrice(selectedMeals)}
						{this.renderPostalCharges(race, participant)}
					</div>
					<hr />
					<div className="row">
						<div className="col-xs-8">Total</div>
						<div style={style.priceCol} className="col-xs-4">
							{(this.getTotalPrice() / 100).toFixed(2)}
						</div>
					</div>
					<br />
					<br />
					<div className="row">
						{this.renderParticipantDetails(participant)}
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
								this.props.history.push(`/registration/meal/${race._id}`)}
						/>
						<RaisedButton
							label="Payment"
							primary={true}
							style={style.nextBtn}
							disabled={this.state.submitting}
							onClick={this.handleCheckout.bind(this)}
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
		selectedMeals: state.registration.selectedMeals,
		participant: state.participant
	};
};

export default connect(mapStateToProps, {
	setTotalPrice,
	createRegistration,
	updateStepper
})(Checkout);
