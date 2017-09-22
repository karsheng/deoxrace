import React, { Component } from 'react';
import { Card, CardHeader, CardMedia, CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import formatDate from '../../utils/formatDate';
import { withRouter } from 'react-router-dom';

const style = {
	cardContainer: {
		marginBottom: '24px'
	},
	cardActions: {
		textAlign: 'center'
	},
	viewRaceButton: {
		boxShadow: 'none',
		borderRadius: '0px',
		height: '48px'
	}
};

class RaceCard extends Component {
	render() {
		const { race } = this.props;
		return (
			<div className="col-xs-12 col-sm-4">
				<Card containerStyle={style.cardContainer}>
					<CardHeader
						title={race.name}
						subtitle={race.address + ' | ' + formatDate(race.datetime)}
					/>
					<CardMedia>
						<img src={race.imageUrl} alt={race.name} />
					</CardMedia>
					<CardActions style={style.cardActions}>
						<FlatButton
							style={style.viewRaceButton}
							fullWidth={true}
							secondary={true}
							onClick={() => this.props.history.push(`/race/${race._id}`)}
							label="View Race"
						/>
					</CardActions>
				</Card>
			</div>
		);
	}
}

export default withRouter(RaceCard);
