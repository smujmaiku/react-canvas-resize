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

const Template: ComponentStory<typeof CanvasResize> = (args) => (
	<div style={{ height: '100vh', width: '100vw' }}>
		<CanvasResize style={{ height: '100%', width: '100%' }} {...args}>
			<Fill color="white" />
			<CircularProgress color="#34c" />
			<Outline />
		</CanvasResize>
	</div>
);

export const Example = Template.bind({});

Example.args = {
	play: true,
};
