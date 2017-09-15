module.exports = {
	admin: {
		email: 'admin@deoxrace.com',
		password: 'qwerty123'
	},
	user: {
		fullName: 'Richard Hendricks',
		email: 'richard@piedpiper.com',
		password: 'qwerty123',
		phone: '12345678',
		gender: 'male',
		identityNumber: '123456789',
		nationality: 'U.S.',
		countryOfResidence: 'U.S.',
		city: 'San Francisco',
		postcode: '12345',
		stateName: 'California',
		emergencyContact: {
			name: 'Jared Dunn',
			relationship: 'partner',
			phone: '12345678'
		},
		hasMedicalCondition: true,
		medicalConditionDescription: 'Shrinking',
		dateOfBirth: new Date(1988, 1, 1),
		postalAddress: {
			line1: '123 Nueull Road',
			line2: 'Palo Alto',
			line3: null,
			city: 'San Francisco',
			stateName: 'California',
			postcode: '12345',
			country: 'U.S.'
		}
	},
	participant: {
		fullName: 'Gavin Belson',
		identityNumber: '1234567',
		nationality: 'U.S.',
		countryOfResidence: 'U.S.',
		gender: 'male',
		dateOfBirth: new Date(1988, 1, 2),
		email: 'gavin@hooli.com',
		phone: '1234567890',
		postcode: '45720',
		city: 'San Francisco',
		stateName: 'California',
		emergencyContact: {
			name: 'Richard Hendricks',
			relationship: 'friend',
			phone: '1234567890'
		},
		medicalCondition: {
			yes: true,
			description: 'High colestrol because of the blood boy'
		},
		apparelSize: 'L',
		waiverDeclaration: true,
		wantsPostalService: true,
		postalAddress: {
			line1: '1 Hooli Road',
			line2: 'Silicon Valley',
			line3: 'Palo Alto',
			city: 'San Francisco',
			stateName: 'California',
			postcode: '12345',
			country: 'United States'
		}
	},
	organizer: [
		{
			name: 'Fictional Sports Brand',
			email: 'Fictional@sportsbrand.com',
			website: 'fictionalsportsbrand.com',
			socialMedia: {
				facebook: 'facebook.com/fictionalsportsbrand',
				twitter: 'twitter.com/fictionalsportsbrand',
				instagram: 'instagram.com/fictionalsportsbrand',
				youtube: 'youtube.com/fictionalsportsbrand',
				snapchat: '@fictionalsportsbrand',
				pinterest: '@fictionalsportsbrand'
			}
		}
	],
	apparel: {
		attachmentUrl: null,
		sizes: ['XS', 'S', 'M', 'L', 'XL'],
		otherDetail: null
	},
	delivery: {
		hasDeliveryOption: true,
		postalCharges: {
			eastMalaysia: 12,
			westMalaysia: 6,
			international: 50
		}
	}
};
