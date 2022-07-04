const fs = require('fs/promises');

/*
 * We're stitching the subgraph's resolvers and typeDefs together
 * by targeting their respective js scripts.
 * e.g.
 *   Say we have a subgraph 'users'.
 *   This will pick up:
 *     - resolvers at users/resolvers.js
 *     - typeDefs at users/typeDefs.js
 */
const getComponent = async (component) => {
	const files = await fs.readdir(__dirname, { withFileTypes: true });

	return files.filter(
		(subgraph) => subgraph.isDirectory()
	).map(
		(subgraph) => require(`${__dirname}/${subgraph.name}/${component}`),
	);
};

const getSchema = async () => {
	return await Promise.all([
		getComponent('typeDefs'),
		getComponent('resolvers'),
	]).then((results) => ({
		typeDefs: results[0],
		resolvers: results[1],
	}));
};

module.exports = getSchema();
