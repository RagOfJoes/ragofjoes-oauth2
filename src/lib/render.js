import App from '../App';
import React from 'react';
import theme from 'lib/theme';
import Helmet from 'react-helmet';
import { Request, Response } from 'express';
import getServerHTML from 'lib/getServerHTML';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import InteractionProvider from 'components/Providers/InteractionProvider';
import ServerStyleSheets from '@material-ui/styles/ServerStyleSheets';

/**
 * Render function
 *
 * @param {Request} req Express Request Object
 * @param {Response} res Express Response Object
 * @param {Object} assets Razzle Assets
 * @param {String} title Page Title
 * @param {Object} interaction OIDC Provider Interaction Object
 * @param {Object} interaction.prompt Prompt Object
 * @param {String} interaction.prompt.name Prompt name
 * @param {String} interaction.prompt.login_hint Login: login hint ie. email/username
 * @param {Object} interaction.prompt.logout_form Logout: Form to render on logout page
 * @param {String} interaction.prompt.logout_form.xsrf Logout: XSRF token
 * @param {String} interaction.prompt.logout_form.action Logout: Form Action URL
 * @param {Object} interaction.prompt.details Prompt details
 * @param {Object} interaction.client Client Detail Object
 * @param {String} interaction.client.tosUri Terms of Server URI
 * @param {String} interaction.client.policyUri Policy URI
 * @param {String} interaction.client.clientName Client Name
 * @param {Object} interaction.user User Object
 * @param {String} interaction.user.email User's Email
 * @param {Object} interaction.user.name User's username
 * @param {String} interaction.user.name.full User's full name
 * @param {String} interaction.user.name.last User's last name
 * @param {Boolean} interaction.user.isAdmin User flag for admin
 * @param {String} interaction.user.name.first User's first name
 */
const Index = (
	req,
	res,
	assets,
	interaction = {
		flash: '',

		prompt: {
			name: '',
			details: {
				claims: { accepted: [], rejected: [] },
				scopes: {
					new: [],
					accepted: [],
					rejected: [],
				},
				login_hint: '',
				logout_form: {
					xsrf: '',
					action: '',
				},
			},
		},

		client: {
			tosUri: '',
			policyUri: '',
			clientName: '',
		},

		user: {
			email: '',
			isAdmin: false,
			name: {
				full: '',
				last: '',
				first: '',
			},
		},
	}
) => {
	// 1. Setup Content for react-router for any
	// CSR pages
	const context = {};

	// 2. Setup SSR Stylesheets
	const sheets = new ServerStyleSheets();

	// 3. Generate Markup to SSR
	const markup = renderToString(
		sheets.collect(
			<StaticRouter location={req.url} context={context}>
				<ThemeProvider theme={theme}>
					<InteractionProvider {...interaction}>
						<CssBaseline />
						<App />
					</InteractionProvider>
				</ThemeProvider>
			</StaticRouter>
		)
	);

	// 4. Generate react-helmet
	const helmet = Helmet.renderStatic();
	// 5. Convert stylesheets to string to SSR
	const css = sheets.toString();

	// 6. Handle Routes
	if (context.url) {
		// CSR
		redirect(301, context.url);
	} else {
		// SSR
		res.status(200).send(getServerHTML(css, assets, markup, helmet, interaction));
	}
};
export default Index;
