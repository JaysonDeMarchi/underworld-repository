const userRepository = require('./user');

const testUser = {
	discordId: '69',
	discordServer: '988262220238577704',
};
const noMatchQuery = {
	discordId: '00',
	discordServer: '000000000000000000',
};

/*
 * Not a great practice to rely on the tested script for our setup
 * and teardown, but as we transision from discordID -> discordId
 * this will result in cleaner setup/teardown.
 */
beforeEach(async () => {
	await userRepository.save(testUser);
});

afterEach(async () => {
	await Promise.all([
		testUser,
		noMatchQuery,
	].map(
		(user) => userRepository.delete(user)
	));
});

test('Delete a user', async () => {
	const results = await userRepository.delete(testUser);
	expect(results).toBe(true);
});

test('Fail to delete a user', async () => {
	expect(await userRepository.delete(noMatchQuery)).toBe(false);
});

test('Find a user', async () => {
	const existingUser = await userRepository.get(testUser);
	expect(existingUser.discordId).toBe(testUser.discordId);
});

test('Fail to find a user', async () => {
	const existingUser = await userRepository.get(noMatchQuery);
	expect(existingUser).toBe(null);
});

test('Create a new user', async () => {
	const results = await userRepository.save(noMatchQuery);
	const existingUser = await userRepository.get(noMatchQuery);
	expect(results).toBe(true);
	expect(existingUser.discordId).toBe(existingUser.discordId);
});

test('Update an existing user', async () => {
	const updatedUser = {
		...testUser,
		twitchId: 11,
	};
	const results = await userRepository.save(updatedUser);
	const existingUser = await userRepository.get(updatedUser);
	expect(results).toBe(true);
	expect(existingUser.discordId).toBe(updatedUser.discordId);
	expect(existingUser.discordServer).toBe(updatedUser.discordServer);
});
