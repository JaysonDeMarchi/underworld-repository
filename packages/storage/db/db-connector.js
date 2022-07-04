const MongoClient = require('mongodb').MongoClient;

let db = null;

const dbConnector = {
	connect: async () => {
		if (db) {
			return db;
		}
		const client = await MongoClient.connect(
			process.env.CONN_STRING,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
		db = client.db('master');
		return db;
	},
};

module.exports = dbConnector;
