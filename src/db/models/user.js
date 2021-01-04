import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
	email: {
		trim: true,
		index: true,
		type: String,
		unique: [true, 'Email is not available.'],
		required: [true, 'Username must not be empty!'],
	},
	email_verified: {
		type: Boolean,
		default: false,
	},
	phone: {
		type: String,
	},
	phone_verified: {
		type: Boolean,
		default: false,
	},
	password: {
		type: String,
		minlength: 6,
		maxlength: 100,
		required: [true, 'Password must not be empty!'],
	},
	// Meta Data
	is_admin: {
		type: Boolean,
		default: false,
	},
	given_name: {
		type: String,
		required: [true, 'First Name must not be empty!'],
	},
	family_name: {
		type: String,
		required: [true, 'Last Name must not be empty!'],
	},
	middle_name: {
		type: String,
	},
	nickname: {
		type: String,
	},
	birthdate: Date,
	logins: [String],
});

/**
 * Execute before a save happens on a User
 */
UserSchema.pre('save', async function (next) {
	const user = this;

	// 1. Check if a password exists
	if (!user.password) throw new Error('Password field is missing.');

	// 2. If User changed a password
	if (user.isModified('password')) {
		const minLength = 6;
		const maxLength = 100;

		// 2a. Check lengths
		const isLong = user.password.length > maxLength;
		const isShort = user.password.length < minLength;
		if (isLong || isShort) {
			throw new Error('Password must be between 6-100 characters long.');
		}

		// 2b. Encrypt user password
		try {
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(user.password, salt);
			user.password = hash;
		} catch (e) {
			throw new Error('Failed to save new password. Please try again later.');
		}
	}

	// 3. Continue
	next();
});

/**
 * Virtual methods
 */
UserSchema.virtual('accountId').get(function () {
	return this._id.toString();
});
UserSchema.virtual('id').get(function () {
	return this._id.toString();
});
UserSchema.virtual('name').get(function () {
	return this.given_name + ' ' + this.family_name;
});
UserSchema.virtual('firstname').get(function () {
	return this.given_name;
});
UserSchema.virtual('lastname').get(function () {
	return this.family_name;
});
UserSchema.virtual('givenname').get(function () {
	return this.given_name;
});
UserSchema.virtual('familyname').get(function () {
	return this.family_name;
});
UserSchema.virtual('fullname').get(function () {
	return this.given_name + ' ' + this.family_name;
});

/**
 * Methods
 */
UserSchema.methods = {
	validPassword: async function (pass) {
		try {
			//creates a method for user object to validate pw
			return bcrypt.compare(pass, this.password); //compares unhashed user input pw to stored hashed pw
		} catch (e) {}
		return false;
	},
};

/**
 * Static functions
 */
UserSchema.statics = {
	createUser: async function (email, password) {
		try {
			const userInstance = new UserModel({ email, password });
			userInstance.save();
			return userInstance.toJSON();
		} catch (e) {
			throw new Error(e);
		}
	},
	getAccount: function (user) {
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
						family_name: user.family_name,
					},
				};
			},
		};
		return account;
	},
	findByID: async function (ctx, id) {
		try {
			const user = await UserModel.findById(id, '-password');
			return user;
		} catch (e) {
			throw new Error(e);
		}
	},
	findAccount: async function (ctx, sub, token) {
		try {
			const user = await UserModel.findById(sub, '-password');
			if (!user) return undefined;
			const account = UserModel.getAccount(user);
			return account;
		} catch (e) {
			return undefined;
		}
	},
	findByCredentials: async function (email, password) {
		const user = await UserModel.findOne({ email });
		if (!user) {
			throw new Error('Credentials not valid');
		}
		const isvalid = await bcrypt.compare(password, user.password);
		if (!isvalid) {
			throw new Error('Credentials not valid');
		}
		return user;
	},
	findByLogin: async function (login) {
		const users = await UserModel.find({ email: login });
		if (!users || users.length !== 1) throw new Error('User not found');
		const user = users[0];
		const account = UserModel.getAccount(user);
		return account;
	},
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
