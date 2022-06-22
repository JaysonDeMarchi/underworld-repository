const pino = require('pino');

const levels = [
	'error',
	'debug',
	'info',
];

const streams = levels.map((level) => {
	return {
		level,
		stream: pino.destination(`${__dirname}/../logs/${level}.log`),
	};
});

const logger = pino(
	{
		base: '',
		messageKey: 'message',
		timestamp: () => {
			// The ',"time"' string is to rebuild the json syntax pino outputs to.
			// When using a custom timestamp the entire "time" attribute is replaced.
			const time = (new Date()).toISOString();
			return `,"time": "${time}"`;
		},
	},
	pino.multistream(streams)
);

module.exports = logger;
