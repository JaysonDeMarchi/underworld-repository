import React from 'react';
import Button from './index';

export default {
	component: Button,
	title: 'Integration / Button',
};

const Template = args => <Button {...args} />;

export const Twitch = Template.bind({});
Twitch.args = {
	id: 'connect-to-twitch',
	label: 'Connect with Twitch',
	url: 'https://twitch.tv/',
};
