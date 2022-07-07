const dbAdaptor = require('./db-adaptor');
const dbConnector = require('./db-connector');

const collectionName = 'test_adaptor';
const discordServer = '000000000000000000';

const validUser = {
	discordID: '69',
	discordServer,
};
const invalidUser = {
	discordID: '00',
	discordServer,
};

beforeEach(async () => {
	const db = await dbConnector.connect();
	const collection = await db.collection(collectionName);

	await collection.updateOne(
		validUser,
		{
			$set: validUser,
		},
		{ upsert: true }
	);
});

afterEach(async () => {
	const db = await dbConnector.connect();
	const collection = await db.collection(collectionName);
	await collection.deleteMany({ discordServer });
});

test('Delete an entry', async () => {
	const newUser = {
		discordID: '01',
		discordServer,
	};
	await dbAdaptor.updateOne(collectionName, newUser, newUser);
	expect(await dbAdaptor.deleteOne(collectionName, newUser)).toBe(true);
});

test('Fail to delete an entry', async () => {
	expect(await dbAdaptor.deleteOne(collectionName, invalidUser)).toBe(false);
});

test('Find an entry', async () => {
	const existingUser = await dbAdaptor.findOne(collectionName, validUser);
	expect(existingUser.discordID).toBe(validUser.discordID);
});

test('Fail to find an entry', async () => {
	const existingUser = await dbAdaptor.findOne(collectionName, invalidUser);
	expect(existingUser).toBe(null);
});

test('Create a new entry', async () => {
	const newUser = {
		discordID: '02',
		discordServer,
	};
	const results = await dbAdaptor.updateOne(collectionName, newUser, newUser);
	expect(results.modifiedCount).toBe(0);
	expect(results.upsertedCount).toBe(1);
});

test('Update an existing entry', async () => {
	const update = { twitchId: 11 };
	const newUser = {
		discordID: '03',
		discordServer,
	};
	await dbAdaptor.updateOne(collectionName, newUser, newUser);
	const results = await dbAdaptor.updateOne(collectionName, newUser, update);
	expect(results.modifiedCount).toBe(1);
	expect(results.upsertedCount).toBe(0);
});

test('Fail to update an entry', async () => {
	const results = await dbAdaptor.updateOne(
		collectionName,
		invalidUser,
		invalidUser,
		{ upsert: false }
	);
	expect(results.modifiedCount).toBe(0);
	expect(results.upsertedCount).toBe(0);
});
