require("dotenv").config();
const logger = require('../logger');

module.exports = (dbo, message) => {
	const discordServerID = message.guild.id;

	try{
		// query for faction totals
		let query = {"sprintEnd":{"$exists":false},"discordServer": discordServerID};
		let sortReq = {"total":-1};
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
			message.channel.send(msg);

			// query for top 10 user totals (non-deleted discord users with at least point interaction only)
			query = {"discordServer": discordServerID, "discordID": {"$exists":true}, "dateDeleted": {"$exists":false}, "$or":[{"positive":{"$ne":0}},{"negative":{"$ne":0}}]};
			sortReq = {"total":-1};
			return dbo.collection("users").find(query).sort(sortReq).limit(10).toArray(function (err,result) {
				if (err)
					throw err;

				msg = `**Top 10 Users:**\n\``;
				placeCount = 1;
				// iterate over users and add to report
				for (const user of result) {
					msg = `${msg}${placeCount}) ${(user["nickname"].charAt(0).toUpperCase()+user["nickname"].slice(1)).padEnd(20)}${(user["faction"].charAt(0).toUpperCase()+user["faction"].slice(1)).padEnd(10)}Total:${user["total"]} [${"+"+user["positive"]}|${"-"+user["negative"]}]\n`;
					placeCount ++;
				}
				// add final bat tick for text formatting
				msg = `${msg}\``;
				message.channel.send(msg);

				// close out sprints
				query = {"sprintEnd":{"$exists":false},"discordServer": discordServerID};
				var date = new Date();
				let updateVal = {"$set":{"sprintEnd":`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`}};
				return dbo.collection("sprints").updateMany(query,updateVal,function (err) {
					if (err) throw err;

					return dbo.collection("factionsMasterList").find().toArray(function (err,result) {
						if (err) throw err;

						// iterate through factions in the template table
						var insertVals = [];
						for(const faction of result) {
							// for
							var factionObj = {"discordServer": discordServerID,"faction":faction["name"],"total":0,"positive":0,"negative":0};
							insertVals.push(factionObj);
						}

						// Insert the faction template as a new sprint
						return dbo.collection("sprints").insertMany(insertVals,function (err) {
							if (err) throw err;

							// set all users back to 0 points
							query = {"discordServer": discordServerID,};
							updateVal = {"$set":{"total":0,"positive":0,"negative":0}};
							dbo.collection("users").updateMany(query,updateVal,function (err) {
								if (err) throw err;
							});
						});
					});
				});
			});
		});
	}
	catch(ex) {
		logger.error(ex);
	}
};
