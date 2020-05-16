const {
	interactionPolicy: { Prompt }
} = require('oidc-provider');

module.exports = interactions => {
	// create a requestable prompt with no implicit checks
	const selectAccount = new Prompt({
		name: 'select_account',
		requestable: true
	});

	// add to index 0, order goes sign_up > login > select_account > consent
	interactions.add(selectAccount, 1);
};
