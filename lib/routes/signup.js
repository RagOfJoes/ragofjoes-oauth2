const { strict: assert } = require('assert');
const UserModel = require('../../db/models/User');

module.exports = async (provider, req, res, next) => {
	try {
		const interaction = await provider.interactionDetails(req, res);
		const { prompt } = interaction;
		assert.equal(prompt.name, 'sign_up');

		let result = { sign_up: {} };
		if (req.body.cancel_signup) {
			interaction.params.prompt = 'login';
			await interaction.save();
		} else {
			try {
				// Save new User on to DB
				const newUser = new UserModel({ ...req.body });
				await newUser.save();

				// Create login_hint before redirecting to login screen
				interaction.params.login_hint = newUser.email;
				await interaction.save();
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
