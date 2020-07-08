import render from './render';
import jwks from '../../jwks.json';
import interactions from './policy';
import UserModel from 'db/models/User';

import { getLongCookies, getShortCookies } from './cookies';

export default {
	clients: [
		// Example Client Registration Structure
		{
			key: 'test',
			// Client's allowed scopes
			scope: 'email profile openid',
			// Confidential: Client credentials
			client_id: 'id',
			client_secret: 'secret',
			client_name: 'Test Client',
			/**
			 * When authenticating/authorizing use these
			 * backchannel redirects to complete auth flow
			 */
			token_endpoint_auth_method: 'client_secret_basic',
			redirect_uris: ['http://localhost:8081/api/callback'],
			// Allowed response_types
			response_types: ['code'],
			// Allowed grant types
			grant_types: ['authorization_code', 'refresh_token'],
		},
	],
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
	logoutSource: async (ctx, form) => {
		try {
			ctx.body = `<!DOCTYPE html>
			<head>
				<title>Logout | RagOfJoes</title>
			</head>
			<body>
				${form}
				<h6>Logging Out...</h6>

			<script text="text/javascript">
				window.addEventListener('DOMContentLoaded', (event) => {
					const form = document.getElementById('op.logoutForm');
					const logoutInput = document.createElement('input');
					logoutInput.setAttribute('type', 'hidden');
					logoutInput.setAttribute('name', 'logout');
					logoutInput.setAttribute('value', 'yes');
					form.appendChild(logoutInput);
					form.submit();
					return;
				});
			</script>
			</body>
			</html>`;
		} catch (e) {}
	},
	postLogoutSuccessSource: async ({ req, res }) => {
		const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

		try {
			return render(req, res, assets, {
				prompt: {
					name: 'logout.success',
				},
			});
		} catch (e) {}
	},
	interactions: {
		policy: interactions,
		url(ctx, interaction) {
			// eslint-disable-line no-unused-vars
			return `/interaction/${ctx.oidc.uid}`;
		},
	},
	cookies: {
		names: {
			session: 'op:sid',
			state: 'op:state',
			interaction: 'op:interaction',
			resume: 'op:interaction_resume',
		},
		long: getLongCookies(), // 14 days in ms
		short: getShortCookies(),
		keys: process.env.SECURE_KEYS.split(','),
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
		introspection: {
			enabled: true,
			allowedPolicy: async (ctx, client, token) => {
				if (!client) return false;

				if (client.introspectionEndpointAuthMethod === 'none') {
					return false;
				}
				return true;
			},
		}, // defaults to false
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
		AccessToken:
			process.env.NODE_ENV === 'development'
				? 60 * 30 // 30 min :
				: 60 * 60 * 24 * 14, // 2 weeks,
	},
};
