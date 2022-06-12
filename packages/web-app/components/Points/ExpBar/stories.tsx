import React from 'react';
import ExpBar from './index';

const config = {
	component: ExpBar,
	title: 'Points / ExpBar',
};

const Template = (args) => <ExpBar {...args} />;

export const ShowBar = Template.bind({});
ShowBar.args = {
	level: 0,
	width: 0
};

export default config;
