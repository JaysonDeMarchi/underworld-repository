const dbAdaptor = require('../db/db-adaptor');

const collectionName = 'users';

const repository = {
	delete: async function (user) {
		const existingUser = await this.get(user);
		if (!existingUser) {
			return false;
		}
		const query = this.getUniqueUserQuery(user);
		const status = await dbAdaptor.deleteOne(collectionName, query);
		return status;
	},

	get: async function ({ discordId, twitchId }) {
		const query = this.getUniqueUserQuery({ discordId, twitchId });
		const user = await dbAdaptor.findOne(collectionName, query);
		if (user) {
			user.discordId = user.discordID || null;
			delete user.discordID;
		}
		return user;
	},

	getUniqueUserQuery: function ({ discordId, twitchId }) {
		return {
			$or: [
				{
					discordID: {
						$eq: discordId,
						$ne: undefined,
					},
				},
				{
					twitchId: {
						$eq: twitchId,
						$ne: undefined,
					},
				},
			],
		};
	},

	save: async function (user) {
		const userData = { ...user };
		userData.discordID = user.discordId;
		delete userData.discordId;
		const query = this.getUniqueUserQuery(user);

		const results = await dbAdaptor.updateOne(collectionName, query, userData);

		return Boolean(results.upsertedCount + results.modifiedCount);
	},
};

module.exports = repository;
