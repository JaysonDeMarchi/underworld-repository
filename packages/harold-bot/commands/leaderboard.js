require("dotenv").config()

module.exports = (dbo, message) => {
    const discordServerID = message.guild.id

    try{
        // query for top 10 user totals (non-deleted discord users with at least point interaction only)
        query = {"discordServer": discordServerID, "discordID": {"$exists":true}, "dateDeleted": {"$exists":false}, "$or":[{"positive":{"$ne":0}},{"negative":{"$ne":0}}]}
        sortReq = {"total":-1}
        return dbo.collection("users").find(query).sort(sortReq).limit(10).toArray(function(err,result){
            if (err)
                throw err;

            msg = `**Top 10 Users:**\n\``;
            placeCount = 1
            // iterate over users and add to report
            for (const user of result){
                msg = `${msg}${placeCount}) ${(user["nickname"].charAt(0).toUpperCase()+user["nickname"].slice(1)).padEnd(20)}${(user["faction"].charAt(0).toUpperCase()+user["faction"].slice(1)).padEnd(10)}Total:${("    "+user["total"]).slice(-4)} [${("   +"+user["positive"]).slice(-4)}|${("   -"+user["negative"]).slice(-4)}]\n`
                placeCount ++
            }
            // add final bat tick for text formatting
            msg = `${msg}\``
            return message.channel.send(msg)
        });
    }
    catch(ex){
        console.error(ex)
    }
}
