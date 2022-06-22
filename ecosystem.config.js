module.exports = {
  apps : [
    {
      name: 'HaroldBot-staging',
      script: './packages/harold-bot/index.js',
      cron_restart: '27 15 * * *',
    },
  ],
};
