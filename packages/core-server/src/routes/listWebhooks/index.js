require('dotenv');
const https = require('https');

const resolver = async (req, res) => {
	if (process.env.TEST_ENV !== 'true') {
		res.redirect('/');
	}

	const createWebHookParams = {
		host: 'api.twitch.tv',
		path: 'helix/eventsub/subscriptions',
		method: 'GET',
		headers: {
			'Client-ID': process.env.TWITCH_CLIENT_ID,
			'Authorization': `Bearer ${process.env.TWITCH_APP_BEARER}`,
		}
	};

	let responseData = '';
	const listRequest = https.request(createWebHookParams, (result) => {
		result.setEncoding('utf8');
		result.on('data', function (d) {
			responseData = responseData + d;
		}).on('end', function () {
			const responseBody = JSON.parse(responseData);
			res.send(responseBody);
		});
	});

	listRequest.on('error', (e) => { console.error(e.message); });
	listRequest.end();
};

const listWebhooks = {
	request: 'get',
	path: '/listWebhooks',
	configure: (app) => {
		app.get('/listWebhooks', resolver);
	},
};
module.exports = listWebhooks;
