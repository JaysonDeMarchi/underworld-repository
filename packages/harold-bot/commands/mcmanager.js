require("dotenv").config()
const usermanager = require("./userManager")
const logger = require('../logger');

const Rcon = require('modern-rcon');
const rcon = new Rcon(host=process.env.MINECRAFT_HOST, port=parseInt(process.env.MINECRAFT_PORT), password=process.env.MINECRAFT_PASSWORD);

const factions = ["undead","creatures","monsters"];

//exports.updateMCWhitelist = (dbo, message) => {
const updateMCWhitelist = (dbo, message) => {
    const discordServerId = message.guild.id
    const userId = message.member.id
    const nickname = message.member.displayName

    // get faction role of user
    var faction = "";
    // Remove keys from collection so only role names left
    roleCollection = message.member.roles.cache.map(function(obj){return obj.name.toLowerCase()})
    // Grab the role name that corresponds to a faction
    roleVal = roleCollection.filter(function(role){ return factions.includes(role) });
    faction = roleVal[0]

    mcUsername = message.content.split(' ')[1]

    logger.info(`attempted whitelist command ${nickname},${faction},${mcUsername}`)

    try{
        // check if requested username is already taken by another user in the server
        query = {"discordServer": discordServerId, "mcUsername": mcUsername}
        return dbo.collection("users").findOne(query, (err, document) => {
            if (err) throw err;
            if (document) {
                logger.info(`Discord user ${nickname} (${userId}) attempted to whitelist minecraft username ${mcUsername}, but it is already in use by ${document.nickname} (${document.discordID})`);
                return message.channel.send(`${mcUsername} is already in use`)
            }

            // if not in use, try finding the db user document of the requesting member
            query = {"discordServer": discordServerId, "discordID": message.member.id}
            return dbo.collection("users").findOne(query, (err, document) => {
                if (err) throw err;

                // Has existing document & minecraft username
                if (document && document.mcUsername){
                    // un-whitelist old username, add new name
                    return rconUpdateWhitelist(mcUsername,document.mcUsername).then(res => {
                        logger.info(`update cmd response: ${res}`)
                        // if success resp, update db and send message
                        if(res == `${mcUsername} is now whitelisted`){
                            // update document
                            update = {"$set":{"nickname":nickname,"mcUsername":mcUsername}}
                            return dbo.collection("users").findOneAndUpdate(query, update, { "returnNewDocument": false }, (err, documents) => {
                                if (err) throw err;

                                return message.channel.send(res)
                            });
                        }
                        // else only send failure resp
                        else{
                            return message.channel.send(res)
                        }
                    })
                }
                // Has existing document, but not whitelisted a minecraft username before
                else if (document){
                    // whitelist new username
                    return rconUpdateWhitelist(mcUsername,'').then(res => {
                        logger.info(`update cmd response: ${res}`)
                        // if success resp, update db and send message
                        if(res == `${mcUsername} is now whitelisted`){
                            // update document
                            update = {"$set":{"nickname":nickname,"mcUsername":mcUsername}}
                            return dbo.collection("users").findOneAndUpdate(query, update, { "returnNewDocument": false }, (err, documents) => {
                                if (err) throw err;

                                return message.channel.send(res)
                            });
                        }
                        // else only send failure resp
                        else{
                            return message.channel.send(res)
                        }
                    })
                }
                // member has no document and is not in the database yet
                else{
                    // whitelist new username
                    return rconUpdateWhitelist(mcUsername,'').then(res => {
                        logger.info(`update cmd response: ${res}`)
                        // if success resp, create new document for member with username, and send resp message
                        if(res == `${mcUsername} is now whitelisted`){
                            userObj = {"discordServer": discordServerId,"discordID":userId,"nickname":nickname,"faction":faction,"total":0,"positive":0,"negative":0,"mcUsername":mcUsername};
                            usermanager.addUserObj(dbo, userObj)
                        }

                        return message.channel.send(res);
                    });
                }
            });
        });
    }
    catch(ex){
        logger.error(ex)
    }
}

// executes whitelist add/remove for requested usernames
const rconUpdateWhitelist = (addUser,removeUser) => {
    var msg = '';

    // open rcon connection, attempt to add username to whitelist if it is specified
    return rcon.connect().then(() => {
        if(addUser != ''){
            return rcon.send(`whitelist add ${addUser}`);
        }
        else{
            return 1
        }
    }).then(res => {
        logger.info(`rcon add response: ${res}`)

        // if invalid username, set msg and return
        if(res == 'That player does not exist'){
            msg = `The minecraft username ${addUser} does not exist`
            return -1
        }
        // otherwise if it didn't throw errors the user should be on the whitelist
        else{
            msg = `${addUser} is now whitelisted`
            // send cmd to remove old username if it is needed
            if(removeUser != ''){
                return rcon.send(`whitelist remove ${removeUser}`).then(res => { logger.info(`rcon remove response: ${res}`)})
            }
            else{
                return 1
            }
        }
    }).then(() => {
        rcon.disconnect()
    }).then(() => {
        // return msg string that was built previously for entire promise
        return msg
    }).catch(() => {
        // an error occurred, respond with error msg
        logger.error("There was an error issuing rcon commands");
        return `\`There was an error whitelisting ${mcUsername}\``;
    });
}

module.exports = {updateMCWhitelist, rconUpdateWhitelist}
