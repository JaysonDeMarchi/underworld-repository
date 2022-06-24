require("dotenv").config();
const userManager = require("./userManager");
const logger = require('../logger');

const factions = ["undead","creatures","monsters"];

module.exports = (dbo, message) => {
	const member = message.mentions.members.first();
	const role = message.mentions.roles.first();
	const discordServerID = message.guild.id;

	// check if there is a member or role in the message
	if (!member && !role) {
		return message.channel.send(`There were not any mentions in that command ${message.author}`);
	}

	// If it's a member, make sure they have a proper faction
	if ( member && !member.roles.cache.some(role => factions.includes(role.name.toLowerCase())) ) {
		return message.channel.send(`${message.author}, that user is not in one of your factions.`);
	}

	// If it's a role, make sure it is one of the factions
	if ( role && !factions.includes(role.name.toLowerCase()) ) {
		return message.channel.send(`That role is not one of your factions ${message.author}`);
	}

	// Check if points are being given or taken
	if ( !message.content.includes("from") && !message.content.includes("to") ) {
		return message.channel.send(`You failed to mention if I am awarding points or tearing them away ${message.author}`);
	}

	// Check number of points to give/take
	var pointVal = parseInt(message.cleanContent.match(/\d+/).shift(), 10);
	if ( isNaN(pointVal) ) {
		return message.channel.send(`I failed to find a proper point value ${message.author}`);
	}

	try{
		var msg = ``;
		targetFaction = "";
		if (member) {
			// Remove keys from collection so only role names left
			roleCollection = member.roles.cache.map(function (obj) {return obj.name.toLowerCase();});
			// Grab the role name that corresponds to a faction
			roleVal = roleCollection.filter(function (role) { return factions.includes(role); });
			targetFaction = roleVal[0];
		}
		else{
			targetFaction = role.name.toLowerCase();
		}
		displayFactionName = targetFaction.charAt(0).toUpperCase() + targetFaction.slice(1);

		// start the reply message
		pointDirection = message.content.match(/(to|from)/)[0];
		if ( pointDirection == "from" ) {
			msg = `${message.author} deducted ${pointVal} points from`;
		}
		else if ( pointDirection == "to" ) {
			msg = `${message.author} awarded ${pointVal} points to`;
		}

		var updateVal;
		// set update values based on points being given/taken
		if (pointDirection == "from") {
			updateVal = {"$inc":{"total":pointVal*-1,"negative":pointVal}};
		}
		else if (pointDirection == "to") {
			updateVal = {"$inc":{"total":pointVal,"positive":pointVal}};
		}
		else{
			return message.channel.send(`Take points? Remove them? I do not understand, ${message.author}`);
		}

		// if member mentioned, update points and add to output msg
		if (member) {
			// update member's individual points
			query = {"discordServer": discordServerID,"discordID": member.id};

			var userUpdateVal;
			if (message.content.includes("from")) {
				userUpdateVal = {"$inc":{"total":pointVal*-1,"negative":pointVal},"$set":{"nickname":member.displayName}};
			}
			else{
				userUpdateVal = {"$inc":{"total":pointVal,"positive":pointVal},"$set":{"nickname":member.displayName}};
			}
			dbo.collection("users").findOneAndUpdate(query, userUpdateVal, { "returnOriginal": false }, function (err, documents) {
				if (err) throw err;

				// disocrd user does not exist yet, insert to user collection
				if (documents["lastErrorObject"]["n"] == 0) {
					// points taken or awarded bool
					rmvPts = message.content.includes("from");

					// add user
					userManager.addUser(dbo, discordServerID,member.id,member.displayName,targetFaction,(rmvPts?pointVal*-1:pointVal),(rmvPts?0:pointVal),(rmvPts?pointVal:0));

					// append user info to msg
					msg = `${msg} ${member.user} Total:${(rmvPts?pointVal*-1:pointVal)} [${"+"+(rmvPts?0:pointVal)}|${"-"+(rmvPts?pointVal:0)}]`;

					// update members's faction
					var query = {"faction": targetFaction, "discordServer": discordServerID, "sprintEnd":{"$exists":false}};
					return dbo.collection("sprints").findOneAndUpdate(query, updateVal, { "returnOriginal": false }, function (err, factionDocs) {
						if (err)
							throw err;
						// final concat to the reply msg
						msg = `${msg} ${displayFactionName} Total:${factionDocs["value"]["total"]} [${"+"+factionDocs["value"]["positive"]}|${"-"+factionDocs["value"]["negative"]}]`;

						// send response msg
						return message.channel.send(msg);
					});
				}
				// user exists and was updated, make point readout/handle faction update
				else{
					msg = `${msg} ${member.user} Total:${documents["value"]["total"]} [${"+"+documents["value"]["positive"]}|${"-"+documents["value"]["negative"]}]`;

					// update the member's faction for this sprint
					var query = {"faction": targetFaction, "discordServer": discordServerID, "sprintEnd":{"$exists":false}};
					return dbo.collection("sprints").findOneAndUpdate(query, updateVal, { "returnOriginal": false }, function (err, documents) {
						if (err)
							throw err;
						// final concat to the reply msg
						msg = `${msg} ${displayFactionName} Total:${documents["value"]["total"]} [${"+"+documents["value"]["positive"]}|${"-"+documents["value"]["negative"]}]`;

						// send response msg
						return message.channel.send(msg);
					});
				}
			});
		}
		else{
			// Update the faction points
			var query = {"faction": targetFaction, "discordServer": discordServerID, "sprintEnd":{"$exists":false}};

			// update the factions for this sprint
			return dbo.collection("sprints").findOneAndUpdate(query, updateVal, { "returnOriginal": false }, function (err, documents) {
				if (err)
					throw err;

				msg = `${msg} ${displayFactionName} Total:${documents["value"]["total"]} [${"+"+documents["value"]["positive"]}|${"-"+documents["value"]["negative"]}]`;

				return message.channel.send(msg);
			});
		}
	}
	catch (ex) {
		logger.error(ex);
	}
};
