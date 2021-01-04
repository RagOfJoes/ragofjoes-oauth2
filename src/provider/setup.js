import set from 'lodash/set';
import mongoose from 'mongoose';
import { Express } from 'express';
import { Provider } from 'oidc-provider';
import oidcConfig from 'provider/config';
import MongoAdapter from 'provider/mongo-adapter';

/**
 * Setup Provider
 *
 * @param {Express} server
 * @param {mongoose} client
 */
export default (server, client) => {
	const { PORT, ISSUER } = process.env;

	const provider = new Provider(ISSUER || `http://localhost:${PORT}`, {
		adapter: MongoAdapter(client.connection.db),
		...oidcConfig,
	});

	if (process.env.NODE_ENV === 'production') {
		server.enable('trust proxy');
		provider.proxy = true;
		set(oidcConfig, 'cookies.short.secure', true);
		set(oidcConfig, 'cookies.long.secure', true);

		server.use((req, res, next) => {
			if (req.secure) {
				next();
			} else if (req.method === 'GET' || req.method === 'HEAD') {
				res.redirect(
					url.format({
						protocol: 'https',
						host: req.get('host'),
						pathname: req.originalUrl,
					})
				);
			} else {
				res.status(400).json({
					ok: false,
					error: {
						name: 'InvalidRequest',
						message: 'Must be accessed with HTTPS.',
					},
				});
			}
		});
	}

	return provider;
};
