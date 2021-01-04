import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { Provider } from 'oidc-provider';
import { Express, urlencoded } from 'express';
import UserModel from 'db/models/user';
import getUserObject from 'lib/getUserObject';
import ClientUsersModel from 'db/models/client-users';

/**
 * API Routes
 *
 * @param {Express} server
 * @param {Provider} provider
 */
export default (server, provider) => {
	const body = urlencoded({ extended: false });

	/**
	 * Signup
	 */
	server.post('/api/signup', body, bodyParser.json(), async (req, res) => {
		// 1. Validate body
		let dirty = false;
		const errors = [];
		const { body } = req;
		if (!body.given_name) {
			dirty = true;
			errors.push('your first name');
		}
		if (!body.family_name) {
			dirty = true;
			errors.push('your last name');
		}
		if (!body.email) {
			dirty = true;
			errors.push('an email');
		}
		if (!body.password) {
			dirty = true;
			errors.push('a password');
		}
		if (dirty) {
			res.status(400).send({
				ok: false,
				error: {
					name: 'InvalidData',
					message: `You must provide ${errors.join(', ')}.`,
				},
			});
			return;
		}

		let newUser = null;
		const allowedKeys = ['given_name', 'family_name', 'email', 'phone', 'password'];
		const newUserParams = {};
		allowedKeys.forEach((key) => (newUserParams[key] = body[key]));
		try {
			// 2. Create new User
			const newModel = new UserModel({ ...newUserParams });
			newUser = await newModel.save();
		} catch (e) {}
		if (!newUser) {
			res.status(400).send({
				ok: false,
				error: {
					name: 'InvalidData',
					message: 'Email is not available.',
				},
			});
			return;
		}
		// 3. Create new session with newly created user
		await provider.setProviderSession(req, res, { account: newUser.id });
		// 4. Respond
		res.status(200).send({
			ok: true,
			data: {
				user: getUserObject(newUser),
			},
		});
		return;
	});

	/**
	 * Login
	 */
	server.post('/api/login', body, bodyParser.json(), async (req, res) => {
		// 1. Validate body
		if (!req.body.login || !req.body.password) {
			res.status(400).send({
				ok: false,
				error: {
					name: 'InvalidData',
					message: 'You must provide username and password.',
				},
			});
			return;
		}

		let user = null;
		try {
			// 2. Find user
			user = await UserModel.findByCredentials(req.body.login, req.body.password);
		} catch (e) {}
		// 3. Handle no user found
		if (!user) {
			res.status(400).send({
				ok: false,
				error: {
					name: 'InvalidData',
					message: 'Invalid email/password provided.',
				},
			});
			return;
		}
		// 4. Create/modify session to use newly logged in account
		await provider.setProviderSession(req, res, {
			account: user.id,
			remember: req.body?.remember_me,
		});
		// 5 Respond
		res.status(200).send({
			ok: true,
			data: {
				user: getUserObject(user),
			},
		});
		return;
	});

	/**
	 * Edit Profile
	 */
	server.post('/api/edit/profile', body, bodyParser.json(), async (req, res) => {
		const ctx = provider.app.createContext(req, res);
		const session = await provider.Session.get(ctx);
		const { account } = session;

		let user = {};
		try {
			user = await UserModel.findById(mongoose.Types.ObjectId(account));

			if (!user) {
				res.status(401).send({
					ok: false,
					error: {
						name: 'Unauthorized',
						message: 'You are not authorized to perform this action.',
					},
				});
				return;
			}
		} catch (e) {
			res.status(401).send({
				ok: false,
				error: {
					name: 'Unauthorized',
					message: 'You are not authorized to perform this action.',
				},
			});

			return;
		}

		const { body } = req;
		const { email, phone, firstname, lastname, password } = body;
		const changedEmail = user.email !== email;
		const changedPhone = user.phone !== phone;
		const changedLastName = user.lastname !== lastname;
		const changedFirstName = user.firstname !== firstname;

		let isValidPassword = false;
		try {
			isValidPassword = await user.validPassword(password);
		} catch (e) {
			res.status(400).send({
				ok: false,
				error: {
					message: e,
					name: 'InvalidPassword',
				},
			});
			return;
		}
		if (!isValidPassword) {
			res.status(400).send({
				ok: false,
				error: {
					name: 'InvalidPassword',
					message: 'Password provided is incorrect!',
				},
			});

			return;
		}

		if (changedEmail || changedPhone || changedFirstName || changedLastName) {
			const updates = {
				email,
				phone,
				given_name: firstname,
				family_name: lastname,
			};

			user.email = updates.email;
			user.phone = updates.phone;
			user.given_name = updates.given_name;
			user.family_name = updates.family_name;
			user.password = updates.password || user.password;
			let changedUser;
			try {
				changedUser = await user.save();
			} catch (e) {
				res.status(500).send({
					ok: false,
					error: {
						name: 'InternalServerError',
						message: 'Oops! Failed to save user. Please try again later.',
					},
				});
				return;
			}

			if (changedUser) {
				res.status(200).send({
					ok: true,
					data: { user: getUserObject(changedUser) },
				});
				return;
			}
		}
		res.status(500).send({
			ok: false,
			error: {
				name: 'InternalServerError',
				message: 'Oops! Something went wrong! Please try again later.',
			},
		});
	});

	/**
	 * Edit Account Security
	 */
	server.post('/api/edit/security', body, bodyParser.json(), async (req, res) => {
		const ctx = provider.app.createContext(req, res);
		const session = await provider.Session.get(ctx);
		const { account } = session;

		// 1. Check that a session exists and a user exists within the session
		let user = null;
		try {
			user = await UserModel.findById(mongoose.Types.ObjectId(account));
		} catch (e) {
			res.status(401).send({
				ok: false,
				error: {
					name: 'Unauthorized',
					message: 'You are not authorized to perform this action.',
				},
			});
			return;
		}
		if (!user) {
			res.status(401).send({
				ok: false,
				error: {
					name: 'Unauthorized',
					message: 'You are not authorized to perform this action.',
				},
			});
			return;
		}
		// 2. Check passwords
		const { body } = req;
		if (!body['current-password'] || !body['new-password'] || !body['confirm-password']) {
			res.status(400).send({
				ok: false,
				error: {
					name: 'InvalidData',
					message:
						'You must provide your current password, a new password, and confirmation for new password.',
				},
			});
		}
		let isValidPassword = false;
		try {
			isValidPassword = await user.validPassword(body['current-password']);
		} catch (e) {
			res.status(400).send({
				ok: false,
				error: {
					message: e,
					name: 'InvalidPassword',
				},
			});
			return;
		}
		if (!isValidPassword) {
			res.status(400).send({
				ok: false,
				error: {
					name: 'InvalidPassword',
					message: 'Password provided is incorrect!',
				},
			});
			return;
		}
		if (body['new-password']?.length < 6 || body['new-password']?.length > 100) {
			res.status(400).send({
				ok: false,
				error: {
					name: 'InvalidPassword',
					message: 'Password must be between 6 and 100 characters long.',
				},
			});
			return;
		}
		if (body['new-password'] !== body['confirm-password']) {
			res.status(400).send({
				ok: false,
				error: {
					name: 'InvalidPassword',
					message: 'New password and confirm password must match.',
				},
			});
			return;
		}
		// 3. Attempt to save new password to user
		let dirty = true;
		try {
			user.password = body['new-password'];
			await user.save();
			dirty = false;
		} catch (e) {}
		// 4. If save failed to execute then respond with 500
		if (dirty) {
			res.status(500).send({
				ok: false,
				error: {
					name: 'InternalServerError',
					message: 'Oops! Something went wrong! Please try again later!',
				},
			});
			return;
		}
		// 5. Respond with 200
		res.status(200).send({
			ok: true,
		});
	});

	/**
	 * Get list of clients that a user is authorized to change
	 */
	server.get('/api/client/get-authorized', body, bodyParser.json(), async (req, res) => {
		// 1. Check that a session exists and a user exists within the session
		const ctx = provider.app.createContext(req, res);
		const session = await provider.Session.get(ctx);
		const { account } = session;
		let user = {};
		try {
			user = await UserModel.findById(mongoose.Types.ObjectId(account));

			if (!user) {
				res.status(401).send({
					ok: false,
					error: {
						name: 'Unauthorized',
						message: 'You are not authorized to perform this action.',
					},
				});
				return;
			}
		} catch (e) {
			res.status(401).send({
				ok: false,
				error: {
					name: 'Unauthorized',
					message: 'You are not authorized to perform this action.',
				},
			});

			return;
		}

		// 2. Check that a user is an admin
		if (!user.is_admin) {
			res.status(401).send({
				ok: false,
				error: {
					name: 'Unauthorized',
					message: 'You are not authorized to perform this action.',
				},
			});
			return;
		}

		// 3. Find all clients and restructure data
		const clients = (
			await ClientUsersModel.getAuthorized(mongoose.Types.ObjectId(user._id))
		).map((client) => client.payload);

		// 4. Respond with restructured clients
		res.status(200).send({
			ok: true,
			data: {
				clients,
			},
		});
	});
};
