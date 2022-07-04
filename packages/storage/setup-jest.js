const dbConnector = require('./db/db-connector');

afterAll(async () => {
	await dbConnector.disconnect();
});
