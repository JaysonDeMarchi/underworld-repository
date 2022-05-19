import React from 'react';
import Button from './index';

const config = {
	component: Button,
	title: 'Integration / Button',
};

const Template = args => <Button {...args} />;
const redirectUri = 'http://localhost:6006/';

export const Discord = Template.bind({});
Discord.args = {
	integration: 'discord',
	redirectUri,
};

export const Twitch = Template.bind({});
Twitch.args = {
	integration: 'twitch',
	redirectUri,
};

export default config;
