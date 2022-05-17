import React, { useCallback } from 'react';
import { Layer, CanvasDrawInterface } from '../src';

export default function Outline(): JSX.Element {
	const handleDraw = useCallback(
		({ canvas, box }: CanvasDrawInterface): void => {
			const ctx = canvas.getContext('2d');
			if (!ctx) throw new Error();

			const { width, height, left, top } = box;

			ctx.save();

			ctx.translate(left, top);
			ctx.strokeStyle = '#111';
			ctx.strokeRect(2, 2, width - 4, height - 4);

			ctx.restore();
		},
		[]
	);

	return <Layer onDraw={handleDraw} />;
}
