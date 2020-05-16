const bcrypt = require('bcryptjs');
const { pick } = require('lodash');
const { Schema, model } = require('mongoose');

const schema = new Schema({
	email: {
		trim: true,
		index: true,
		type: String,
		unique: true,
		required: [true, 'Username must not be empty!']
	},
	email_verified: {
		type: Boolean,
		default: false
	},
	phone: {
		type: String
	},
	phone_verified: {
		type: Boolean,
		default: false
	},
	password: {
		type: String,
		required: [true, 'Password must not be empty!']
	},
	// Meta Data
	given_name: {
		type: String,
		required: [true, 'First Name must not be empty!']
	},
	family_name: {
		type: String,
		required: [true, 'Last Name must not be empty!']
	},
	middle_name: {
		type: String
	},
	nickname: {
		type: String
	},
	birthdate: Date,
	// Omit: Not yet supported
	// federation: {
	// 	id: String,
	// 	token: String,
	// 	tokenExpire: Date,
	// 	rtToken: String,
	// 	rtTokenExpire: Date
	// },
	// isFederated: {
	// 	type: Boolean,
	// 	default: false
	// },
	logins: [String]
});

schema.pre('save', function(next) {
	const user = this;

	if (!user.password || user.password.length < 6) {
		throw new Error('Password field is missing');
	}

	if (user.isModified('password')) {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				if (!err) {
					user.password = hash;
				}
				next();
			});
		});
	} else {
		next();
	}
});

schema.virtual('accountId').get(function() {
	return this._id.toString();
});

schema.virtual('id').get(function() {
	return this._id.toString();
});

schema.virtual('name').get(function() {
	return this.given_name + ' ' + this.family_name;
});

schema.virtual('firstname').get(function() {
	return this.given_name;
});

schema.virtual('lastname').get(function() {
	return this.family_name;
});

schema.virtual('givenname').get(function() {
	return this.given_name;
});

schema.virtual('familyname').get(function() {
	return this.family_name;
});

schema.virtual('fullname').get(function() {
	return this.given_name + ' ' + this.family_name;
});

schema.methods = {
	toJSON: function() {
		const user = this.toObject();
		return pick(user, ['_id', 'email']);
	}
};

schema.statics = {
	createUser: async function(email, password) {
		try {
			const userInstance = new UserSchema({ email, password });
			userInstance.save();
			return userInstance.toJSON();
		} catch (e) {
			throw new Error(e);
		}
	},
	getAccount: function(user) {
		const account = {
			accountId: user.id,
			/**
			 * Supported claims that can be outputted with a valid scope
			 */
			claims: (use, scope, claims, rejected) => {
				return {
					sub: user.id,
					email: user.email,
					email_verified: user.email_verified,
					profile: {
						sub: user.id,
						name: user.name,
						given_name: user.given_name,
						family_name: user.family_name
					}
				};
			}
		};
		return account;
	},
	findByID: async function(ctx, id) {
		try {
			const user = await UserSchema.findById(id, '-password');
			return user;
		} catch (e) {
			throw new Error(e);
		}
	},
	findAccount: async function(ctx, sub, token) {
		try {
			const user = await UserSchema.findById(sub, '-password');
			if (!user) return undefined;
			const account = UserSchema.getAccount(user);
			return account;
		} catch (e) {
			return undefined;
		}
	},
	findByCredentials: async function(email, password) {
		try {
			const user = await UserSchema.findOne({ email });
			if (!user) {
				throw new Error('Credentials not valid');
			}
			const isvalid = await bcrypt.compare(password, user.password);
			if (!isvalid) {
				throw new Error('Credentials not valid');
			}
			return user;
		} catch (e) {
			throw new Error(e);
		}
	},
	findByLogin: async function(login) {
		try {
			const users = await UserSchema.find({ email: login });
			if (!users || users.length !== 1) throw new Error('User not found');
			const user = users[0];
			const account = UserSchema.getAccount(user);
			return account;
		} catch (e) {
			throw new Error(e);
		}
	}
};

const UserSchema = model('User', schema);

module.exports = UserSchema;
