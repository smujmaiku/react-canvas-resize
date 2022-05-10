import React, { useCallback, useEffect, useMemo } from 'react';
import Frame from './Frame';
import {
	CanvasBoxInterface,
	CanvasDrawInterface,
	useBox,
} from './RenderProvider';

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
		buffer.width = width;
		buffer.height = height;
	}, [buffer, width, height]);

	const parentBox = useBox();
	const box: Partial<CanvasBoxInterface> = useMemo(
		() => ({
			...parentBox,
			left: (parentBox?.left || 0) + left,
			top: (parentBox?.top || 0) + top,
			width,
			height,
		}),
		[parentBox, left, top, width, height]
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
