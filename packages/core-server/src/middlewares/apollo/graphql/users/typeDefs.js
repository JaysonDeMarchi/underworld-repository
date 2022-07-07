const { gql } = require('apollo-server-express');

const typeDefs = gql`
input UserInput {
	discordId: String
	nickname: String
	faction: String
	negative: Int
	positive: Int
	total: Int
	twitchId: String
	twitchUsername: String
}

type User {
	discordServer: String
	discordId: String
	nickname: String
	faction: String
	negative: Int
	positive: Int
	total: Int
	twitchId: String
	twitchUsername: String
}

type Query {
	getUser: User
}

type Mutation {
	createUser(
		user: UserInput
	): User

	deleteUser(
		discordId: String
		twitchId: String
	): Boolean

	updateUser(
		user: UserInput
	): User
}
`;

module.exports = typeDefs;
