import { strict } from 'assert';
import UserModel from 'db/models/User';

export default async (provider, req, res, next) => {
	try {
		const interaction = await provider.interactionDetails(req, res);
		const { prompt } = interaction;
		strict.equal(prompt.name, 'login');

		let result;
		try {
			if (req.body.new_user) {
				// If User decides to create a new User
				interaction.params.prompt = 'sign_up';
				await interaction.save();
			} else {
				if (!req.body.login) {
					result = {
						flash: 'You must provide Username!',
					};
				} else if (!req.body.password) {
					result = {
						flash: 'You must provide Password!',
					};
				} else {
					const account = await UserModel.findByCredentials(req.body.login, req.body.password);

					// Skip previous interaction steps and fill in required login fields to skip Prompt checks
					result = {
						sign_up: {},
						login: {
							account: account.accountId,
							remember: req.body.remember_me,
						},
						select_account: {},
					};
				}
			}
		} catch (e) {
			result = { flash: 'Invalid Credentials!' };
		}
		await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
	} catch (err) {
		next(err);
	}
};
