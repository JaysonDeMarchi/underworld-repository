import React from 'react';
import PointHistory from './index';

const config = {
	component: PointHistory,
	title: 'Points / PointHistory',
};

const Template = (args) => <PointHistory {...args} />;

export const Capsule = Template.bind({});
Capsule.args = {
	faction: "Monsters",
	value: "10",
	direction: 1,
	source: "Dailies",
	username: "AReallyLongUserName"
};

export default config;
