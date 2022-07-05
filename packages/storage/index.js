const dbAdaptor = require('./db/db-adaptor');
const dbConnector = require('./db/db-connector');
const userRepository = require('./repositories/user');

const storage = {
	dbAdaptor,
	dbConnector,
	userRepository,
};

module.exports = storage;
