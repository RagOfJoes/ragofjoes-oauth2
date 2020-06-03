const nanoid = require('nanoid');
const crypto = require('crypto');
const interactions = require('./policy');
const UserModel = require('../db/models/User');

const jwks = require('../jwks.json');

module.exports = {
	clients: [
		// Example Client Registration Structure
		// {
		// 	key: 'test',
		// 	// Client's allowed scopes
		// 	scope: 'email openid',
		// 	// Confidential: Client credentials
		// 	client_secret: 'testsecret',
		// 	client_id: 'project_clarity_dev',
		// 	client_name: 'Project Clarity Dev',
		// 	/**
		// 	 * When authenticating/authorizing use these
		// 	 * backchannel redirects to complete auth flow
		// 	 */
		// 	redirect_uris: ['https://lvh:8080/cb'],
		// 	token_endpoint_auth_method: 'client_secret_post',
		// 	// Allowed response_types
		// 	response_types: ['code id_token', 'code', 'id_token', 'none'],
		// 	// Allowed grant types
		// 	grant_types: ['authorization_code', 'implicit', 'refresh_token']
		// }
	],
	logoutSource: async ({ res, oidc }, form) => {
		const { uid } = oidc.session;
		return res.render('logout', {
			uid,
			form,
			flash: '',
			client: {},
			title: 'Sign-out',
			session: oidc.session,
			pageHint: 'Logging you out...',
			dbg: {
				params: {},
				prompt: {},
			},
		});
	},
	interactions: {
		policy: interactions,
		url(ctx, interaction) {
			// eslint-disable-line no-unused-vars
			return `/idp/interaction/${ctx.oidc.uid}`;
		},
	},
	cookies: {
		names: {
			session: 'op:sid',
			state: 'op:state',
			interaction: 'op:interaction',
			resume: 'op:interaction_resume',
		},
		short: { httpOnly: false, signed: true },
		long: { httpOnly: false, signed: true, maxAge: 14 * 24 * 60 * 60 * 1000 }, // 14 days in ms
		keys: ['some secret key', 'and also the old rotated away some time ago', 'and one more'],
	},
	/**
	 * What scopes/claims we will allow clients to have
	 */
	scopes: ['openid', 'profile', 'email', 'offline_access'],
	claims: {
		profile: ['profile'],
		email: ['email', 'email_verified'],
	},
	features: {
		revocation: { enabled: true }, // defaults to false<
		introspection: { enabled: true }, // defaults to false
		devInteractions: { enabled: false }, // defaults to true
		registration: {
			// Allows dynamic Client registration
			enabled: false,
			// idFactory: () => nanoid(),
			// secretFactory: function (ctx) {
			// 	return Buffer.from(crypto.randomBytes(64)).toString('base64');
			// },
		},
		registrationManagement: {
			// Allow Client metadata to be Updated/Deleted
			enabled: false,
			// rotateRegistrationAccessToken: true,
		},
	},
	findAccount: UserModel.findAccount,
	issueRefreshToken: async (ctx, client, code) => {
		return (
			client.grantTypeAllowed('refresh_token') &&
			(code.scopes.has('offline_access') || code.scopes.has('openid') || code.scopes.has('token'))
		);
	},
	responseTypes: ['none', 'code', 'id_token', 'code id_token'],
	jwks,
	ttl: {
		IdToken: 10 * 60, // 10 minutes in seconds
		DeviceCode: 10 * 60, // 10 minutes in seconds
		AuthorizationCode: 10 * 60, // 10 minutes in seconds
		// For Production
		// AccessToken: 60 * 60 * 24 * 14, // 14 days in seconds
		// RefreshToken: 60 * 60 * 24 * 60 // 60 days in seconds
		// For Dev
		AccessToken: 60 * 30, // 2 hours,
		RefreshToken: 60 * 60 * 2,
	},
};
