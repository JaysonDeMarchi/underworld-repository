require("dotenv").config();
const userManager = require("./userManager");
const logger = require('../logger');

const factions = ["undead","creatures","monsters"];

module.exports = (dbo, message) => {
	const discordServerID = message.guild.id;

	try{
		if(!message.member.roles.cache.some(role => factions.includes(role.name.toLowerCase()))) {
			return message.channel.send(`${message.member}, you aren't even in the faction war. (-_- )`);
		}

		// get faction role of user
		let targetFaction = "";
		// Remove keys from collection so only role names left
		const roleCollection = message.member.roles.cache.map(function (obj) {return obj.name.toLowerCase();});
		// Grab the role name that corresponds to a faction
		const roleVal = roleCollection.filter(function (role) { return factions.includes(role); });
		targetFaction = roleVal[0];

		// query for top 10 user totals
		const query = {"discordServer": discordServerID, "discordID": message.member.id};
		const update = {"$set":{"nickname":message.member.displayName}};
		dbo.collection("users").findOneAndUpdate(query, update, { "returnOriginal": false }, function (err, documents) {
			if (err)
				throw err;

			if (documents["lastErrorObject"]["n"] == 0) {
				// no document updated, so we need to add user to db
				const userObj = {"discordServer": discordServerID,"discordID":message.member.id,"nickname":message.member.displayName,"faction":targetFaction,"total":0,"positive":0,"negative":0};

				userManager.addUserObj(dbo, userObj);
			}
			else{
				// a document was updated, so we can print message and be done
				const msg = `\`${message.member.displayName} Total:${documents["value"]["total"]} [${"+"+documents["value"]["positive"]}|${"-"+documents["value"]["negative"]}]\``;
				return message.channel.send(msg);
			}
		});
	}
	catch(ex) {
		logger.error(ex);
	}
};
