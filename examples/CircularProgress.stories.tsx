/* eslint-disable import/no-extraneous-dependencies */
import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import Canvas from '../src';
import Fill from './Fill';
import CircularProgress from './CircularProgress';

export default {
	title: 'Examples/CircularProgress',
	component: CircularProgress,
	argTypes: {
		play: { control: 'boolean' },
		color: { control: 'color' },
	},
} as ComponentMeta<typeof CircularProgress>;

const Template: ComponentStory<typeof CircularProgress> = ({ play, ...args }) => (
	<Canvas style={{ width: 400, height: 300 }} play={play}>
		<Fill color="white" />
		<CircularProgress {...args} />
	</Canvas>
);

export const Example = Template.bind({});

Example.args = {
	play: true,
	color: '#34C',
};
