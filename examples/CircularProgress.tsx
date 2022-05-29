import { useCallback } from 'react';
import { useLayer, CanvasDrawInterface } from '../src';

export default function CircularProgress({ color }: { color: string }): null {
	const handleDraw = useCallback(
		({ canvas, now }: CanvasDrawInterface): void => {
			const ctx = canvas.getContext('2d');
			if (!ctx) throw new Error();

			const { width, height } = canvas;
			const size = Math.min(width, height);

			const progress = (now / 3000) % 1;
			const offset = (now / 7000) % 1;
			const start = progress > 0.5 ? 1 : progress * 2;
			const end = progress < 0.5 ? 1 : progress * 2 - 1;

			ctx.save();
			ctx.strokeStyle = color;
			ctx.lineWidth = size / 20;
			ctx.beginPath();
			ctx.arc(
				width / 2,
				height / 2,
				(size * 1) / 2 - ctx.lineWidth / 2,
				(start + offset) * 2 * Math.PI,
				(end + offset) * 2 * Math.PI
			);
			ctx.stroke();
			ctx.restore();
		},
		[color]
	);

	useLayer(handleDraw);

	return null;
}
