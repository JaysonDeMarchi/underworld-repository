require("dotenv").config();
const logger = require('../logger');

exports.addUser = (dbo, serverId, userId, nickname, faction, total, positive, negative) => {
	try{
		const userObj = {"discordServer": serverId,"discordID":userId,"nickname":nickname,"faction":faction,"total":total,"positive":positive,"negative":negative};
		dbo.collection("users").insertOne(userObj, function (err) {
			if(err)
				throw err;
		});
	}
	catch(ex) {
		logger.error(ex);
	}
};

exports.addUserObj = (dbo, userObj) => {
	try{
		dbo.collection("users").insertOne(userObj, function (err) {
			if(err)
				throw err;
		});
	}

	catch(ex) {
		logger.error(`ex`);
	}
};
