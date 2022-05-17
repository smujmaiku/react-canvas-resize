import { useCallback } from 'react';
import { useLayer, CanvasDrawInterface } from '../src';

export default function Fill({ color }: { color: string }): null {
	const handleDraw = useCallback(
		({ canvas, box }: CanvasDrawInterface): void => {
			const ctx = canvas.getContext('2d');
			if (!ctx) throw new Error();

			const { fullWidth, fullHeight } = box;

			ctx.save();
			ctx.fillStyle = color;
			ctx.fillRect(0, 0, fullWidth, fullHeight);
			ctx.restore();
		},
		[color]
	);

	useLayer(handleDraw);

	return null;
}
