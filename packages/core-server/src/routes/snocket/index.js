const app = require('../../app');

const resolver = async (req, res) => {
	res.send('This is where Nexilitus goes genera421Oops');
};

// easter egg :3
const snocket = {
	configure: function () {
		app.get('/snocket', resolver);
	},
};

module.exports = snocket;
