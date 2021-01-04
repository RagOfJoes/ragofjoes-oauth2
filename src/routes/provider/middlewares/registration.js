import mongoose from 'mongoose';
import { Provider } from 'oidc-provider';
import UserModel from 'db/models/user';
import ClientUsersModel from 'db/models/client-users';

/**
 *
 * @param {Provider} provider
 * @param {*} ctx
 * @param {*} next
 */
const registration = async (provider, ctx, next) => {
	/**
	 * Pre-processing Middleware
	 */
	const { req, res } = ctx;
	const session = await provider.Session.get(ctx);
	if (session.account) {
		let user = null;
		const userId = mongoose.Types.ObjectId(session.account);
		try {
			user = await UserModel.findById(
				userId,
				'email name given_name family_name is_admin -_id'
			);
		} catch (e) {}
		if (!user?.is_admin) {
			res.status(401).send({
				ok: false,
				error: {
					name: 'Unauthorized',
					message: "You don't have the permission to perform this action.",
				},
			});
			return;
		}
		if (req.method?.toLowerCase() === 'put' || req.method?.toLowerCase() === 'delete') {
			const split = req.url.split('/');
			const clientId = split[split.length - 1];

			let accessToken = null;
			try {
				accessToken = await ClientUsersModel.getAccessToken(clientId, userId);
			} catch (e) {}
			if (!accessToken) {
				res.status(401).send({
					ok: false,
					error: {
						name: 'Unauthorized',
						message: "You don't have the permission to perform this action.",
					},
				});
				return;
			} else {
				req.headers.authorization = `Bearer ${accessToken}`;
			}
		}
		return await next();
	}
	res.status(401).send({
		ok: false,
		error: {
			name: 'Unauthorized',
			message: "You don't have the permission to perform this action.",
		},
	});
	return;
};

export default registration;
