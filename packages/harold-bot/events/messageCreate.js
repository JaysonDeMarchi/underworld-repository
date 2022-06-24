const points = require("../commands/points");
const overview = require("../commands/overview");
const leaderboard = require("../commands/leaderboard");
const mostwanted = require("../commands/mostwanted");
const restart = require("../commands/restart");
const pointscheck = require("../commands/pointscheck");
const mcmanager = require("../commands/mcmanager");
const logger = require("../logger");

module.exports = (client, dbo, message) => {
	try {
		if(message.content.toLowerCase().split(" ")[0] === "!restart") {
			if(message.member.roles.cache.find(role => ["General","Colonel"].includes(role.name))) {
				return restart(dbo, message);
			}
		}
		else if(message.content.toLowerCase().split(" ")[0] === "!points") {
			if(message.member.roles.cache.find(role => ["General","Colonel","Captain","Twitch Mod"].includes(role.name))) {
				return points(dbo, message);
			}
		}
		else if(message.content.toLowerCase().split(" ")[0] === "!overview") {
			if(message.member.roles.cache.find(role => ["General","Colonel","Captain","Twitch Mod"].includes(role.name) || message.channel.id == "891763282698981436")) {
				return overview(dbo, message);
			}
		}
		else if(message.content.toLowerCase().split(" ")[0] === "!leaderboard") {
			if(message.member.roles.cache.find(role => ["General","Colonel","Captain","Twitch Mod"].includes(role.name) || message.channel.id == "891763282698981436")) {
				return leaderboard(dbo, message);
			}
		}
		else if(message.content.toLowerCase().startsWith("!mostwanted")) {
			if(message.member.roles.cache.find(role => ["General","Colonel","Captain","Twitch Mod"].includes(role.name))) {
				return mostwanted(dbo, message);
			}
		}
		else if(message.content.toLowerCase().startsWith("!pointscheck")) {
			return pointscheck(dbo, message);
		}
		else if(message.content.toLowerCase().startsWith("!mcwhitelist")) {
			if(message.member.roles.cache.find(role => ["Twitch Subscriber","Twitch Subscriber: Tier 1","Twitch Subscriber: Tier 2","Twitch Subscriber: Tier 3","Knight"].includes(role.name))) {
				return mcmanager.updateMCWhitelist(dbo, message);
			}
		}
	} catch (error) {
		logger.error(error);
		return message.channel.send('CEASE');
	}
};
