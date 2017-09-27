import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSpecificRaces } from '../../actions/raceActions';
import RaceCard from './RaceCard';
import RaceFilter from './RaceFilter';
import _ from 'lodash';

class RaceBrowse extends Component {
	constructor(props) {
		super(props);
		this.state = {
			type: 'any',
			distance: 0,
			month: 9999,
			stateName: 'any'
		};
		this.setFilter = this.setFilter.bind(this);
	}

	isWithinFilteredRange(element, index, array) {
		let min, max;

		switch (this.state.distance) {
			case 0:
				min = 0;
				max = 9999;
				break;
			case 5:
				min = 0;
				max = 5;
				break;
			case 10:
				min = 5;
				max = 10;
				break;
			case 21:
				min = 10;
				max = 21;
				break;
			case 42:
				min = 21;
				max = 42;
				break;
			case 9999:
				min = 42;
				max = 9999;
				break;
			default:
				min = 0;
				max = 9999;
		}
		return element >= min && element <= max;
	}

	isInSelectedMonth(date) {
		const datetime = new Date(date);
		if (this.state.month === 9999) {
			return true;
		} else {
			return datetime.getMonth() === this.state.month;
		}
	}

	isInSelectedState(stateName) {
		if (this.state.stateName === 'any') {
			return true;
		} else {
			return stateName === this.state.stateName;
		}
	}

	setFilter(e, state) {
		e.preventDefault();
		this.setState(state);
	}

	componentDidMount() {
		this.props.fetchSpecificRaces(this.state.type, e => {
			if (e) alert('Something went wrong');
		});
	}

	renderRaces() {
		const filteredRaces = _.map(this.props.filteredRaces, race_id => {
			return this.props.races[race_id];
		});

		return filteredRaces.map(race => {
			const distances = getDistance(race.categories);
			const distanceIsWithinRange = distances.some(
				this.isWithinFilteredRange.bind(this)
			);
			const raceIsInSelectedMonth = this.isInSelectedMonth.bind(this)(
				race.datetime
			);
			const raceisInSelectedState = this.isInSelectedState.bind(this)(
				race.stateName
			);
			if (
				distanceIsWithinRange &&
				raceIsInSelectedMonth &&
				raceisInSelectedState
			) {
				return <RaceCard key={race._id} race={race} />;
			}
			return null;
		});
	}

	render() {
		const { races } = this.props;
		if (!races) return <div>Loading...</div>;
		return (
			<div>
				<div className="col-xs-12">
					<h2>Browse Races</h2>
				</div>
				<RaceFilter state={this.state} setFilter={this.setFilter} />
				{this.renderRaces()}
			</div>
		);
	}
}

const getDistance = categories => {
	return categories.map(category => {
		return category.distance;
	});
};

const mapStateToProps = state => {
	return {
		races: state.races,
		filteredRaces: state.races.filteredRaces
	};
};

export default connect(mapStateToProps, { fetchSpecificRaces })(RaceBrowse);
