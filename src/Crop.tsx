import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { CanvasDrawInterface, CanvasLayer } from './CanvasBase';
import sortLayers from './sortLayer';

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
	const [layers, setLayers] = useState<CanvasLayer[]>([]);

	useEffect(() => {
		buffer.width = width - left;
		buffer.height = height - top;
	}, [buffer, left, top, width, height]);

	const handleDraw = useCallback(
		(frame: CanvasDrawInterface): void => {
			const { box, canvas } = frame;

			const ctx = canvas.getContext('2d');
			const btx = buffer.getContext('2d');
			if (!ctx || !btx) return;

			const orderedLayers = sortLayers(layers);

			const bufferFrame = {
				...frame,
				box: {
					...box,
					left: box.left + left,
					top: box.top + top,
					width,
					height,
				},
				canvas: buffer,
			};

			btx.drawImage(buffer, -left, -top);

			for (const [draw] of orderedLayers) {
				draw(bufferFrame);
			}

			ctx.drawImage(buffer, left, top);
		},
		[buffer, left, top, width, height, layers]
	);

	useLayer(handleDraw, zIndex);

	return <CanvasProvider onChange={setLayers}>{children}</CanvasProvider>;
}
