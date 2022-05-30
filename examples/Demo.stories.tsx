/* eslint-disable import/no-extraneous-dependencies */
import { ComponentStory } from '@storybook/react';
import React, { useState, useEffect, useCallback } from 'react';
import { css } from '@emotion/css';
import CanvasResize, {
	CanvasBase,
	Crop,
	CropRatio,
	CanvasDrawInterface,
	useLayer,
} from '../src';
import Fill from './Fill';
import Outline from './Outline';
import Stats from './Stats';
import { ResizeFn } from '../src/RenderProvider';

export default {
	title: 'Examples/App',
	argTypes: {
		play: { control: 'boolean' },
		ratio: { control: 'text' },
	},
};

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
		width: 100vw;
		height: 100vh;
		margin-left: 0;
		margin-top: 0;
	}

	& .canvas {
		background-color: #fff;
		box-shadow: 0 1vw 2vw rgba(0, 0, 0, 0.25), 0 0.5vw 0.5vw rgba(0, 0, 0, 0.22);
	}
`;

const COLORS = ['#F43', '#4F3', '#43F'];

function WiggleLine(): null {
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
		({ canvas, now }: CanvasDrawInterface): void => {
			const { width, height } = canvas;
			const size = Math.min(width, height) / 10;

			const ctx = canvas.getContext('2d');
			if (!ctx) throw new Error();

			ctx.save();

			const sx = Math.cos(now / 300) * 4 * size;
			const sy = Math.sin(now / 120) * 4 * size;
			const ex = Math.cos((now + 100) / 300) * 4 * size;
			const ey = Math.sin((now + 100) / 120) * 4 * size;

			ctx.translate(width / 2, height / 2);
			ctx.lineWidth = size;
			ctx.strokeStyle = color;
			ctx.beginPath();
			ctx.moveTo(sx, sy);
			ctx.lineTo(ex, ey);
			ctx.stroke();

			ctx.restore();
		},
		[color]
	);

	useLayer(handleDraw);

	return null;
}

interface AppProps {
	play?: boolean;
	ratio: string;
	// eslint-disable-next-line react/no-unused-prop-types
	onResize: ResizeFn;
}

function CanvasResizeApp(props: AppProps): JSX.Element {
	const { play, ratio, onResize } = props;

	const handleDraw = useCallback(({ canvas }: CanvasDrawInterface): void => {
		const { width, height } = canvas;

		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error();
		ctx.clearRect(0, 0, width, height);
	}, []);

	return (
		<div className={appStyles}>
			<CanvasResize
				play={play}
				className="canvas-wrap"
				ratio={ratio}
				resizePlan="static"
				onResize={onResize}
				onDraw={handleDraw}
				canvasProps={{
					className: 'canvas',
				}}
			>
				<WiggleLine />
				<Stats />
				<Crop left={110} top={10} width={120} height={70} zIndex={99}>
					<Fill color="#CCC" />
					<Stats />
				</Crop>
				<Outline />
			</CanvasResize>
		</div>
	);
}

const CanvasResizeTemplate: ComponentStory<typeof CanvasResizeApp> = (args) => (
	<CanvasResizeApp {...args} />
);

export const CanvasResizeDemo = CanvasResizeTemplate.bind({});

CanvasResizeDemo.args = {
	play: true,
	ratio: '16x9',
};

function CropRatioApp(props: AppProps): JSX.Element {
	const { play, ratio } = props;

	const handleDraw = useCallback(({ canvas }: CanvasDrawInterface): void => {
		const { width, height } = canvas;

		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error();
		ctx.clearRect(0, 0, width, height);
	}, []);

	return (
		<div className={appStyles}>
			<CanvasBase
				play={play}
				className="canvas-wrap canvas"
				resizePlan="static"
				onDraw={handleDraw}
			>
				<Stats />
				<CropRatio ratio={ratio}>
					<Stats />
					<WiggleLine />
					<Crop left={110} top={10} width={120} height={70} zIndex={99}>
						<Fill color="#CCC" />
						<Stats />
					</Crop>
					<Outline />
				</CropRatio>
			</CanvasBase>
		</div>
	);
}

const CropRatioTemplate: ComponentStory<typeof CropRatioApp> = (args) => (
	<CropRatioApp {...args} />
);

export const CropRatioDemo = CropRatioTemplate.bind({});

CropRatioDemo.args = {
	play: true,
	ratio: '16x9',
};
