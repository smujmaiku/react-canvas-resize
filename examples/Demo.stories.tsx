/* eslint-disable import/no-extraneous-dependencies */
import { ComponentStory, ComponentMeta } from '@storybook/react';
import React, { useState, useEffect, useCallback } from 'react';
import { css } from '@emotion/css';
import Canvas, {
	Crop,
	CanvasDrawInterface,
	CanvasBoxInterface,
} from '../src';
import Fill from './Fill';
import Outline from './Outline';
import Stats from './Stats';

const appStyles = css`
	& {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: #ddd;
	}

	& .canvas-wrap {
		width: 90vw;
		height: 90vh;
		margin-left: 5vw;
		margin-top: 5vh;
	}

	& .canvas {
		background-color: #fff;
		box-shadow: 0 1vw 2vw rgba(0, 0, 0, 0.25), 0 0.5vw 0.5vw rgba(0, 0, 0, 0.22);
	}
`;

const COLORS = ['#F43', '#4F3', '#43F'];

interface AppProps {
	play?: boolean;
	onResize: (box: CanvasBoxInterface) => void;
}

function App(props: AppProps): JSX.Element {
	const { play, onResize } = props;
	const [color, setColor] = useState<string>('#F43');

	useEffect(() => {
		let index = 0;
		const timer = setInterval(() => {
			index = (index + 1) % COLORS.length;
			setColor(COLORS[index]);
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	const handleDraw = useCallback(
		({ canvas, now, box }: CanvasDrawInterface): void => {
			const { width, height, left, top, fullWidth, fullHeight, scale } = box;

			const ctx = canvas.getContext('2d');
			if (!ctx) throw new Error();
			ctx.clearRect(0, 0, fullWidth, fullHeight);

			ctx.save();

			const sx = Math.cos(now / 300) * 4 * scale;
			const sy = Math.sin(now / 120) * 4 * scale;
			const ex = Math.cos((now + 100) / 300) * 4 * scale;
			const ey = Math.sin((now + 100) / 120) * 4 * scale;

			ctx.translate(left + width / 2, top + height / 2);
			ctx.lineWidth = scale;
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.lineTo(ex, ey);
			ctx.stroke();

			ctx.restore();
		},
		[color]
	);

	return (
		<div className={appStyles}>
			<Canvas
				play={play}
				className="canvas-wrap"
				ratio="16x9"
				resizePlan="static"
				onResize={onResize}
				onDraw={handleDraw}
				canvasProps={{
					className: 'canvas',
				}}
				fillCanvas
			>
				<Stats />
				<Crop left={110} top={10} width={120} height={105} zIndex={99}>
					<Fill color="#CCC" />
					<Outline />
					<Stats />
				</Crop>
			</Canvas>
		</div>
	);
}

export default {
	title: 'Examples/App',
	component: App,
	argTypes: {
		play: { control: 'boolean' },
	},
} as ComponentMeta<typeof App>;

const Template: ComponentStory<typeof App> = (args) => <App {...args} />;

export const DemoApp = Template.bind({});

DemoApp.args = {
	play: true,
};
