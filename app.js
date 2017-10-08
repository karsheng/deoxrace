// Main starting point of the app
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const compress = require('compression');
const keys = require('./config/keys');

const passportService = require('./services/passport');
const passport = require('passport');
const requireAuth = passport.authenticate('user-jwt', { session: false });
const requireSignin = passport.authenticate('user-local', { session: false });
const requireAdminAuth = passport.authenticate('admin-jwt', { session: false });
const requireAdminSignin = passport.authenticate('admin-local', {
	session: false
});

require('./models/Admin');
require('./models/Associate');
require('./models/Race');
require('./models/Category');
require('./models/Meal');
require('./models/Participant');
require('./models/Registration');
require('./models/Payment');
require('./models/User');

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== 'test') {
	mongoose.connect(keys.mongoURI);
}

// App Setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' })); // parse all request to json
app.use(cors());
app.use(compress());

require('./routes/userAuthRoutes')(app, requireSignin);
require('./routes/userRoutes')(app, requireAuth);
require('./routes/userRegistrationRoutes')(app, requireAuth);
require('./routes/fakePaymentRoutes')(app, requireAuth);
require('./routes/stripePaymentRoutes')(app, requireAuth);
require('./routes/adminAuthRoutes')(app, requireAdminSignin);
require('./routes/adminRoutes')(app, requireAdminAuth);
require('./routes/availabilityRoutes')(app, requireAuth);
require('./routes/publicRoutes')(app);

if (process.env.NODE_ENV === 'production') {
	// Express will serve up production assets
	app.use(express.static('client/build'));

	// Express will serve up the index.html file
	// if it doesn't recognize the route
	const path = require('path');
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

app.use((err, req, res, next) => {
	res.status(422).send({ error: err.message });
});

module.exports = app;
