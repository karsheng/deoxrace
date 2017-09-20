// Main starting point of the app
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const compress = require('compression');
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
	// TODO: temporary connection, to open a dev account on mongolab
	mongoose.connect('mongodb://localhost:deoevents/deoevents');
}

// App Setup
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' })); // parse all request to json
app.use(cors());
app.use(compress());

require('./routes/userAuthRoutes')(app, requireSignin);
require('./routes/userRoutes')(app, requireAuth);
require('./routes/userRegistrationRoutes')(app, requireAuth);
require('./routes/fakepaymentRoutes')(app, requireAuth);
require('./routes/adminAuthRoutes')(app, requireAdminSignin);
require('./routes/adminRoutes')(app, requireAdminAuth);
require('./routes/availabilityRoutes')(app, requireAuth);
require('./routes/publicRoutes')(app);

app.use((err, req, res, next) => {
	res.status(422).send({ error: err.message });
});

module.exports = app;
