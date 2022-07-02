const express = require('express');
const path = require('path');

const factionLiveView = {
	resolve: express.static(path.join(__dirname, '../../factionLiveView/build')),
};

module.exports = factionLiveView;
