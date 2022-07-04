const app = require('../../app');
const server = require('../../server');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');

const apollo = {
	configure: async () => {
		const { typeDefs, resolvers } = await require('./graphql');
		const apolloServer = new ApolloServer({
			typeDefs,
			resolvers,
			csrfPrevention: true,
			plugins: [
				ApolloServerPluginDrainHttpServer({ httpServer: server }),
			],
		});

		await apolloServer.start();
		apolloServer.applyMiddleware({ app });
	},
};

module.exports = apollo;
