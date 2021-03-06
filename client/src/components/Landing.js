import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchRaces } from '../actions/raceActions';
import _ from 'lodash';
import RaceCard from './races/RaceCard';
import Progress from './Progress';

class Landing extends Component {
	componentWillMount() {
		this.props.fetchRaces();
	}

	renderRaceCards() {
		const { races } = this.props;
		if (!races) return <Progress />;

		return _.map(races, race => {
			return <RaceCard key={race._id} race={race} />;
		});
	}

	render() {
		return <div>{this.renderRaceCards()}</div>;
	}
}

const mapStateToProps = state => {
	return {
		races: state.races
	};
};

export default connect(mapStateToProps, { fetchRaces })(Landing);
