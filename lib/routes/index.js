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
const debug = (obj) =>
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
			},
		}
	);

module.exports = (server, provider) => {
	const {
		constructor: {
			errors: { SessionNotFound },
		},
	} = provider;

	const setNoCache = (req, res, next) => {
		res.set('Pragma', 'no-cache');
		res.set('Cache-Control', 'no-cache, no-store');
		next();
	};

	server.get('/interaction/:uid', setNoCache, async (req, res, next) => {
		try {
			const interaction = await provider.interactionDetails(req, res);
			const { uid, prompt, params, session, lastSubmission } = interaction;
			const client = await provider.Client.find(params.client_id);
			switch (prompt.name) {
				case 'sign_up': {
					if (session && session.accountId) {
						// If already logged in then move to select_account
						const prompts = new Set(params.prompt.split(' '));
						prompts.add('select_account');
						params.prompt = 'select_account';
						await interaction.save();
						return provider.interactionFinished(req, res, { sign_up: {} }, { mergeWithLastSubmission: false });
					}
					return res.render('signup', {
						uid,
						client,
						params,
						title: 'Sign-up',
						details: prompt.details,
						pageHint: 'to access ' + client.clientName,
						session: session ? debug(session) : undefined,
						flash: lastSubmission && lastSubmission.flash ? lastSubmission.flash : undefined,
						dbg: {
							params: debug(params),
							prompt: debug(prompt),
						},
					});
				}
				case 'select_account': {
					if (!session) {
						// If no session is found then redirect user to login
						return provider.interactionFinished(req, res, { select_account: {} }, { mergeWithLastSubmission: false });
					}
					const account = await UserModel.findAccount(undefined, session.accountId);
					const {
						email,
						profile: { name },
					} = await account.claims('prompt', 'email profile', { email: 1, profile: 1 }, []);
					return res.render('select_account', {
						uid,
						email,
						name,
						client,
						params,
						pageHint: '',
						title: 'Select account',
						details: prompt.details,
						session: session ? debug(session) : undefined,
						dbg: {
							params: debug(params),
							prompt: debug(prompt),
						},
					});
				}
				case 'login': {
					return res.render('login', {
						uid,
						client,
						params,
						title: 'Sign-in',
						details: prompt.details,
						session: session ? debug(session) : undefined,
						pageHint: 'to continue to ' + client.clientName,
						flash: lastSubmission && lastSubmission.flash ? lastSubmission.flash : undefined,
						dbg: {
							params: debug(params),
							prompt: debug(prompt),
						},
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
							prompt: debug(prompt),
						},
					});
				}
				default:
					return undefined;
			}
		} catch (err) {
			return next(err);
		}
	});

	server.get('/interaction/:uid/abort', setNoCache, async (req, res, next) => await abort(provider, req, res, next));
	server.post('/interaction/:uid/login', setNoCache, body, async (req, res, next) => await login(provider, req, res, next));
	server.post('/interaction/:uid/signup', setNoCache, body, async (req, res, next) => await signUp(provider, req, res, next));
	server.post('/interaction/:uid/confirm', setNoCache, body, async (req, res, next) => await confirm(provider, req, res, next));
	server.post(
		'/interaction/:uid/continue',
		setNoCache,
		body,
		async (req, res, next) => await continueInteraction(provider, req, res, next)
	);

	server.use((err, req, res, next) => {
		if (err instanceof SessionNotFound) {
			// handle interaction expired / session not found error
			return res.render('error', {
				title: 'Error',
				pageHint: 'Session not found!',
			});
		}
		next(err);
	});
};
