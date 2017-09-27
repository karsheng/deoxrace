import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import { connect } from 'react-redux';
import { fetchUser } from '../../actions/userActions';
import { Link } from 'react-router-dom';
import Progress from '../Progress';
import Avatar from 'material-ui/Avatar';
import formatDate from '../../utils/formatDate';
import Divider from 'material-ui/Divider';

const style = {
	div: {
		maxWidth: 768,
		margin: '0 auto'
	},
	paper: {
		height: '100%',
		width: '100%'
	}
};

class History extends Component {
	componentDidMount() {
		this.props.fetchUser();
	}

	renderUpcomingEvents(registrations) {
		return registrations.map(reg => {
			if (reg.race.open) {
				return (
					<div key={reg._id}>
						<Divider inset={false} />
						<ListItem
							primaryText={reg.participant.fullName}
							secondaryText={
								<span>
									{reg.race.name}
									<br />
									{formatDate(reg.race.datetime)}
								</span>
							}
							secondaryTextLines={2}
							containerElement={<Link to={'/race/' + reg.race._id} />}
							leftAvatar={<Avatar src={reg.race.imageUrl} />}
						/>
					</div>
				);
			}
			return null;
		});
	}

	renderClosedEvents(registrations) {
		return registrations.map(reg => {
			if (!reg.race.open) {
				return (
					<div key={reg._id}>
						<Divider inset={false} />
						<ListItem
							primaryText={reg.participant.fullName}
							secondaryText={
								<span>
									{reg.race.name}
									<br />
									{formatDate(reg.race.datetime)}
								</span>
							}
							secondaryTextLines={2}
							containerElement={<Link to={'/race/' + reg.race._id} />}
							leftAvatar={<Avatar src={reg.race.imageUrl} />}
						/>
					</div>
				);
			}
			return null;
		});
	}

	render() {
		const { registrations } = this.props;
		return (
			<div className="row" style={style.div}>
				<div className="col-xs-12">
					<h2>Events Joined</h2>
					<Tabs>
						<Tab label="Upcoming">
							<Paper style={style.paper}>
								<List>
									{registrations ? (
										this.renderUpcomingEvents(registrations)
									) : (
										<Progress />
									)}
								</List>
							</Paper>
						</Tab>
						<Tab label="Closed">
							<Paper style={style.paper}>
								<List>
									{registrations ? (
										this.renderClosedEvents(registrations)
									) : (
										<Progress />
									)}
								</List>
							</Paper>
						</Tab>
					</Tabs>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		registrations: state.user.registrations
	};
};

export default connect(mapStateToProps, { fetchUser })(History);
