import React, { useCallback, useEffect, useMemo } from 'react';
import Frame from './Frame';
import { CanvasDrawInterface } from './RenderProvider';

export interface CropProps {
	left: number;
	top: number;
	width: number;
	height: number;
	zIndex?: number;
	children?: React.ReactNode;
}

export default function Crop(props: CropProps): JSX.Element {
	const { left, top, width, height, zIndex = 0, children } = props;

	const buffer = useMemo(
		(): HTMLCanvasElement => document.createElement('canvas'),
		[]
	);

	useEffect(() => {
		buffer.width = width - left;
		buffer.height = height - top;
	}, [buffer, left, top, width, height]);

	const box: CanvasBoxInterface = useMemo(
		() => ({
			left,
			top,
			width,
			height,
		}),
		[]
	);

	const handleDraw = useCallback(
		(frame: CanvasDrawInterface): void => {
			const { canvas } = frame;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			ctx.drawImage(buffer, left, top);
		},
		[buffer, left, top]
	);

	return (
		<Frame canvas={buffer} onDraw={handleDraw} zIndex={zIndex} box={box}>
			{children}
		</Frame>
	);
}
