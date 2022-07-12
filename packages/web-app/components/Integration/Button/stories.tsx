import { Meta, Story } from '@storybook/react';
import Button, { ButtonInterface } from './index';

export default {
	component: Button,
	title: 'Integration / Button',
} as Meta;

const Template: Story<ButtonInterface> = (args) => <Button {...args} />;
const redirectUri = 'http://localhost:6336/auth/?clientUrl=http://localhost:6006/&type=';

export const Discord = Template.bind({});
Discord.args = {
	integration: 'discord',
	redirectUri: redirectUri + 'discord',
};

export const Twitch = Template.bind({});
Twitch.args = {
	integration: 'twitch',
	redirectUri: redirectUri + 'twitch',
};
