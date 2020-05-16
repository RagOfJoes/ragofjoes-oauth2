const {
	interactionPolicy: { base: policy }
} = require('oidc-provider');

const login = require('./login');
const signUp = require('./sign_up');
const selectAccount = require('./select_account');

// Copies the default policy, already has login and consent prompt policies
const interactions = policy();

// Custom Interactions
login(interactions);
signUp(interactions);
selectAccount(interactions);

module.exports = interactions;
