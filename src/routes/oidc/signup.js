import { strict } from 'assert';
import UserModel from 'db/models/User';

export default async (provider, req, res, next) => {
	try {
		const interaction = await provider.interactionDetails(req, res);
		const { prompt } = interaction;
		strict.equal(prompt.name, 'sign_up');

		let result = { sign_up: {} };
		if (req.body.cancel_signup) {
			interaction.params.prompt = 'login';
			await interaction.save();
		} else {
			try {
				if (!req.body.given_name) {
					result = {
						flash: 'You must provide your First Name!',
					};
				} else if (!req.body.family_name) {
					result = {
						flash: 'You must provide your Last Name!',
					};
				} else if (!req.body.email) {
					result = {
						flash: 'You must provide an Email!',
					};
				} else if (!req.body.password) {
					result = {
						flash: 'You must provide a Password!',
					};
				} else {
					// Save new User on to DB
					const newUser = new UserModel({ ...req.body });
					await newUser.save();

					// Create login_hint before redirecting to login screen
					interaction.params.login_hint = newUser.email;
					await interaction.save();
				}
			} catch (e) {
				// If There was an error then inform user
				result = { flash: 'Email is unavailable!' };
			}
		}

		await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
	} catch (err) {
		next(err);
	}
};
