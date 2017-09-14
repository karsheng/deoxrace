const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// max of 5 attempts, resulting in a 2 hour lock
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000;

const AdminSchema = new Schema({
	email: { type: String, unique: true, lowercase: true },
	password: String,
	loginAttempts: { type: Number, required: true, default: 0 },
	lockUntil: Number
});

AdminSchema.virtual('isLocked').get(function() {
	// check for a future lockUntil timestamp
	return !!(this.lockUntil && this.lockUntil > Date.now());
});

// On Save Hook, encrypt password
// Before saving a model, run this function
AdminSchema.pre('save', function(next) {
	// get access to the admin model
	const admin = this;

	if (!admin.isModified('password')) {
		return next();
	}
	// generate a salt then run callback
	bcrypt.genSalt(10, function(err, salt) {
		if (err) {
			return next(err);
		}

		// hash (encrypt) our password using the salt
		bcrypt.hash(admin.password, salt, null, function(err, hash) {
			if (err) {
				return next(err);
			}

			// overwrite plain text password with encrypted password
			admin.password = hash;
			next();
		});
	});
});

AdminSchema.methods.comparePassword = function(candidatePassword, callback) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) {
			return callback(err);
		}
		callback(null, isMatch);
	});
};

AdminSchema.methods.incLoginAttempts = function(cb) {
	// if we have a previous lock that has expired, restart at 1
	if (this.lockUntil && this.lockUntil < Date.now()) {
		return this.update(
			{
				$set: { loginAttempts: 1 },
				$unset: { lockUntil: 1 }
			},
			cb
		);
	}
	// otherwise we're incrementing
	const updates = { $inc: { loginAttempts: 1 } };
	// lock the account if we've reached max attempts and it's not locked already
	if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
		updates.$set = { lockUntil: Date.now() + LOCK_TIME };
	}
	return this.update(updates, cb);
};

// expose enum on the model, and provide an internal convenience reference
const reasons = (AdminSchema.statics.failedLogin = {
	NOT_FOUND: 0,
	PASSWORD_INCORRECT: 1,
	MAX_ATTEMPTS: 2
});

AdminSchema.statics.getAuthenticated = function(email, password, cb) {
	this.findOne({ email: email }, function(err, admin) {
		if (err) return cb(err);
		// make sure the admin exists
		if (!admin) {
			return cb(null, null, reasons.NOT_FOUND);
		}

		// check if the account is currently locked
		if (admin.isLocked) {
			// just increment login attempts if account is already locked
			return admin.incLoginAttempts(function(err) {
				if (err) return cb(err);
				return cb(null, null, reasons.MAX_ATTEMPTS);
			});
		}

		// test for a matching password
		admin.comparePassword(password, function(err, isMatch) {
			if (err) return cb(err);
			// check if the password was a match
			if (isMatch) {
				// if there's no lock or failed attempts, just return the admin
				if (!admin.loginAttempts && !admin.lockUntil) return cb(null, admin);
				// reset attempts and lock info
				const updates = {
					$set: { loginAttempts: 0 },
					$unset: { lockUntil: 1 }
				};

				return admin.update(updates, function(err) {
					if (err) return cb(err);
					return cb(null, admin);
				});
			}

			// password is incorrect, so increment login attempts before responding
			admin.incLoginAttempts(function(err) {
				if (err) return cb(err);
				return cb(null, null, reasons.PASSWORD_INCORRECT);
			});
		});
	});
};

const Admin = mongoose.model('admin', AdminSchema);

module.exports = Admin;
