const MongoClient = require('mongodb').MongoClient;

let client = null;
let db = null;

const dbConnector = {
	connect: async () => {
		if (db) {
			return db;
		}
		client = await MongoClient.connect(
			process.env.CONN_STRING,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
		db = client.db('master');
		return db;
	},

	disconnect: async () => {
		if (!client) {
			return;
		}
		client.close();
		db = null;
	},
};

module.exports = dbConnector;
