const dbConnector = require('./db-connector');

const dbAdaptor = {
	deleteOne: async (collectionName, query) => {
		let entryWasDeleted = false;
		try {
			const db = await dbConnector.connect();
			const collection = db.collection(collectionName);
			const results = await collection.deleteOne(query);
			entryWasDeleted = Boolean(results.deletedCount);
		} catch (err) {
			console.error(err);
		}
		return entryWasDeleted;
	},

	findOne: async (collectionName, query) => {
		let entry = null;
		try {
			const db = await dbConnector.connect();
			const collection = db.collection(collectionName);
			entry = await collection.findOne(query);
		} catch (err) {
			console.error(err);
		}
		return entry;
	},

	updateOne: async (collectionName, query, entry, options = { upsert: true }) => {
		try {
			const db = await dbConnector.connect();
			const collection = db.collection(collectionName);
			return await collection.updateOne(query, { $set: entry }, options);
		} catch (err) {
			console.error(err);
		}
	},
};

module.exports = dbAdaptor;
