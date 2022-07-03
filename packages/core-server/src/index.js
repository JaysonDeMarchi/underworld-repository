// load environment variables
require("dotenv").config();

const EventSub = require('./helpers/eventSub');
const app = require('./app');
const fs = require('fs');
const mongoHandler = require('./helpers/mongoHandler');
const server = require('./server');

// redirect console output to log files
let logConsoleStream = fs.createWriteStream(__dirname + '/logs/console.log', { flags: 'a' });
let logErrorStream = fs.createWriteStream(__dirname + '/logs/error.log', { flags: 'a' });
process.stdout.write = logConsoleStream.write.bind(logConsoleStream);
process.stderr.write = logErrorStream.write.bind(logErrorStream);
process.on('uncaughtException', function (ex) {
	console.error(ex);
});

// variables needed for twitch calls
const port = process.env.PORT || 6336;

// initial db connection
mongoHandler.connectToServer((err) => {
	if (err) console.log(err);

	// Welcome Screen
	app.get("/", (req, res) => {
		res.send("perish.");
	});

	const resourceTypes = [
		'middlewares',
		'routes',
		'websockets',
	];

	resourceTypes.map((resourceType) => {
		fs.readdir(`${__dirname}/${resourceType}/`, (_, resources) => {
			resources.forEach((resourceName) => {
				const resource = require(`${__dirname}/${resourceType}/${resourceName}`);
				resource.configure();
			});
		});
	});

	// START EVENTSUB SUBSCRIPTION FOR CHANNEL REDEEMS
	if (process.env.LISTEN_EVENTS == "true") {
		EventSub.getEventSubSubscriptions();
	}

	server.listen(port, () => {
		console.log(`Your app is listening on port ${port}`);
	});
});
