import crypto from 'crypto';
import render from 'lib/render';

const features = {
	features: {
		// Token Revocation
		// Defaults to false
		revocation: { enabled: true },
		// Dev Interactions
		// Defaults to true
		// If true, library uses in-library fron-end
		// to allow for significantly easier testing
		devInteractions: { enabled: false },
		// Token Introspection
		introspection: {
			// Defauls to false
			enabled: true,
			// TODO: Create a check for whether a client is a
			// Resource Server or not
			allowedPolicy: async (ctx, client, token) => {
				if (!client) return false;

				if (client.introspectionEndpointAuthMethod === 'none') {
					return false;
				}
				return true;
			},
		},

		// Dynamic Client Registration
		// Defaults to false
		registration: {
			enabled: true,
			secretFactory: (ctx) => {
				return Buffer.from(crypto.randomBytes(64)).toString('base64');
			},
		},
		// Client update and delete features
		// Defaults to false
		registrationManagement: {
			enabled: true,
			rotateRegistrationAccessToken: true,
		},

		// Logout
		// Defaults to true
		rpInitiatedLogout: {
			enabled: true,
			// Renders an empty page that
			// automatically submit logout form
			// thus skipping consent. That should be
			// done on the client's side anyways.
			logoutSource: async (ctx, form) => {
				try {
					ctx.body = `
					<!DOCTYPE html>
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
			// Post Logout Success Page
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
		},
	},
};

export default features;
