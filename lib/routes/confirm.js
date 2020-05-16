const { strict: assert } = require('assert');

module.exports = async (provider, req, res, next) => {
	try {
		const {
			prompt: { name }
		} = await provider.interactionDetails(req, res);
		assert.equal(name, 'consent');
		const consent = {};

		// any scopes you do not wish to grant go in here
		//   otherwise details.scopes.new.concat(details.scopes.accepted) will be granted
		consent.rejectedScopes = [];

		// any claims you do not wish to grant go in here
		//   otherwise all claims mapped to granted scopes
		//   and details.claims.new.concat(details.claims.accepted) will be granted
		consent.rejectedClaims = [];

		// replace = false means previously rejected scopes and claims remain rejected
		// changing this to true will remove those rejections in favour of just what you rejected above
		consent.replace = false;

		const result = { consent };
		await provider.interactionFinished(req, res, result, { mergeWithLastSubmission: true });
	} catch (err) {
		next(err);
	}
};
