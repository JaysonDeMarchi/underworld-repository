const dbAdaptor = require('./db-adaptor');
const dbConnector = require('./db-connector');

const collectionName = 'users';
const testUser = {
	discordID: '69',
	discordServer: '988262220238577704',
};
const noMatchQuery = {
	discordID: '00',
	discordServer: '000000000000000000',
};

beforeEach(async () => {
	const db = await dbConnector.connect();
	const collection = await db.collection(collectionName);

	await collection.updateOne(
		{
			discordServer: testUser.discordServer,
			discordID: testUser.discordID,
		},
		{
			$set: testUser,
		},
		{ upsert: true }
	);
});

afterEach(async () => {
	const db = await dbConnector.connect();
	const collection = await db.collection(collectionName);

	await Promise.all([
		collection.deleteOne(testUser),
		collection.deleteOne(noMatchQuery),
	]);
});

test('Delete an entry', async () => {
	expect(await dbAdaptor.deleteOne(collectionName, testUser)).toBe(true);
});

test('Fail to delete an entry', async () => {
	expect(await dbAdaptor.deleteOne(collectionName, noMatchQuery)).toBe(false);
});

test('Find an entry', async () => {
	const existingUser = await dbAdaptor.findOne(collectionName, testUser);
	expect(existingUser.discordID).toBe(testUser.discordID);
});

test('Fail to find an entry', async () => {
	const existingUser = await dbAdaptor.findOne(collectionName, noMatchQuery);
	expect(existingUser).toBe(null);
});

test('Create a new entry', async () => {
	const results = await dbAdaptor.updateOne(collectionName, noMatchQuery, noMatchQuery);
	expect(results.modifiedCount).toBe(0);
	expect(results.upsertedCount).toBe(1);
});

test('Update an existing entry', async () => {
	const update = { twitchId: 11 };
	const results = await dbAdaptor.updateOne(collectionName, testUser, update);
	expect(results.modifiedCount).toBe(1);
	expect(results.upsertedCount).toBe(0);
});

test('Fail to update an entry', async () => {
	const results = await dbAdaptor.updateOne(
		collectionName,
		noMatchQuery,
		noMatchQuery,
		{ upsert: false }
	);
	expect(results.modifiedCount).toBe(0);
	expect(results.upsertedCount).toBe(0);
});
