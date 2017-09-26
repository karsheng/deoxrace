import { FETCH_USER, UPDATE_USER } from '../actions/types';

export default function(state = {}, action) {
	switch (action.type) {
		case FETCH_USER:
			return mapDataToFormKey(action.payload);
		case UPDATE_USER:
			return mapDataToFormKey(action.payload);
		default:
			return state;
	}
}

function mapDataToFormKey(user) {
	if (user.dateOfBirth) {
		user.dateOfBirth = new Date(user.dateOfBirth);
	}

	if (user.emergencyContact) {
		user.emergencyContactName = user.emergencyContact.name;
		user.relationship = user.emergencyContact.relationship;
		user.emergencyContactPhone = user.emergencyContact.phone;
	}

	if (user.postalAddress) {
		user.line1 = user.postalAddress.line1;
		user.line2 = user.postalAddress.line2;
		user.line3 = user.postalAddress.line3;
		user.postalCity = user.postalAddress.city;
		user.postalPostcode = user.postalAddress.postcode;
		user.postalState = user.postalAddress.stateName;
		user.postalCountry = user.postalAddress.country;
	}

	return user;
}
