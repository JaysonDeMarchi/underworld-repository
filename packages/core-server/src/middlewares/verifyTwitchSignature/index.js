const app = require('../../app');
const crypto = require('crypto');
const express = require('express');

const twitchSigningSecret = process.env.TWITCH_SIGNING_SECRET;

const resolver = express.json({
	verify: (req, res, buf) => {
		const messageId = req.header('Twitch-Eventsub-Message-Id');
		const timestamp = req.header('Twitch-Eventsub-Message-Timestamp');
		const messageSignature = req.header('Twitch-Eventsub-Message-Signature');

		const time = Math.floor(new Date().getTime() / 1000);

		if (Math.abs(time - timestamp) > 600) {
			// must be < 10 minutes
			console.log(`Verification Failed: timestamp > 10 minutes. Message Id: ${messageId}.`);
			throw new Error('Ignore this request.');
		}

		if (!twitchSigningSecret) {
			console.log(`Twitch signing secret is empty`);
			throw new Error('Twitch signing secret is empty');
		}

		const computedSignature =
				'sha256=' +
				crypto
					.createHmac('sha256', twitchSigningSecret)
					.update(messageId + timestamp + buf)
					.digest('hex');

		if (messageSignature !== computedSignature) {
			console.log('Verification failed');
			res.status(403).send('Forbidden');
		}
	},
});

const verifyTwitchSignature = {
	configure: () => {
		app.use('/notification', resolver);
	},
};

module.exports = verifyTwitchSignature;
