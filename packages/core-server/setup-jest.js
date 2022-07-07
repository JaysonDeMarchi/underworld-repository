const { dbConnector } = require('@underworld/storage');

afterAll(async () => {
	await dbConnector.disconnect();
});
