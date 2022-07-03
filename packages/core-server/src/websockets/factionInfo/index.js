const mongoHandler = require('../../helpers/mongoHandler');

// client list to maintain
const clients = {};

// load the table that holds points
const db = mongoHandler.getDb();
const collection = db.collection('sprints');

const factionInfo = {
	configure: (server) => {
		const io = require('socket.io')(server, {
			path: '/socket',
			rejectUnauthorized: 'false',
		});

		io.on('connection', (socket) => {
			const id = socket.id;
			const ip = socket.request.connection.remoteAddress;
			clients[id] = {
				socket,
				ip,
			};

			clients[id].socket.emit('connection', null);

			clients[id].socket.on('disconnect', () => {
				delete clients[id];
			});

			clients[id].socket.on('connect_error', () => {
				console.log(`Connection error detected from socket ${id} at IP: ${ip}`);
			});

			const query = {
				discordServer: process.env.DISCORD_SERVER_ID,
				sprintEnd: { $exists: false },
			};

			collection.find(query).toArray(function (err, result) {
				if (err) throw err;

				for (const faction of result) {
					clients[id].socket.emit('update', {
						faction: faction.faction,
						total: faction.total,
					});
				}
			});
		});

		const pipeline = [{
			$match: {
				'fullDocument.discordServer': process.env.DISCORD_SERVER_ID,
			},
		}];

		const changeStream = collection.watch(pipeline, { fullDocument: 'updateLookup'});
		changeStream.on('change', (next) => {
			io.emit('update', {
				faction: next.fullDocument.faction,
				total: next.fullDocument.total
			});
		});
	},
};

module.exports = factionInfo;
