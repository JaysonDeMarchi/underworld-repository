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

// initial db connection
mongoHandler.connectToServer((err) => {
	if (err) console.log(err);

	// express setup
	const app = express();
	require('http').createServer(app);

	// variables needed for twitch calls
	const port = process.env.PORT || 6336;

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

	// start listening for gets/posts
	const listener = app.listen(port, () => {
		console.log("Your app is listening on port " + listener.address().port);
	});

	// initialize faction overview socket
	const io = require('socket.io')(listener, {
		path: '/socket',
		rejectUnauthorized: 'false'
	});

	// START EVENTSUB SUBSCRIPTION FOR CHANNEL REDEEMS
	if (process.env.LISTEN_EVENTS == "true") {
		EventSub.getEventSubSubscriptions();
	}

	// ---------------------------- LIVE FACTION VIEW CODE ----------------------------

	// client list to maintain
	var clients = {};

	// load the table that holds points
	var db = mongoHandler.getDb();
	const collection = db.collection('sprints');

	// handle new socket connections
	io.on('connection', (socket) => {
		var id = socket.id;
		var ip = socket.request.connection.remoteAddress;
		clients[id] = { socket: socket, ip: ip };

		clients[id].socket.emit('connection', null);

		clients[id].socket.on('disconnect', () => {
			delete clients[id];
		});

		clients[id].socket.on('connect_error', () => {
			console.log(`Connection error detected from socket ${id} at IP: ${ip}`);
		});

		// initialize faction values for new sockets
		const query = { "discordServer": process.env.DISCORD_SERVER_ID, "sprintEnd": { "$exists": false } };
		collection.find(query).toArray(function (err, result) {
			if (err)
				throw err;

			for (const faction of result) {
				clients[id].socket.emit('update', { faction: faction["faction"], total: faction["total"] });
			}
		});
	});

	// create change stream to emit point updates to all sockets
	const pipeLine = [{ $match: { 'fullDocument.discordServer': process.env.DISCORD_SERVER_ID } }];
	const changeStream = collection.watch(pipeLine, { fullDocument: 'updateLookup' });
	changeStream.on('change', next => {
		io.emit('update', { faction: next.fullDocument.faction, total: next.fullDocument.total });
	});
});
