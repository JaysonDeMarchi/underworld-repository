require("dotenv").config();
const { Client, Intents } = require("discord.js");
const fs = require("fs");
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
	],
});

require("dotenv").config();
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(process.env.CONN_STRING, function (err, db) {
	if (err) throw err;
	var dbo = db.db("master");

	fs.readdir(__dirname + "/events/", (err, files) => {
		files.forEach((file) => {
			const eventHandler = require(__dirname + `/events/${file}`);
			const eventName = file.split(".")[0];
			client.on(eventName, (...args) => eventHandler(client, dbo, ...args));
		});
	});

	client.login(process.env.BOT_TOKEN);
});
