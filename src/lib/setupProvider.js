import oidc from '../routes/oidc';
import oidcConfig from './config';
import { Express } from 'express';
import { Provider } from 'oidc-provider';

/**
 * Setup Provider
 *
 * @param {Express} server
 * @param {Object} assets
 * @param {Provider} providr
 */
export default (server, assets, provider) => {
	if (process.env.NODE_ENV === 'production') {
		// logger.debug('Production');
		app.enable('trust proxy');
		provider.proxy = true;
		set(oidcConfig, 'cookies.short.secure', true);
		set(oidcConfig, 'cookies.long.secure', true);

		app.use((req, res, next) => {
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
					error: 'invalid_request',
					error_description: 'Must be accessed with HTTPS',
				});
			}
		});
	}

	oidc(server, assets, provider);
	server.use(provider.callback);
};
