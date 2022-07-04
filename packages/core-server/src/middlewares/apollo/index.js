const app = require('../../app');
const authentication = require('./authentication');
const server = require('../../server');
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core');

const apollo = {
	configure: async () => {
		const { typeDefs, resolvers } = await require('./graphql');
		const apolloServer = new ApolloServer({
			typeDefs,
			resolvers,
			context: async ({ req }) => ({
				user: await authentication.getUserContext(req),
			}),
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
