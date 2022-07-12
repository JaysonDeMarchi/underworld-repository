import { Meta, Story } from '@storybook/react';
import PointHistory, { PointHistoryInterface } from './index';

export default {
	component: PointHistory,
	title: 'Points / PointHistory',
} as Meta;

const Template: Story<PointHistoryInterface> = (args) => <PointHistory {...args} />;

export const Capsule = Template.bind({});
Capsule.args = {
	faction: "Monsters",
	value: 10,
	direction: 1,
	source: "Dailies",
	username: "AReallyLongUserName"
};
