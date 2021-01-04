import render from 'lib/render';
import features from './features';
import jwks from '../../../jwks.json';
import UserModel from 'db/models/user';
import interactions from 'provider/policy';
import { getLongCookies, getShortCookies } from 'lib/cookies';
import { scopes, subjectTypes, responseTypes } from './exported';

const config = {
	...features,
	// JWKS for signing and encrypting
	jwks,
	// Custom find account fn
	findAccount: UserModel.findAccount,
	// The scopes/claims users will have access to
	scopes: scopes.map((scope) => scope.value),
	subjectTypes: subjectTypes.map((type) => type.value),
	// Response types that clients are able to request
	responseTypes: responseTypes.map((type) => type.value),
	claims: {
		profile: ['profile'],
		email: ['email', 'email_verified'],
	},
	// Interaction policies
	interactions: {
		policy: interactions,
	},
	// Custom routes
	routes: {
		end_session: '/logout',
		registration: '/api/client/register',
	},
	// Token ttls
	ttl: {
		IdToken: 10 * 60, // 10 minutes in seconds
		DeviceCode: 10 * 60, // 10 minutes in seconds
		AuthorizationCode: 10 * 60, // 10 minutes in seconds

		// Tokens
		AccessToken: 60 * 60 * 24 * 14, // 14 days in seconds
		RefreshToken: 60 * 60 * 24 * 60, // 60 days in seconds
	},
	// Cookies
	cookies: {
		names: {
			session: 'op:sid',
			state: 'op:state',
			interaction: 'op:interaction',
			resume: 'op:interaction_resume',
		},
		long: getLongCookies(),
		short: getShortCookies(),
		// Structure should be 1234...,5678...
		keys: process.env.SECURE_KEYS.split(','),
	},
	// Fn that checks whether a client has access to
	// refresh tokens
	issueRefreshToken: async (ctx, client, code) => {
		return (
			client.grantTypeAllowed('refresh_token') &&
			(code.scopes.has('offline_access') ||
				code.scopes.has('openid') ||
				code.scopes.has('token'))
		);
	},
	renderError: async (ctx, out, err) => {
		const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
		const { req, res } = ctx;

		if (err?.status === 404) {
			return render(req, res, assets, {
				error: {
					name: err.name,
					message: '404! Page Not Found!',
				},
			});
		}
		return render(req, res, assets, {
			error: {
				name: err.name,
				message: err.error_description,
			},
		});
	},
};

export default config;
