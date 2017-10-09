export default (postalAddress, racePostalCharges, cb) => {
	if (postalAddress.country.toLowerCase() === 'malaysia') {
		if (
			postalAddress.stateName.toLowerCase() === 'sabah' ||
			postalAddress.stateName.toLowerCase() === 'sarawak' ||
			postalAddress.stateName.toLowerCase() === 'labuan'
		) {
			return cb('East Malaysia', racePostalCharges.eastMalaysia);
		} else {
			return cb('West Malaysia', racePostalCharges.westMalaysia);
		}
	} else {
		return cb('International', racePostalCharges.international);
	}
};
