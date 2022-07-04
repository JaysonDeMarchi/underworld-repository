const dbAdaptor = require('./db/db-adaptor');
const dbConnector = require('./db/db-connector');
const userRepository = require('./repositories/users');

const storage = {
	dbAdaptor,
	dbConnector,
	userRepository,
};

module.exports = storage;
