const authenticate = require('./authenticate');

const resolver = async (req, res) => {
	const url = new URL(req.query.clientUrl);
	const authData = await authenticate(req.query);

	res.cookie(`${authData.type}-token`, authData.access_token, {
		httpOnly: true,
		maxAge: authData.expires_in,
		sameSite: 'Strict',
	});

	res.redirect(url);
};

const authentication = {
	configure: function (app) {
		app.get('/auth', resolver);
	},
};

module.exports = authentication;
