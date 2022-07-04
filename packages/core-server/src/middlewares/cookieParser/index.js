const cookieParserMiddleware = require('cookie-parser');
const app = require('../../app');

const cookieParser = {
	configure: async () => {
		app.use(cookieParserMiddleware());
	},
};

module.exports = cookieParser;
