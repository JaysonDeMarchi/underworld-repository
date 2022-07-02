const AhogeManager = require('../../helpers/ahoge');
const EventSub = require('../../helpers/eventSub');
const FactionPoints = require('../../helpers/factionPoints');

let recentNotifIds = new Set();

const notification = {
	request: 'post',
	path: '/notification',
	resolve: async (req, res) => {
		const messageType = req.header('Twitch-Eventsub-Message-Type');
		// must reply with 200 status/verify before any processing
		if (messageType === 'webhook_callback_verification') {
			console.log('Verifying Webhook');
			res.header('content-type', 'text/plain');
			return res.status(200).send(req.body.challenge);
		} else {
			res.status(200).end();
		}

		const { type } = req.body.subscription;
		const { event } = req.body;

		if (req.header('Twitch-Eventsub-Message-Type') === 'notification') {
			// log event if in debug mode
			if (process.env.DEBUG == 'true') { console.log(type); console.log(event); }

			// make sure this event has not been received already
			if (!recentNotifIds.has(event.id)) {
				// add event id to recents notif list
				recentNotifIds.add(event.id);

				// there's some kinda iffy race condition fucky wucky goin on in here
				if (type != 'stream.online' && type != 'stream.offline' && type != 'channel.channel_points_custom_reward_redemption.add') {
					AhogeManager.addXp(type, event);
				}
				// parse out the title of the redeem
				else if (type === 'channel.channel_points_custom_reward_redemption.add') {
					FactionPoints.parseFactionPoints(event);
				}
				else if (type == 'stream.online') {
					AhogeManager.streamOnline();
				}
				else if (type == 'stream.offline') {
					AhogeManager.streamOffline();
				}
			}
		} else if (req.header('Twitch-Eventsub-Message-Type') === 'revocation') {
			console.log('EventSub Subscription Revoked');
			recentNotifIds.clear();
			EventSub.initializeRedeemSubscription(req.body.type);
		} else {
			console.log(`Message type ${req.header('Twitch-Eventsub-Message-Type')} not recognized as command.`);
			console.log(req);
		}
	},
};

module.exports = notification;
