const { userRepository } = require('@underworld/storage');

const resolvers = {
	Query: {
		getUser: async (_, __, context) => {
			if (!context.user.isLoggedIn) {
				return {};
			}
			return await userRepository.get({
				discordId: context.user.discord?.discordId,
				twitchId: context.user.twitch?.twitchId,
			});
		},
	},

	Mutation: {
		createUser: async (_, { user }, context) => {
			if (!context.user.isLoggedIn) {
				return {};
			}
			user = {
				...user,
				...context.user.discord,
				...context.user.twitch,
			};

			await userRepository.save(user);
			return await userRepository.get(user);
		},

		deleteUser: async (_, user, context) => {
			if (!context.user.isLoggedIn) {
				return false;
			}
			user = {
				...user,
				...context.user.discord,
				...context.user.twitch,
			};

			return await userRepository.delete(user);
		},

		updateUser: async (_, { user }, context) => {
			if (!context.user.isLoggedIn) {
				return {};
			}
			user = {
				...user,
				...context.user.discord,
				...context.user.twitch,
			};

			const existingUser = await userRepository.get(user);
			if (!existingUser) {
				return {};
			}

			await userRepository.save(user);
			return await userRepository.get(user);
		},
	},
};

module.exports = resolvers;
