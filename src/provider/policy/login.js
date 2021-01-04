import UserModel from 'db/models/user';
import { interactionPolicy } from 'oidc-provider';

// Update base login policy to allow for sign_up process
export default (interactions) => {
	interactions.get('login').checks.add(
		new interactionPolicy.Check(
			'account_invalid',
			'End-User authentication is required',
			'login_required',
			async (ctx) => {
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
