require("dotenv").config()
const Discord = require("discord.js")
const fs = require("fs")
const client = new Discord.Client()

require("dotenv").config()
var MongoClient = require('mongodb').MongoClient;

// redirect console output to log file
let logConsoleStream = fs.createWriteStream('./logs/console.log',{flags: 'a'});
let logErrorStream = fs.createWriteStream('./logs/error.log',{flags: 'a'});
process.stdout.write = logConsoleStream.write.bind(logConsoleStream)
process.stderr.write = logErrorStream.write.bind(logErrorStream)
process.on('uncaughtException', function (ex) {
    console.error(ex)
});
MongoClient.connect(process.env.CONN_STRING, function(err, db){
    if (err) throw err;
    var dbo = db.db("master");

    fs.readdir("./events/", (err, files) => {
        files.forEach((file) => {
            const eventHandler = require(`./events/${file}`)
            const eventName = file.split(".")[0]
            client.on(eventName, (...args) => eventHandler(client, dbo, ...args))
        })
    })

    client.login(process.env.BOT_TOKEN)
});