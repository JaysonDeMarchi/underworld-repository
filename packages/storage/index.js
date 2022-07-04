const dbAdaptor = require('./db/db-adaptor');
const dbConnector = require('./db/db-connector');

const storage = {
	dbAdaptor,
	dbConnector,
 };

module.exports = storage;
