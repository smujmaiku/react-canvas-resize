/* eslint-disable import/no-extraneous-dependencies */
import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import CanvasBase from '.';
import Fill from '../examples/Fill';
import CircularProgress from '../examples/CircularProgress';
import Outline from '../examples/Outline';

export default {
	title: 'Docs/CanvasBase',
	component: CanvasBase,
} as ComponentMeta<typeof CanvasBase>;

const Template: ComponentStory<typeof CanvasBase> = ({
	width,
	height,
	...args
}) => (
	<CanvasBase style={{ width, height }} {...args}>
		<Fill color="white" />
		<CircularProgress color="#34c" />
		<Outline />
	</CanvasBase>
);

export const Example = Template.bind({});

Example.args = {
	width: 400,
	height: 300,
	play: true,
};
