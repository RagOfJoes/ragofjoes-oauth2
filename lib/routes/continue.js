const { strict: assert } = require('assert');

module.exports = async (provider, req, res, next) => {
	try {
		const interaction = await provider.interactionDetails(req, res);
		const {
			prompt: { name }
		} = interaction;
		assert.equal(name, 'select_account');

		if (req.body.switch) { // If User chooses to Switch Account
			if (interaction.params.prompt) {
                // If the Client requested Select Account Prompt
				const prompts = new Set(interaction.params.prompt.split(' '));
				prompts.add('login');
				interaction.params.prompt = [...prompts].join(' ');
			} else {
				interaction.params.prompt = 'logout';
			}
			await interaction.save();
		}

		const result = { select_account: {} };
		await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: false });
	} catch (err) {
		next(err);
	}
};
