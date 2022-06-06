module.exports = {
  apps : [
		{
			name: 'core-server',
			script: './packages/core-server/src/index.js',
			cron_restart: '27 15 * * *',
		},
	],
};
