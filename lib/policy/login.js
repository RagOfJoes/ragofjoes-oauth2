const {
	interactionPolicy: { Check }
} = require('oidc-provider');
const UserModel = require('../../db/models/User');

// Update base login policy to allow for sign_up process
module.exports = interactions => {
	interactions.get('login').checks.add(
		new Check(
			'account_invalid',
			'End-User authentication is required',
			'login_required',
			async ctx => {
				const { oidc } = ctx;
				try {
					if (!oidc.session.accountId()) return true;
					const user = await UserModel.findAccount(ctx, oidc.session.accountId());

					if (!user) return true;
				} catch (e) {
					return true;
				}

				return false;
			},
			() => {}
		)
	);
};
