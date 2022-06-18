const mcmanager = require("../commands/mcmanager")

const Rcon = require('modern-rcon');
const rcon = new Rcon(host=process.env.MINECRAFT_HOST, port=process.env.MINECRAFT_PORT, password=process.env.MINECRAFT_PASSWORD);

module.exports = (client, dbo, oldMember, newMember) => {
    //console.log('guildMemberUpdate event detected....')

    // find if old/new member has eligible roles for mc
    var hasOldSub = oldMember.roles.cache.find(role => ["Twitch Subscriber","Twitch Subscriber: Tier 1","Twitch Subscriber: Tier 2","Twitch Subscriber: Tier 3","Knight"].includes(role.name))
    var hasNewSub = newMember.roles.cache.find(role => ["Twitch Subscriber","Twitch Subscriber: Tier 1","Twitch Subscriber: Tier 2","Twitch Subscriber: Tier 3","Knight"].includes(role.name))

    // all valid roles removed
    if (hasOldSub && !hasNewSub){
        handleSubRemoved(dbo, oldMember, newMember)
    }
    // a valid role was added when there were none before
    else if (!hasOldSub && hasNewSub){
        handleSubAdded(dbo, oldMember, newMember)
    }
}

function handleSubRemoved(dbo, oldMember, newMember) {
    // pull user info to start with
    query = {"discordServer": oldMember.guild.id, "discordID": oldMember.id}
    return dbo.collection("users").findOne(query, (err, document) => {
        if (err) throw err;

        if (document && document.mcUsername) {
            console.log(`Sub Removed | ${newMember.nickname} : ${newMember.id} | mcUsername ${document.mcUsername} un-whitelisted`)
            return mcmanager.rconUpdateWhitelist('',document.mcUsername)
        }
    });
}

function handleSubAdded(dbo, oldMember, newMember) {
    // pull user info to start with
    query = {"discordServer": newMember.guild.id, "discordID": newMember.id}
    return dbo.collection("users").findOne(query, (err, document) => {
        if (err) throw err;

        if (document && document.mcUsername) {
            console.log(`Sub Re-added | ${newMember.nickname} : ${newMember.id} | mcUsername ${document.mcUsername} re-whitelisted`)
            return mcmanager.rconUpdateWhitelist(document.mcUsername,'')
        }
    });
}
