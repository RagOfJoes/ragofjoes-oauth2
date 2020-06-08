const interactions = require('./policy');
const UserModel = require('../db/models/User');
const { getLongCookies, getShortCookies } = require('./cookies');

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
	renderError: async (ctx, out, error) => {
		ctx.type = 'html';
		ctx.body = `
		<!DOCTYPE html>
		<html>
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
				<meta http-equiv="x-ua-compatible" content="ie=edge" />
				<title>Error!</title>
				<link rel="shortcut icon" href="/images/favicon.ico" />
				<!-- Material Design CDN -->
				<link href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&display=swap" rel="stylesheet" />
				<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
				<link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet" />
				<script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>

				<!-- Load our own stylesheet after Material Design to overwrite certain styles -->
				<link href="/stylesheets/css/index.css" rel="stylesheet" type="text/css" />
			</head>
			<body>
				<div class="container">
					<div class="card mdc-elevation--z4">
						<div class="page-hints">
							<h2 class="mdc-typography--headline5">Error</h2>
							<p class="mdc-typography--subtitle1">Something went wrong!</p>
						</div>
					</div>
				</div>

				<script text="text/javascript">
					window.addEventListener('DOMContentLoaded', (event) => {
						window.mdc.autoInit();
					});
				</script>
			</body>
		</html>`;
	},
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
		AccessToken: 60 * 30, // 2 hours,
		RefreshToken: 60 * 60 * 2,
	},
};
