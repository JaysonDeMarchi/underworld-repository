const authenticate = require('./authenticate');

const authentication = {
	request: 'get',
	path: '/auth',
	resolve: async (req, res) => {
		const url = new URL(req.query.clientUrl);
		const authData = await authenticate(req.query);

		res.cookie(`${authData.type}-token`, authData.access_token, {
			httpOnly: true,
			maxAge: authData.expires_in,
			sameSite: 'Strict',
		});

		res.redirect(url);
	},
};

module.exports = authentication;
