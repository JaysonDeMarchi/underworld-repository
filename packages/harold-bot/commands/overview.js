require("dotenv").config();
const logger = require('../logger');

module.exports = (dbo, message) => {
	const discordServerID = message.guild.id;

	try{
		// query for faction totals
		const query = {"sprintEnd":{"$exists":false}, "discordServer": discordServerID};
		const sortReq = {"total":-1};
		return dbo.collection("sprints").find(query).sort(sortReq).toArray(function (err,result) {
			if (err)
				throw err;

			let msg = `**Faction Cup Overview:**\n\``;
			let placeCount = 1;
			// iterate over faction points
			for (const faction of result) {
				msg = `${msg}${placeCount}) ${(faction["faction"].charAt(0).toUpperCase()+faction["faction"].slice(1)).padEnd(10)}Total:${faction["total"]} [${"+"+faction["positive"]}|${"-"+faction["negative"]}]\n`;
				placeCount ++;
			}
			// add final bat tick for text formatting
			msg = `${msg}\``;
			return message.channel.send(msg);
		});
	}
	catch(ex) {
		logger.error(ex);
	}
};
