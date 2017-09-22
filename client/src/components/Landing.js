import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchRaces } from '../actions/racesActions';
import _ from 'lodash';
import RaceCard from './races/RaceCard';

class Landing extends Component {
	componentDidMount() {
		this.props.fetchRaces();
	}

	renderRaceCards(races) {
		return _.map(races, race => {
			return <RaceCard key={race._id} race={race} />;
		});
	}

	render() {
		const { races } = this.props;
		if (!races) return <div>Loading...</div>;
		return <div>{this.renderRaceCards(races)}</div>;
	}
}

const mapStateToProps = state => {
	return {
		races: state.races
	};
};

export default connect(mapStateToProps, { fetchRaces })(Landing);
