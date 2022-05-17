/* eslint-disable import/no-extraneous-dependencies */
import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import Canvas from '../src';
import Fill from './Fill';

export default {
	title: 'Examples/Fill',
	component: Fill,
	argTypes: {
		play: { control: 'boolean' },
		color: { control: 'color' },
	},
} as ComponentMeta<typeof Fill>;

const Template: ComponentStory<typeof Fill> = ({ play, ...args }) => (
	<Canvas style={{ width: 400, height: 300 }} play={play}>
		<Fill {...args} />
	</Canvas>
);

export const Example = Template.bind({});

Example.args = {
	play: true,
	color: '#34C',
};
