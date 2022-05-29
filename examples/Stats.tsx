import React, { useCallback } from 'react';
import { Layer, CanvasDrawInterface } from '../src';

export default function Stats(): JSX.Element {
	const handleDraw = useCallback(
		({ canvas, fps, interval, count }: CanvasDrawInterface): void => {
			const ctx = canvas.getContext('2d');
			if (!ctx) throw new Error();

			const { width, height } = canvas;

			ctx.fillStyle = 'black';
			ctx.fillText(`fps: ${fps}`, 5, 15);
			ctx.fillText(`interval: ${interval}`, 5, 30);
			ctx.fillText(`count: ${count}`, 5, 45);
			ctx.fillText(`size: ${width.toFixed(1)} x ${height.toFixed(1)}`, 5, 60);
		},
		[]
	);

	return <Layer onDraw={handleDraw} />;
}
