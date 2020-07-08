import render from 'lib/render';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import UserModel from 'db/models/User';
import { Provider } from 'oidc-provider';
import { Express, urlencoded } from 'express';

/**
 * View Routes
 *
 * @param {Express} server
 * @param {Object} assets
 * @param {Provider} provider
 */
export default (server, assets, provider) => {
	const body = urlencoded({ extended: false });

	server.get(['/', '/profile'], async (req, res) => {
		const ctx = provider.app.createContext(req, res);
		const session = await provider.Session.get(ctx);
		const { account } = session;
		try {
			const user = await UserModel.findById(mongoose.Types.ObjectId(account), 'email name given_name family_name -_id');

			if (!user) {
				render(req, res, assets, {
					error: {
						name: 'SessionNotFound',
						message: "You don't currently have an active session!",
					},
				});

				return;
			}
			render(req, res, assets, {
				user: {
					email: user.email,
					name: {
						full: user.name,
						first: user.given_name,
						last: user.family_name,
					},
				},
			});
		} catch (e) {}
	});

	server.post('/api/profile/edit', body, bodyParser.json(), async (req, res) => {
		const ctx = provider.app.createContext(req, res);
		const session = await provider.Session.get(ctx);
		const { account } = session;

		try {
			const user = await UserModel.findById(mongoose.Types.ObjectId(account));

			if (!user) {
				res.status(401).send({
					ok: false,
					error: {
						name: 'SessionNotFound',
						message: "You don't currently have an active session!",
					},
				});

				return;
			}

			const { email, firstname, lastname, currentPassword, newPassword } = req.body;
			const changedEmail = user.email !== email;
			const changedLastName = user.lastname !== lastname;
			const changedFirstName = user.firstname !== firstname;
			const isValidPassword = await user.validPassword(currentPassword);
			const changedPassword = newPassword && newPassword.length > 0;

			if (changedEmail || changedFirstName || changedLastName || changedPassword) {
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

				const getUpdate = () => {
					if (changedPassword) {
						return {
							email,
							password: newPassword,
							given_name: firstname,
							family_name: lastname,
						};
					}

					return {
						email,
						given_name: firstname,
						family_name: lastname,
					};
				};

				const updates = getUpdate();

				user.email = updates.email;
				user.given_name = updates.given_name;
				user.family_name = updates.family_name;
				user.password = updates.password || user.password;
				const changedUser = await user.save();

				// return render(req, res, assets, { user: changedUser });
				res.status(200).send({
					ok: true,
					user: {
						email: changedUser.email,
						given_name: changedUser.given_name,
						family_name: changedUser.family_name,
					},
				});

				return;
			}
		} catch (e) {}

		res.status(500).send({
			ok: false,
			error: {
				name: 'InternalServerError',
				message: 'Oops! Something went wrong! Please try again later.',
			},
		});

		res.end();
		return;
	});
};
