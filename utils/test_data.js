// race with earlyBird and hasDeliveryOption
// participant with wantsPostalService = true

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
	race: {
		name: 'Race 1',
		datetime: new Date(2018, 3, 3),
		address: 'Race Avenue',
		lat: 3,
		lng: 101,
		description: 'Race description',
		imageUrl: 'http://via.placeholder.com/350x150',
		open: true,
		types: 'run',
		resultUrl: 'www.example.com',
		stateName: 'Kuala Lumpur',
		earlyBirdDeadline: new Date(2018, 1, 1),
		registrationDeadline: new Date(2018, 2, 2),
		hasDeliveryOption: true
	},
	categories: {
		one: {
			name: 'Male 10k Run 18-30 yo',
			price: {
				earlyBird: 5000,
				normal: 6000
			},
			gender: 'male',
			ageMin: 0,
			ageMax: 100,
			participantLimit: 200,
			prize: 'RM 100',
			type: 'run',
			distance: 10
		},
		two: {
			name: 'Female 10k Run 18-30 yo',
			price: {
				earlyBird: 5000,
				normal: 6000
			},
			gender: 'female',
			ageMin: 0,
			ageMax: 100,
			participantLimit: 200,
			prize: 'RM 200',
			type: 'run',
			distance: 10
		}
	},
	meals: {
		one: {
			name: 'Meal 1',
			price: 900,
			description: 'Meal 1 description',
			imageUrl: 'http://via.placeholder.com/350x150'
		},
		two: {
			name: 'Meal 2',
			price: 1090,
			description: 'Meal 1 description',
			imageUrl: 'http://via.placeholder.com/350x150'
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
	participant2: {
		fullName: 'Jared Dunn',
		identityNumber: '1234567',
		nationality: 'U.S.',
		countryOfResidence: 'U.S.',
		gender: 'male',
		dateOfBirth: new Date(1980, 1, 2),
		email: 'jared@piedpiper.com',
		phone: '1234567890',
		postcode: '45720',
		city: 'San Francisco',
		stateName: 'California',
		emergencyContact: {
			name: 'Richard Hendricks',
			relationship: 'Partner',
			phone: '1234567890'
		},
		medicalCondition: {
			yes: true,
			description: 'Fragile posterior'
		},
		apparelSize: 'M',
		waiverDeclaration: true,
		wantsPostalService: true,
		postalAddress: {
			line1: '1 Pied Piper Road',
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
		postalCharges: {
			eastMalaysia: 1200,
			westMalaysia: 600,
			international: 5000
		}
	},
	collection: [
		{
			address: 'Collection venue 1',
			time: '1000 to 1700',
			description: 'Collection description',
			lat: 3,
			lng: 101
		}
	]
};
