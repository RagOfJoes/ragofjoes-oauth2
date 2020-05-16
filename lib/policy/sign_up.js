const {
	interactionPolicy: { Prompt, Check }
} = require('oidc-provider');

module.exports = interactions => {
	const signUp = new Prompt({
		name: 'sign_up',
		requestable: true
	});

	signUp.checks.remove('sign_up_prompt');
	signUp.checks.add(
		new Check('sign_up_prompt', 'Sign up prompt was not resolved', '', ctx => {
			const { oidc } = ctx;
			// If Sign Up is already in-progress or was requested for by a client
			if (oidc.prompts.has('sign_up') && oidc.promptPending('sign_up')) {
				return true;
			}

			return false;
		})
	);

	// add to index 0, order goes to  sign_up > login > select_account > consent
	interactions.add(signUp, 0);
};
