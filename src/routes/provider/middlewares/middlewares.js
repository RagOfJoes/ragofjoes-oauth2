import { Express } from 'express';
import { Provider } from 'oidc-provider';
import render from 'lib/render';
import config from 'provider/config';
import registration from './registration';

/**
 * OIDC Provider Middlewares
 * @param {Express} server
 * @param {Object} assets
 * @param {Provider} provider
 */
export default (server, assets, provider) => {
	const {
		constructor: {
			errors: { SessionNotFound },
		},
	} = provider;

	/**
	 * Middlewares
	 */
	provider.use(async (ctx, next) => {
		if (ctx.path.includes(config.routes.registration)) {
			await registration(provider, ctx, next);
			return;
		}

		await next();
	});

	server.use((err, req, res, next) => {
		if (err instanceof SessionNotFound) {
			render(req, res, assets, {
				error: {
					name: err.name,
					message: 'Invalid Session!',
				},
			});
			return;
		}

		render(req, res, assets, {
			error: {
				name: err.name,
				message: 'Oops something went wrong! Please try again later',
			},
		});
		return;
	});
};
