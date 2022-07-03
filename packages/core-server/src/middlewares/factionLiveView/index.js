const express = require('express');
const path = require('path');

const resolver = express.static(path.join(__dirname, '../../factionLiveView/build'));

const factionLiveView = {
	configure: (app) => {
		app.use(resolver);
	},
};

module.exports = factionLiveView;
