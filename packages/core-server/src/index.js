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

	const resources = [
		{
			params: app,
			group: 'middlewares',
		},
		{
			params: app,
			group: 'routes',
		},
		{
			params: server,
			group: 'websockets',
		},
	];

	resources.map((resource) => {
		const group = resource.group;
		const params = resource.params;

		fs.readdir(`${__dirname}/${group}/`, (_, entities) => {
			entities.forEach((entityName) => {
				const entity = require(`${__dirname}/${group}/${entityName}`);
				entity.configure(params);
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
