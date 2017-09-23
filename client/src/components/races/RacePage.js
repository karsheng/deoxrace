import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as raceActions from '../../actions/raceActions';
// import { openAuthDialog } from '../../actions/auth_actions';
import { Link } from 'react-router-dom';
import Progress from '../Progress';
import {
	Card,
	CardActions,
	CardMedia,
	CardTitle,
	CardText
} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import formatDate from '../../utils/formatDate';
import getTime from '../../utils/getTime';
import RaceMap from './RaceMap';
import RaceCategoryTable from './RaceCategoryTable';
// import AuthDialog from '../auth/auth_dialog';
// import RegistrationCheckDialog from '../registration/registration_check_dialog';
import RaceAccommodationDialog from './RaceAccommodationDialog';
import RaceDirectionDialog from './RaceDirectionDialog';

const style = {
	card: {
		maxWidth: '768px',
		margin: '0 auto'
	},
	cardImg: {
		maxHeight: '380px',
		height: 'auto'
	},
	registerButton: {
		marginLeft: '8px'
	},
	directionBtn: {
		marginRight: '8px'
	}
};

class RacePage extends Component {
	constructor(props) {
		super(props);
		// regCheckDialogOpen: false,
		this.state = {
			accoDialogOpen: false,
			directionDialogOpen: false
		};
	}
	componentDidMount() {
		window.scrollTo(0, 0);
		const { race_id } = this.props.match.params;
		this.props.fetchRace(race_id);
	}

	// openRegCheckDialog() {
	// 	this.setState({ regCheckDialogOpen: true });
	// }
	//
	// closeRegCheckDialog() {
	// 	this.setState({ regCheckDialogOpen: false });
	// }

	openAccoDialog() {
		this.setState({ accoDialogOpen: true });
	}

	closeAccoDialog() {
		this.setState({ accoDialogOpen: false });
	}

	openDirectionDialog() {
		this.setState({ directionDialogOpen: true });
	}

	closeDirectionDialog() {
		this.setState({ directionDialogOpen: false });
	}

	renderOrganizerDetails(organizers) {
		return organizers.map(organizer => {
			return (
				<div key={organizer._id}>
					<h3> Organizer Details</h3>
					{organizer.name ? <p>Organizer: {organizer.name}</p> : ''}
					{organizer.email ? <p>Email: {organizer.email}</p> : ''}
					{organizer.website ? <p>Website: {organizer.email}</p> : ''}
				</div>
			);
		});
	}

	renderRaceDetails(race) {
		const time = getTime(race.datetime);
		const earlyBirdDetails = () => {
			if (race.hasEarlyBirdRate) {
				return (
					<p>Early Bird Expiry Date: {formatDate(race.earlyBirdDeadline)}</p>
				);
			}
			return null;
		};

		return (
			<div>
				<h3>Race Info</h3>
				<p>Date & Time : {`${formatDate(race.datetime)} ${time}`}</p>
				<p>Venue: {race.address}</p>
				<p>Registration Deadline: {formatDate(race.registrationDeadline)}</p>
				{earlyBirdDetails()}
				<RaisedButton
					style={style.directionBtn}
					label="Direction"
					onClick={this.openDirectionDialog.bind(this)}
				/>
				<RaisedButton
					label="Accommodation"
					onClick={this.openAccoDialog.bind(this)}
				/>
			</div>
		);
	}

	renderCollectionInfo(race) {
		if (race.collectionInfo) {
			const collections = race.collectionInfo;
			return collections.map(collection => {
				return (
					<div key={collection._id}>
						<h3>Collection Info</h3>
						<p>
							Location:{' '}
							<Link
								to={`https://www.google.com/maps?q=${collection.lat},${collection.lng}`}
								target="_blank"
							>
								{collection.address}
							</Link>
						</p>
						<p>Date & Time: {collection.time}</p>
						<p>Description: {collection.description}</p>
					</div>
				);
			});
		}
	}

	renderDeliveryInfo(delivery) {
		if (delivery.hasDeliveryOption) {
			return (
				<div>
					<p>Delivery By Post: Yes</p>
				</div>
			);
		}
	}

	renderApparelInfo(apparel) {
		if (apparel.sizes) {
			return (
				<div>
					<h3>Apparel Info</h3>
					<p>Attachment to be added</p>
				</div>
			);
		}
	}

	// handleRegisterButtonclick() {
	// 	if (this.props.authenticated) {
	// 		this.openRegCheckDialog();
	// 	} else {
	// 		this.props.openAuthDialog();
	// 	}
	// }

	renderRegisterButton(race) {
		// onClick={this.handleRegisterButtonclick.bind(this)}
		return (
			<RaisedButton
				style={style.registerButton}
				primary={true}
				label="Register"
			/>
		);
	}

	render() {
		const { race } = this.props;
		if (!race) return <Progress />;
		return (
			<div>
				<Card style={style.card}>
					<CardMedia>
						<img style={style.cardImg} src={race.imageUrl} alt="" />
					</CardMedia>
					<CardTitle title={race.name} />
					<CardText>
						{this.renderRaceDetails(race)}
						<br />
						{this.renderOrganizerDetails(race.organizer)}
						<br />
						{this.renderCollectionInfo(race)}
						{this.renderDeliveryInfo(race.delivery)}
						<br />
						{this.renderApparelInfo(race.apparel)}
						<br />
						<h3>Categories</h3>
						<RaceCategoryTable race={race} />
						<br />
					</CardText>
					<CardActions>{this.renderRegisterButton(race)}</CardActions>
					<CardMedia>
						<RaceMap lat={race.lat} lng={race.lng} />
					</CardMedia>
				</Card>
				<RaceAccommodationDialog
					accoDialogOpen={this.state.accoDialogOpen}
					closeAccoDialog={this.closeAccoDialog.bind(this)}
					lat={race.lat}
					lng={race.lng}
					address={race.address}
				/>
				<RaceDirectionDialog
					directionDialogOpen={this.state.directionDialogOpen}
					closeDirectionDialog={this.closeDirectionDialog.bind(this)}
					lat={race.lat}
					lng={race.lng}
				/>
			</div>
		);
	}

	// <AuthDialog />
	// <RegistrationCheckDialog
	// 	regCheckDialogOpen={this.state.regCheckDialogOpen}
	// 	closeRegCheckDialog={this.closeRegCheckDialog.bind(this)}
	// />
}

function mapStateToProps(state, ownProps) {
	return {
		race: state.races[ownProps.match.params.race_id]
		// authenticated: state.auth.authenticated
	};
}

export default connect(mapStateToProps, raceActions)(RacePage);
