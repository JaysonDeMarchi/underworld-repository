require("dotenv").config()

exports.addUser = (dbo, serverId, userId, nickname, faction, total, positive, negative) => {
    try{
        userObj = {"discordServer": serverId,"discordID":userId,"nickname":nickname,"faction":faction,"total":total,"positive":positive,"negative":negative};
        dbo.collection("users").insertOne(userObj, function (err,insDocument) {
            if(err)
                throw err;
        });
    }
    catch(ex){
    }
}

exports.addUserObj = (dbo, userObj) => {
    try{
        dbo.collection("users").insertOne(userObj, function (err,insDocument) {
            if(err)
                throw err;
        });
    }

    catch(ex){
        console.error(`ex`)
    }
}
