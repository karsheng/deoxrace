import _ from 'lodash';
import React, { Component } from 'react';
import Progress from '../Progress';
import {
	withGoogleMap,
	GoogleMap,
	Marker,
	withScriptjs
} from 'react-google-maps';

const RaceMapGoogle = _.flowRight(withScriptjs, withGoogleMap)(props => (
	<GoogleMap
		defaultZoom={18}
		defaultCenter={{ lat: props.lat, lng: props.lng }}
	>
		{<Marker {...props.marker} />}
	</GoogleMap>
));

class RaceMap extends Component {
	state = {
		marker: {
			position: {
				lat: this.props.lat,
				lng: this.props.lng
			}
		}
	};

	// TODO: extract api keys to config?
	render() {
		return (
			<RaceMapGoogle
				loadingElement={<Progress />}
				googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAcg0gg8Bv8Ty9dtFb1EtnsSkdxEZdQ1fE"
				containerElement={<div style={{ height: `300px` }} />}
				mapElement={<div style={{ height: `300px` }} />}
				marker={this.state.marker}
				lat={this.props.lat}
				lng={this.props.lng}
			/>
		);
	}
}

export default RaceMap;
