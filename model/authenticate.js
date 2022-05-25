const axios = require('axios');
const qs = require('qs');

const integrations = {
	discord: {
		clientId: process.env.DISCORD_CLIENT_ID,
		clientSecret: process.env.DISCORD_CLIENT_SECRET,
		tokenUrl: 'https://discord.com/api/oauth2/token',
		userInfoUrl: 'https://discord.com/api/users/@me',
		parseUserInfo: (response) => {
			return {
				discordId: response.data.id,
			};
		},
	},
	twitch: {
		clientId: process.env.TWITCH_CLIENT_ID,
		clientSecret: process.env.TWITCH_CLIENT_SECRET,
		tokenUrl: 'https://id.twitch.tv/oauth2/token',
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

const authenticate = async ({ clientUrl, type, code }) => {
	const integration = integrations[type];
	const searchParams = {
		type,
	};
	return await axios.post(
		integration.tokenUrl,
		qs.stringify({
			client_id: integration.clientId,
			client_secret: integration.clientSecret,
			code,
			grant_type: 'authorization_code',
			redirect_uri: `${process.env.OAUTH_BASE_REDIRECT_URL}/auth/?clientUrl=${clientUrl}&type=${type}`,
		})
	).then((response) => {
		searchParams.token = response.data.access_token;
		return axios.get(
			integration.userInfoUrl,
			{
				headers: {
					'Authorization': `Bearer ${searchParams.token}`,
					'Client-Id': integration.clientId,
				}
			}
		);
	}).then((response) => {
		integration.parseUserInfo(response);
		return searchParams;
	});
};

module.exports = authenticate;
