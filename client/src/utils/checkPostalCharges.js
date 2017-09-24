export default (postalAddress, racePostalCharges, cb) => {
	if (postalAddress.country.toLowerCase() === 'malaysia') {
		if (
			postalAddress.state.toLowerCase() === 'sabah' ||
			postalAddress.state.toLowerCase() === 'sarawak' ||
			postalAddress.state.toLowerCase() === 'labuan'
		) {
			return cb('East Malaysia', racePostalCharges.eastMalaysia);
		} else {
			return cb('West Malaysia', racePostalCharges.westMalaysia);
		}
	} else {
		return cb('International', racePostalCharges.international);
	}
};
