const path = require("path");

const factionOverview = {
    request: 'get',
    path: '/factionOverview',
    resolve: async (req, res) => {
        res.sendFile(path.join(__dirname, '../../factionLiveView/build', 'index.html'));
    },
};

module.exports = factionOverview;
