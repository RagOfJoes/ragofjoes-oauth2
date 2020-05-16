/* eslint-disable no-console, max-len, camelcase, no-unused-vars */
const { inspect } = require('util');
const querystring = require('querystring');

const isEmpty = require('lodash/isEmpty');
const { urlencoded } = require('express'); // eslint-disable-line import/no-unresolved
const body = urlencoded({ extended: false });
const UserModel = require('../../db/models/User');

// Routes
const signUp = require('./signup');
const login = require('./login');
const abort = require('./abort');
const confirm = require('./confirm');
const continueInteraction = require('./continue');

// Scope Definitions
const scopeDefinitions = require('../scopeDefinitions');

const keys = new Set();
// Allow debug info
const debug = obj =>
	querystring.stringify(
		Object.entries(obj).reduce((acc, [key, value]) => {
			keys.add(key);
			if (isEmpty(value)) return acc;
			acc[key] = inspect(value, { depth: null });
			return acc;
		}, {}),
		'<br/>',
		': ',
		{
			encodeURIComponent(value) {
				return keys.has(value) ? `<strong>${value}</strong>` : value;
			}
		}
	);

module.exports = (server, provider) => {
	const {
		constructor: {
			errors: { SessionNotFound }
		}
	} = provider;

	server.use((req, res, next) => {
		const orig = res.render;
		// you'll probably want to use a full blown render engine capable of layouts
		res.render = (view, locals) => {
			server.render(view, locals, (err, html) => {
				if (err) throw err;
				orig.call(res, '_layout', {
					...locals,
					body: html
				});
			});
		};
		next();
	});

	const setNoCache = (req, res, next) => {
		res.set('Pragma', 'no-cache');
		res.set('Cache-Control', 'no-cache, no-store');
		next();
	};

	server.get('/idp/interaction/:uid', setNoCache, async (req, res, next) => {
		try {
			const { uid, prompt, params, session, lastSubmission } = await provider.interactionDetails(req, res);
			const client = await provider.Client.find(params.client_id);

			switch (prompt.name) {
				case 'sign_up': {
					return res.render('signup', {
						uid,
						client,
						params,
						title: 'Sign-up',
						details: prompt.details,
						pageHint: 'Create a new Figure account',
						session: session ? debug(session) : undefined,
						flash: lastSubmission && lastSubmission.flash ? lastSubmission.flash : undefined,
						dbg: {
							params: debug(params),
							prompt: debug(prompt)
						}
					});
				}
				case 'login': {
					return res.render('login', {
						uid,
						client,
						params,
						title: 'Sign-in',
						details: prompt.details,
						pageHint: 'Use your Figure account',
						session: session ? debug(session) : undefined,
						flash: lastSubmission && lastSubmission.flash ? lastSubmission.flash : undefined,
						dbg: {
							params: debug(params),
							prompt: debug(prompt)
						}
					});
				}
				case 'select_account': {
					if (!session) {
						// If no session is found then redirect user to login
						return provider.interactionFinished(req, res, { sign_up: {}, select_account: {} }, { mergeWithLastSubmission: false });
					}
					const account = await UserModel.findAccount(undefined, session.accountId);
					const { email } = await account.claims('prompt', 'email', { email: 1 }, []);
					return res.render('select_account', {
						uid,
						email,
						client,
						params,
						pageHint: '',
						title: 'Select account',
						details: prompt.details,
						session: session ? debug(session) : undefined,
						dbg: {
							params: debug(params),
							prompt: debug(prompt)
						}
					});
				}
				case 'consent': {
					return res.render('interaction', {
						uid,
						client,
						params,
						scopeDefinitions,
						title: 'Consent',
						details: prompt.details,
						pageHint: 'Access control',
						session: session ? debug(session) : undefined,
						dbg: {
							params: debug(params),
							prompt: debug(prompt)
						}
					});
				}
				default:
					return undefined;
			}
		} catch (err) {
			return next(err);
		}
	});

	server.get('/idp/interaction/:uid/abort', setNoCache, async (req, res, next) => await abort(provider, req, res, next));
	server.post('/idp/interaction/:uid/login', setNoCache, body, async (req, res, next) => await login(provider, req, res, next));
	server.post('/idp/interaction/:uid/signup', setNoCache, body, async (req, res, next) => await signUp(provider, req, res, next));
	server.post('/idp/interaction/:uid/confirm', setNoCache, body, async (req, res, next) => await confirm(provider, req, res, next));
	server.post(
		'/idp/interaction/:uid/continue',
		setNoCache,
		body,
		async (req, res, next) => await continueInteraction(provider, req, res, next)
	);

	server.use((err, req, res, next) => {
		if (err instanceof SessionNotFound) {
			// handle interaction expired / session not found error
			res.status(400).json({
				error: 'invalid_request',
				error_description: 'Invalid Session'
			});
		}
		next(err);
	});
};
