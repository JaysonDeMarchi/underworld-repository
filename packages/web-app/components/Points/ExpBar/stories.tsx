import { Meta, Story } from '@storybook/react';
import ExpBar, { ExpBarInterface } from './index';

export default {
	component: ExpBar,
	title: 'Points / ExpBar',
} as Meta;

const Template: Story<ExpBarInterface> = (args) => <ExpBar {...args} />;

export const ShowBar = Template.bind({});
ShowBar.args = {
	level: 0,
	width: 0
};
