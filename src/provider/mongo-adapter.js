import mongodb from 'mongodb';
import snakeCase from 'lodash/snakeCase';

/**
 * Mongo Adapter for OIDC Provider
 * @param {mongodb.Db} DB
 */
export default (DB) => {
	const grantable = new Set([
		'access_token',
		'authorization_code',
		'refresh_token',
		'device_code',
	]);

	class CollectionSet extends Set {
		add(name) {
			const nu = this.has(name);
			super.add(name);
			if (!nu) {
				DB.collection(name).createIndexes([
					...(grantable.has(name)
						? [
								{
									key: { 'payload.grantId': 1 },
								},
						  ]
						: []),
					...(name === 'device_code'
						? [
								{
									key: { 'payload.userCode': 1 },
									unique: true,
								},
						  ]
						: []),
					...(name === 'session'
						? [
								{
									key: { 'payload.uid': 1 },
									unique: true,
								},
						  ]
						: []),
					{
						key: { expiresAt: 1 },
						expireAfterSeconds: 0,
					},
				]);
			}
		}
	}

	const collections = new CollectionSet();

	class MongoAdapter {
		constructor(name) {
			this.name = snakeCase(name);
			this.findOneOptions = {
				projection: { payload: 1 },
			};

			if (process.env.NODE_ENV === 'development') collections.add(snakeCase(name));
		}

		// NOTE: the payload for Session model may contain client_id as keys, make sure you do not use
		//   dots (".") in your client_id value charset.
		async upsert(_id, payload, expiresIn) {
			let expiresAt;

			if (expiresIn) {
				expiresAt = new Date(Date.now() + expiresIn * 1000);
			}

			await this.coll().updateOne(
				{ _id },
				{ $set: { payload, ...(expiresAt ? { expiresAt } : undefined) } },
				{ upsert: true }
			);
		}

		async find(_id) {
			const result = await this.coll().find({ _id }, this.findOneOptions).limit(1).next();

			if (!result) return undefined;
			return result.payload;
		}

		async findByUserCode(userCode) {
			const result = await this.coll()
				.find({ 'payload.userCode': userCode }, this.findOneOptions)
				.limit(1)
				.next();

			if (!result) return undefined;
			return result.payload;
		}

		async findByUid(uid) {
			const result = await this.coll()
				.find({ 'payload.uid': uid }, this.findOneOptions)
				.limit(1)
				.next();

			if (!result) return undefined;
			return result.payload;
		}

		async destroy(_id) {
			await this.coll().deleteOne({ _id });
		}

		async revokeByGrantId(grantId) {
			await this.coll().deleteMany({ 'payload.grantId': grantId });
		}

		async consume(_id) {
			await this.coll().findOneAndUpdate(
				{ _id },
				{ $set: { 'payload.consumed': Math.floor(Date.now() / 1000) } }
			);
		}

		coll(name) {
			return MongoAdapter.coll(name || this.name);
		}

		static coll(name) {
			return DB.collection(name);
		}
	}

	return MongoAdapter;
};
