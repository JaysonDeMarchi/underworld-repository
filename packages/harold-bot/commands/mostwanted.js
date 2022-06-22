require("dotenv").config()
const logger = require('../logger');

module.exports = (dbo, message) => {
    const discordServerID = message.guild.id
    logger.info(`mostwanted serverID: ${discordServerID}`)
    try{
        // query for top 10 user totals (non-deleted discord users with at least point interaction only)
        query = {"discordServer": discordServerID, "discordID": {"$exists":true}, "dateDeleted": {"$exists":false}, "negative":{"$ne":0}}
        sortReq = {"negative":-1}
        return dbo.collection("users").find(query).sort(sortReq).limit(10).toArray(function(err,result){
            if (err)
                throw err;

            msg = `**10 Most Wanted:**\n\``;
            placeCount = 1
            // iterate over users and add to report
            for (const user of result){
                msg = `${msg}${placeCount}) ${(user["nickname"].charAt(0).toUpperCase()+user["nickname"].slice(1)).padEnd(20)}${(user["faction"].charAt(0).toUpperCase()+user["faction"].slice(1)).padEnd(10)}Total:${user["total"]} [${"+"+user["positive"]}|${"-"+user["negative"]}]\n`
                placeCount ++
            }
            // add final bat tick for text formatting
            msg = `${msg}\``
            return message.channel.send(msg)
        });
    }
    catch(ex){
        logger.error(ex)
    }
}
