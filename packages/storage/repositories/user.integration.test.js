const dbAdaptor = require('../db/db-adaptor');
const userRepository = require('./user');

const collectionName = 'users';
const discordServer = '000000000000000000';

const validUser = {
	discordId: '69',
	discordServer,
};

const invalidUser = {
	discordId: '00',
	discordServer,
};

/*
 * Not a great practice to rely on the tested script for our setup
 * and teardown, but as we transision from discordID -> discordId
 * this will result in cleaner setup/teardown.
 */
beforeEach(async () => {
	await userRepository.save(validUser);
});

afterEach(async () => {
	await dbAdaptor.deleteMany(collectionName, { discordServer });
});

test('Delete a user', async () => {
	const newUser = {
		discordId: '04',
		discordServer,
	};
	await userRepository.save(newUser);
	const results = await userRepository.delete(newUser);
	expect(results).toBe(true);
});

test('Fail to delete a user', async () => {
	expect(await userRepository.delete(invalidUser)).toBe(false);
});

test('Find a user', async () => {
	const existingUser = await userRepository.get(validUser);
	expect(existingUser.discordId).toBe(validUser.discordId);
});

test('Fail to find a user', async () => {
	const existingUser = await userRepository.get(invalidUser);
	expect(existingUser).toBe(null);
});

test('Create a new user', async () => {
	const newUser = {
		discordId: '05',
		discordServer,
	};
	const results = await userRepository.save(newUser);
	const existingUser = await userRepository.get(newUser);
	expect(results).toBe(true);
	expect(existingUser.discordId).toBe(newUser.discordId);
});

test('Update an existing user', async () => {
	const newUser = {
		discordId: '06',
		discordServer,
	};
	await userRepository.save(newUser);
	newUser.nickname = 'Automated Test User';
	const results = await userRepository.save(newUser);
	const existingUser = await userRepository.get(newUser);
	expect(results).toBe(true);
	expect(existingUser.discordId).toBe(newUser.discordId);
	expect(existingUser.discordServer).toBe(newUser.discordServer);
	expect(existingUser.nickname).toBe(newUser.nickname);
});
