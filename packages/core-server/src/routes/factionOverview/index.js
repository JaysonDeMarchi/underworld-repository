const app = require('../../app');
const path = require("path");

const resolver = async (req, res) => {
	res.sendFile(path.join(__dirname, '../../factionLiveView/build', 'index.html'));
};

const factionOverview = {
	configure: () => {
		app.get('/factionOverview', resolver);
	},
};

module.exports = factionOverview;
