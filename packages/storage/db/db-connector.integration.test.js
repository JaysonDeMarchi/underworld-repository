const dbConnector = require('./db-connector');

test('Establish a successful database connection', async () => {
		const db = await dbConnector.connect();
		const ok = (await db.stats()).ok;
		expect(ok).toBe(1);
});
