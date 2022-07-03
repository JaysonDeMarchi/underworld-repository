// load environment variables
require("dotenv").config();

const express = require("express");
const fs = require("fs");
const EventSub = require('./helpers/eventSub');
const mongoHandler = require('./helpers/mongoHandler');

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

	// express setup
	const app = express();
	const server = require('http').createServer(app);

	// Welcome Screen
	app.get("/", (req, res) => {
		res.send("perish.");
	});

	fs.readdir(`${__dirname}/middlewares/`, (_, middlewares) => {
		middlewares.forEach((middlewareName) => {
			const middleware = require(`${__dirname}/middlewares/${middlewareName}`);
			app.use(
				middleware.path || '/',
				middleware.resolve
			);
		});
	});

	fs.readdir(`${__dirname}/routes/`, (_, routes) => {
		routes.forEach((routeName) => {
			const route = require(`${__dirname}/routes/${routeName}`);
			app[route.request](
				route.path,
				route.resolve
			);
		});
	});

	fs.readdir(`${__dirname}/websockets/`, (_, websockets) => {
		websockets.forEach((websocketName) => {
			const websocket = require(`${__dirname}/websockets/${websocketName}`);
			websocket.configure(server);
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
