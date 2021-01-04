import mongoose from 'mongoose';

const ClientUsersSchema = new mongoose.Schema({
	client_id: {
		type: String,
		unique: true,
		required: true,
	},
	users: {
		default: [],
		required: true,
		type: [mongoose.SchemaTypes.ObjectId],
	},
});

/**
 * Static functions
 */
ClientUsersSchema.statics = {
	/**
	 * Finds all clients that a user has access to
	 * @param {mongoose.Types.ObjectId} userId
	 */
	getAuthorized: async (userId) => {
		let clients = [];
		try {
			const find = await ClientUsersModel.find({ users: userId });
			if (find && find.length > 0) {
				const promises = find.map((item) => {
					return mongoose.connection.db.collection('client').findOne(
						{ 'payload.client_id': item.client_id },
						{
							projection: {
								_id: 0,
								'payload.client_secret': 0,
								'payload.client_id_issued_at': 0,
								'payload.client_secret_expires_at': 0,
							},
						}
					);
				});
				clients = await Promise.all(promises);
			}
		} catch (e) {
			throw new Error(e);
		}

		return clients;
	},
	/**
	 * Retrieves access token for a client
	 * @param {String} clientId
	 * @param {mongoose.Types.ObjectId} userId
	 */
	getAccessToken: async (clientId, userId) => {
		try {
			// 1. Make sure that the user has access to Client
			const foundClient = !!(await ClientUsersModel.findOne({
				client_id: clientId,
				users: { $elemMatch: { $in: [userId] } },
			}));
			if (foundClient) {
				// 2. Find registration access token to pass over
				const client = await mongoose.connection.db
					.collection('registration_access_token')
					.findOne({ 'payload.clientId': clientId });
				if (client) {
					// 3. Return token
					return client.payload.jti;
				}
			}
		} catch (e) {}
		return null;
	},
};

const ClientUsersModel = mongoose.model('client_user', ClientUsersSchema);

export default ClientUsersModel;
