const Admin = require('../models/Admin');
const { secret } = require('../config/keys');
const jwt = require('jwt-simple');

// TODO: change to cookie based?
function tokenForAdmin(admin) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: admin.id, iat: timestamp }, secret);
}

module.exports = (app, requireAdminSignin) => {
	app.post('/api/admin/create', async (req, res, next) => {
		const { email, password } = req.body;
		const admin = new Admin({
			email,
			password
		});
		try {
			await admin.save();
			res.json({ token: tokenForAdmin(admin) });
		} catch (err) {
			next(err);
		}
	});

	app.post('/api/admin/signin', requireAdminSignin, (req, res, next) => {
		// passport parse admin as req.user
		res.json({ token: tokenForAdmin(req.user) });
	});
};
