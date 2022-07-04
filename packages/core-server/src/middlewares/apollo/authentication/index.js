const axios = require('axios');

const integrations = {
	discord: {
		clientId: process.env.DISCORD_CLIENT_ID,
		userInfoUrl: 'https://discord.com/api/users/@me',
		parseUserInfo: (response) => {
			return {
				discordId: response.data.id,
			};
		},
	},
	twitch: {
		clientId: process.env.TWITCH_CLIENT_ID,
		userInfoUrl: 'https://api.twitch.tv/helix/users',
		parseUserInfo: (response) => {
			const data = response.data.data[0];
			return {
				twitchId: data.id,
				twitchUsername: data.login,
			};
		},
	},
};

const authentication = {
	getUserContext: async (req) => {
		const user = {
			isLoggedIn: (req.cookies['discord-token'] !== undefined || req.cookies['twitch-token'] !== undefined),
		};

		if (!user.isLoggedIn) {
			return user;
		}

		await Promise.all([ 'discord', 'twitch' ].map(async (type) => {
			const token = req.cookies[`${type}-token`];
			const integration = integrations[type];

			if (!token) {
				return;
			}

			const headers = {
				Authorization: `Bearer ${token}`,
				'Client-Id': integration.clientId,
			};
			try {
				const response = await axios.get(integration.userInfoUrl, { headers });
				user[type] = integration.parseUserInfo(response);
			} catch (error) {
				console.error(error);
			}
		}));

		return user;
	},
};

module.exports = authentication;
