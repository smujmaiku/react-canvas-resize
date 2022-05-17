import React, { useCallback } from 'react';
import { Layer, CanvasDrawInterface } from '../src';

export default function Stats(): JSX.Element {
	const handleDraw = useCallback(
		({ canvas, fps, interval, count, box }: CanvasDrawInterface): void => {
			const ctx = canvas.getContext('2d');
			if (!ctx) throw new Error();

			const { scale, width, height, left, top } = box;

			ctx.fillStyle = 'black';
			ctx.fillText(`fps: ${fps}`, 5, 15);
			ctx.fillText(`interval: ${interval}`, 5, 30);
			ctx.fillText(`count: ${count}`, 5, 45);
			ctx.fillText(`scale: ${scale.toFixed(2)}`, 5, 60);
			ctx.fillText(`size: ${width.toFixed(1)} x ${height.toFixed(1)}`, 5, 75);
			ctx.fillText(`pos: ${left.toFixed(1)} x ${top.toFixed(1)}`, 5, 90);
		},
		[]
	);

	return <Layer onDraw={handleDraw} />;
}
