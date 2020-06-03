const {
	interactionPolicy: { Check, Prompt },
} = require('oidc-provider');

module.exports = (interactions) => {
	// create a requestable prompt with no implicit checks
	const selectAccount = new Prompt({
		name: 'select_account',
		requestable: true,
	});

	selectAccount.checks.add(
		new Check('select_account_prompt', 'Select Account prompt was not resolved', '', (ctx) => {
			const { oidc } = ctx;

			if (oidc.prompts.has('select_account') && oidc.promptPending('select_account')) {
				return true;
			}

			return false;
		})
	);

	// add to index 0, order goes sign_up > login > select_account > consent
	interactions.add(selectAccount, 1);
};
