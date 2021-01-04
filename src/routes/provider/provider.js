import { Provider } from 'oidc-provider';
import { Express, urlencoded } from 'express'; // eslint-disable-line import/no-unresolved
import login from './login';
import signup from './signup';
import confirm from './confirm';
import render from 'lib/render';
import _continue from './continue';
import listeners from './listeners';
import UserModel from 'db/models/user';
import setNoCache from 'lib/setNoCache';
import middlewares from './middlewares';

const body = urlencoded({ extended: false });

/**
 * OIDC routes
 *
 * TODO: Add Google/Apple/Microsoft/Github callbacks
 *
 * @param {Express} server
 * @param {Object} assets
 * @param {Provider} provider
 */
export default (server, assets, provider) => {
	/**
	 * View Routes
	 */
	server.get('/interaction/:uid', setNoCache, async (req, res, next) => {
		try {
			// 1. Retrieve necessary data for interaction
			const interaction = await provider.interactionDetails(req, res);
			const { uid, prompt, params, session, lastSubmission } = interaction;
			const client = await provider.Client.find(params.client_id);
			// 2. Set default interaction context for front-end
			const interactionContext = {
				uid,
				flash: lastSubmission?.flash,
				prompt: {
					name: prompt.name,
					details: {
						scopes: prompt.details?.scopes,
						claims: prompt.details?.claims,
						login_hint: prompt.details.login_hint || params.login_hint,
					},
				},
				client: {
					tosUri: client.tosUri,
					clientId: client.clientId,
					policyUri: client.policyUri,
					clientName: client.clientName,
				},
			};
			// 3. Figure out what step User is currently in
			switch (prompt.name) {
				case 'sign_up': {
					// If User is already signed in then
					// skip to login
					if (session && session.accountId) {
						const prompts = new Set(params.prompt.split(' '));
						prompts.add('select_account');
						params.prompt = 'select_account';
						await interaction.save();
						return provider.interactionFinished(
							req,
							res,
							{ sign_up: {}, select_account: {} },
							{ mergeWithLastSubmission: false }
						);
					}
					break;
				}
				case 'select_account': {
					// If no session is found then redirect user to login
					if (!session) {
						return provider.interactionFinished(
							req,
							res,
							{ select_account: {} },
							{ mergeWithLastSubmission: false }
						);
					}
					const account = await UserModel.findAccount(undefined, session.accountId);
					const {
						email,
						profile: { given_name, family_name },
					} = await account.claims(
						'prompt',
						'email profile',
						{ email: 1, profile: 1 },
						[]
					);
					interactionContext['user'] = {
						name: {
							first: given_name,
							last: family_name,
							full: `${given_name} ${family_name}`,
						},
						email: email,
					};
					break;
				}
				case 'login': {
					// We could check if user is already logged in
					// but cases where a client prompts for security
					// reasons can appear
					break;
				}
				case 'consent': {
					break;
				}
				default:
					// If no prompt matched then
					// render Error page
					return render(req, res, assets, {
						uid,
						error: {
							name: 'InternalServerError',
							message: 'Invalid prompt requested.',
						},
					});
			}
			return render(req, res, assets, interactionContext);
		} catch (err) {
			next(err);
		}
	});

	/**
	 * API Routes
	 */
	server.post(
		'/interaction/:uid/login',
		setNoCache,
		body,
		async (req, res, next) => await login(provider, req, res, next)
	);
	server.post(
		'/interaction/:uid/signup',
		setNoCache,
		body,
		async (req, res, next) => await signup(provider, req, res, next)
	);
	server.post(
		'/interaction/:uid/confirm',
		setNoCache,
		body,
		async (req, res, next) => await confirm(provider, req, res, next)
	);
	server.post(
		'/interaction/:uid/continue',
		setNoCache,
		body,
		async (req, res, next) => await _continue(provider, req, res, next)
	);

	/**
	 * Middlewares
	 */
	middlewares(server, assets, provider);

	/**
	 * Listeners
	 */
	listeners(provider);
};
