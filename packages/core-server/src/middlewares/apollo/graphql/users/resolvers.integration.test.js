const resolvers = require('./resolvers');
const { dbAdaptor, userRepository } = require('@underworld/storage');

const collectionName = 'users';
const discordServer = '000000000000000000';

const createNewUserInfo = () => {
	const discordId = Math.floor(Math.random() * 1000);
	return {
		newParams: {
			user: {
				discordId,
				discordServer,
			}
		},
		newContext: {
			user: {
				isLoggedIn: true,
				discord: {
					discordId,
				},
			},
		},
	};
};

const validUserInfo = createNewUserInfo();
const validParams = validUserInfo.newParams;
const validContext = validUserInfo.newContext;

const invalidContext = {
	user: {
		isLoggedIn: false,
	},
};

beforeEach(async () => {
	await userRepository.save(validParams.user);
});

afterEach(async () => {
	await dbAdaptor.deleteMany(collectionName, { discordServer });
});

describe('User Queries', () => {
	test('Get a valid user', async () => {
		const existingUser = await resolvers.Query.getUser({}, {}, validContext);
		expect(existingUser.discordId).toBe(validContext.user.discord.discordId);
	});

	test('Fail to get an invalid user', async () => {
		const existingUser = await resolvers.Query.getUser({}, {}, invalidContext);
		expect(existingUser).toMatchObject({});
	});
});

describe('User Mutations', () => {
	test('Create a valid user', async () => {
		const { newParams, newContext } = createNewUserInfo();
		const existingUser = await resolvers.Mutation.createUser({}, newParams, newContext);
		expect(existingUser.discordId).toBe(newParams.user.discordId);
	});

	test('Fail to create an invalid user', async () => {
		const existingUser = await resolvers.Mutation.createUser({}, validParams, invalidContext);
		expect(existingUser).toMatchObject({});
	});

	test('Delete a valid user', async () => {
		const { newParams, newContext } = createNewUserInfo();
		await resolvers.Mutation.createUser({}, newParams, newContext);
		const results = await resolvers.Mutation.deleteUser({}, newParams.user, newContext);
		expect(results).toBe(true);
	});

	test('Fail to delete an invalid user', async () => {
		const results = await resolvers.Mutation.deleteUser({}, validParams.user, invalidContext);
		expect(results).toBe(false);
	});

	test('Update a valid user', async () => {
		const { newParams, newContext } = createNewUserInfo();
		await resolvers.Mutation.createUser({}, newParams, newContext);
		newParams.user.nickname = 'Automated Test User';
		const existingUser = await resolvers.Mutation.updateUser({}, newParams, newContext);
		expect(existingUser.nickname).toBe(newParams.user.nickname);
	});

	test('Fail to update an invalid user', async () => {
		const existingUser = await resolvers.Mutation.updateUser({}, validParams, invalidContext);
		expect(existingUser).toMatchObject({});
	});

	test('Fail to update a missing user', async () => {
		const { newParams, newContext } = createNewUserInfo();
		const existingUser = await resolvers.Mutation.updateUser({}, newParams, newContext);
		expect(existingUser).toMatchObject({});
	});

	test('Fail to update a valid user with mismatched context', async () => {
		const { newParams, newContext } = createNewUserInfo();
		await resolvers.Mutation.createUser({}, newParams, newContext);
		newParams.discordId = validParams.discordId;
		const existingUser = await resolvers.Mutation.updateUser({}, newParams, newContext);
		expect(existingUser).toMatchObject({});
	});
});
