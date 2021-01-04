import mongoose from 'mongoose';
import { Provider } from 'oidc-provider';
import ClientUsersModel from 'db/models/client-users';

/**
 * Listeners for client registration
 * @param {Provider} provider
 */
const registrationListener = async (provider) => {
	provider.on('registration_create.success', async (ctx, client) => {
		const session = await provider.Session.get(ctx);
		if (session.account) {
			try {
				const newClientUsers = new ClientUsersModel({
					client_id: client.clientId,
					users: [mongoose.Types.ObjectId(session.account)],
				});
				await newClientUsers.save();
			} catch (e) {}
		}
	});
	provider.on('registration_delete.success', async (ctx, client) => {
		try {
			await ClientUsersModel.findOneAndDelete({ client_id: client.clientId });
		} catch (e) {}
	});
};

export default registrationListener;
