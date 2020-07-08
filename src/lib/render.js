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
import InteractionProvider from 'lib/Providers/InteractionProvider';
import ServerStyleSheets from '@material-ui/styles/ServerStyleSheets';

/**
 * Render function
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Object} assets
 * @param {String} title
 * @param {Object} interaction
 * @param {Object} interaction.prompt
 * @param {String} interaction.prompt.name
 * @param {String} interaction.prompt.login_hint
 * @param {Object} interaction.prompt.logout_form
 * @param {String} interaction.prompt.logout_form.xsrf
 * @param {String} interaction.prompt.logout_form.action
 * @param {Object} interaction.prompt.details
 * @param {Object} interaction.client
 * @param {String} interaction.client.tosUri
 * @param {String} interaction.client.policyUri
 * @param {String} interaction.client.clientName
 * @param {Object} interaction.user
 * @param {String} interaction.user.email
 * @param {Object} interaction.user.name
 * @param {String} interaction.user.name.full
 * @param {String} interaction.user.name.last
 * @param {String} interaction.user.name.first
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
			name: {
				full: '',
				last: '',
				first: '',
			},
			email: '',
		},
	}
) => {
	const context = {};
	const sheets = new ServerStyleSheets();
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
	const helmet = Helmet.renderStatic();
	const css = sheets.toString();

	if (context.url) {
		// Somewhere a `<Redirect>` was rendered
		redirect(301, context.url);
	} else res.status(200).send(getServerHTML(css, assets, markup, helmet, interaction));

	return;
};
export default Index;
