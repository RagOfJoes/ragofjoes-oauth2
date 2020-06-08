// Deps
'use strict';
process.env.NODE_ENV !== 'production' && require('dotenv/config');
const url = require('url');
const path = require('path');
const { set } = require('lodash');
const helmet = require('helmet');
const { Server } = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');

const { Provider } = require('oidc-provider');

// Local Imports
const MongoAdapter = require('./lib/mongodb');
const interactionsRoutes = require('./lib/routes');

const oidcConfig = require('./lib/config');

const { PORT = 3000, ISSUER = `http://localhost:${PORT}` } = process.env;

// Compile SCSS files to CSS
if (process.env.NODE_ENV !== 'production') require('./lib/compileSCSS')();

// Express
const app = express();
app.use(helmet());
app.use(cookieParser());

// Views setup
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Express routes
app.get('/isalive', (req, res) => {
	res.send('Server is alive');
});

// Server and OIDC Setip
let server = Server;
(async () => {
	const provider = new Provider(ISSUER, { adapter: MongoAdapter, ...oidcConfig });

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

	interactionsRoutes(app, provider);
	app.use(provider.callback);
	server = app.listen(PORT, () => {
		console.log(`OIDC app is listening on port ${PORT}, check its /.well-known/openid-configuration`);
	});
})().catch((err) => {
	if (server && server.listening) server.close();
	// console.error(err);
	process.exitCode = 1;
});
