require("dotenv").config()

module.exports = (dbo, message) => {
    const discordServerID = message.guild.id

    try{
        // query for faction totals
        query = {"sprintEnd":{"$exists":false}, "discordServer": discordServerID}
        sortReq = {"total":-1}
        return dbo.collection("sprints").find(query).sort(sortReq).toArray(function(err,result){
            if (err)
                throw err;

            msg = `**Faction Cup Overview:**\n\``;
            placeCount = 1
            // iterate over faction points
            for (const faction of result){
                msg = `${msg}${placeCount}) ${(faction["faction"].charAt(0).toUpperCase()+faction["faction"].slice(1)).padEnd(10)}Total:${faction["total"]} [${"+"+faction["positive"]}|${"-"+faction["negative"]}]\n`
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
