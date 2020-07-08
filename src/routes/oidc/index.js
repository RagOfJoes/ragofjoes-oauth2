import login from './login';
import signup from './signup';
import confirm from './confirm';
import render from 'lib/render';
import { Express } from 'express';
import _continue from './continue';
import { urlencoded } from 'express'; // eslint-disable-line import/no-unresolved
import UserModel from 'db/models/User';
import setNoCache from 'lib/setNoCache';
import { Provider } from 'oidc-provider';

const body = urlencoded({ extended: false });

/**
 * OIDC routes
 *
 * @param {Express} server
 * @param {Object} assets
 * @param {Provider} provider
 */
export default (server, assets, provider) => {
	const {
		constructor: {
			errors: { SessionNotFound },
		},
	} = provider;

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
					return render(req, res, assets, {
						uid,
						flash: lastSubmission?.flash,
						prompt: {
							name: prompt.name,
							details: {
								login_hint: prompt.details.login_hint,
							},
						},
						client: {
							tosUri: client.tosUri,
							clientId: client.clientId,
							policyUri: client.policyUri,
							clientName: client.clientName,
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
						profile: { given_name, family_name, name },
					} = await account.claims('prompt', 'email profile', { email: 1, profile: 1 }, []);

					return render(req, res, assets, {
						uid,
						prompt: {
							name: prompt.name,
							details: {
								login_hint: prompt.details.login_hint,
							},
						},
						client: {
							tosUri: client.tosUri,
							clientId: client.clientId,
							policyUri: client.policyUri,
							clientName: client.clientName,
						},
						user: {
							name: {
								full: name,
								first: given_name,
								last: family_name,
							},
							email: email,
						},
					});
				}
				case 'login': {
					return render(req, res, assets, {
						uid,
						flash: lastSubmission?.flash,
						prompt: {
							name: prompt.name,
							details: {
								login_hint: prompt.details.login_hint || params.login_hint,
							},
						},
						client: {
							tosUri: client.tosUri,
							clientId: client.clientId,
							policyUri: client.policyUri,
							clientName: client.clientName,
						},
					});
				}
				case 'consent': {
					return render(req, res, assets, {
						uid,
						prompt: {
							name: prompt.name,
							details: {
								scopes: prompt.details?.scopes,
								claims: prompt.details?.claims,
								login_hint: prompt.details.login_hint,
							},
						},
						client: {
							tosUri: client.tosUri,
							clientId: client.clientId,
							policyUri: client.policyUri,
							clientName: client.clientName,
						},
					});
				}
				default:
					return render(req, res, assets, {
						uid,
						error: {
							name: 'InternalServerError',
							message: 'Oops something went wrong! Please try again later',
						},
					});
			}
		} catch (err) {
			next(err);
		}
	});

	server.post('/interaction/:uid/login', setNoCache, body, async (req, res, next) => await login(provider, req, res, next));
	server.post('/interaction/:uid/signup', setNoCache, body, async (req, res, next) => await signup(provider, req, res, next));
	server.post('/interaction/:uid/confirm', setNoCache, body, async (req, res, next) => await confirm(provider, req, res, next));
	server.post('/interaction/:uid/continue', setNoCache, body, async (req, res, next) => await _continue(provider, req, res, next));

	server.use((err, req, res, next) => {
		if (err instanceof SessionNotFound) {
			// handle interaction expired / session not found error
			render(req, res, assets, {
				error: {
					name: err.name,
					message: 'Invalid Session!',
				},
			});
			return;
		}

		render(req, res, assets, {
			error: {
				name: err.name,
				message: 'Oops something went wrong! Please try again later',
			},
		});
		return;
	});
};
