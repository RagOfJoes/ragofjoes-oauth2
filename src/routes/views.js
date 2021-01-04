import mongoose from 'mongoose';
import { Express } from 'express';
import { Provider } from 'oidc-provider';
import render from 'lib/render';
import UserModel from 'db/models/user';
import getUserObject from 'lib/getUserObject';

/**
 * View Routes
 *
 * @param {Express} server
 * @param {Object} assets
 * @param {Provider} provider
 */
export default (server, assets, provider) => {
	/**
	 * Login/Signup
	 */
	server.get(['/login', '/signup'], async (req, res) => {
		// 1. Create/find existing session
		const ctx = provider.app.createContext(req, res);
		const session = await provider.Session.get(ctx);
		try {
			// 2. Check if user is already logged in
			if (session?.account) {
				const { account } = session;
				const user = await UserModel.findById(
					mongoose.Types.ObjectId(account),
					'-_id -password'
				);
				// 2a. Redirect to home page, if found
				if (user) {
					res.status(302).location('/').end();
					return;
				}
			}
		} catch (e) {}
		// 3. Render page if no user is logged in
		render(req, res, assets);
		return;
	});

	/**
	 * Profile
	 */
	server.get(['/', '/profile'], async (req, res) => {
		// 1. Retrive necessary variables from Provider
		const ctx = provider.app.createContext(req, res);
		const session = await provider.Session.get(ctx);
		try {
			if (session?.account) {
				const { account } = session;
				// 2. Try and find the user
				const user = await UserModel.findById(
					mongoose.Types.ObjectId(account),
					'-_id -password'
				);

				// 3. If User was found then render page
				if (user) {
					render(req, res, assets, {
						user: getUserObject(user),
					});
					return;
				}
			}

			// 4. If no user or session was found then redirect to
			// signup
			res.status(302).location('/login').end();
			return;
		} catch (e) {}
	});

	/**
	 * Account Security
	 */
	server.get('/security', async (req, res) => {
		// 1. Retrive necessary variables from Provider
		const ctx = provider.app.createContext(req, res);
		const session = await provider.Session.get(ctx);
		try {
			if (session?.account) {
				const { account } = session;
				// 2. Try and find the user
				const user = await UserModel.findById(
					mongoose.Types.ObjectId(account),
					'-_id -password'
				);

				// 3. If User was found then render page
				if (user) {
					render(req, res, assets, {
						user: getUserObject(user),
					});
					return;
				}
			}

			// 4. If no user or session was found then redirect to
			// signup
			res.status(302).location('/login').end();
			return;
		} catch (e) {}
	});

	/**
	 * Dynamic Client Registration
	 */
	server.get('/client', async (req, res) => {
		// 1. Retrive necessary variables from Provider
		const ctx = provider.app.createContext(req, res);
		const session = await provider.Session.get(ctx);
		try {
			if (session?.account) {
				const { account } = session;
				// 2. Try and find the user
				const user = await UserModel.findById(
					mongoose.Types.ObjectId(account),
					'-_id -password'
				);

				// 3. If User was found then render page
				if (user) {
					render(req, res, assets, {
						user: getUserObject(user),
					});
					return;
				}
			}

			// 4. If no user or session was found then redirect to
			// signup
			res.status(302).location('/login').end();
			return;
		} catch (e) {}
	});
};
