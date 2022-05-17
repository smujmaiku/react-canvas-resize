/* eslint-disable import/no-extraneous-dependencies */
import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import CanvasResize from '.';
import Fill from '../examples/Fill';
import CircularProgress from '../examples/CircularProgress';
import Outline from '../examples/Outline';

export default {
	title: 'Docs/CanvasResize',
	component: CanvasResize,
} as ComponentMeta<typeof CanvasResize>;

const Template: ComponentStory<typeof CanvasResize> = ({
	width,
	height,
	...args
}) => (
	<CanvasResize style={{ width, height }} {...args}>
		<Fill color="white" />
		<CircularProgress color="#34c" />
		<Outline />
	</CanvasResize>
);

export const Example = Template.bind({});

Example.args = {
	width: 400,
	height: 300,
	play: true,
};
