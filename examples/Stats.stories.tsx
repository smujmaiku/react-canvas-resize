/* eslint-disable import/no-extraneous-dependencies */
import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import Canvas from '../src';
import Fill from './Fill';
import Stats from './Stats';

export default {
	title: 'Examples/Stats',
	component: Stats,
	argTypes: {
		play: { control: 'boolean' },
	},
} as ComponentMeta<typeof Stats>;

const Template: ComponentStory<typeof Stats> = ({ play }) => (
	<Canvas style={{ width: 400, height: 300 }} play={play}>
		<Fill color="white" />
		<Stats />
	</Canvas>
);

export const Example = Template.bind({});

Example.args = {
	play: true,
};
