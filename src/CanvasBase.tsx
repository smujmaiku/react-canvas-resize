import React, { useCallback, useMemo, useRef, useState } from 'react';
import useAnimationFrame from './animationFrame';
import {
	useCanvasListing,
	CanvasBoxInterface,
	CanvasDrawInterface,
	CanvasLayer,
	CanvasProvider,
	OnDraw,
} from './context';
import sortLayers from './sortLayer';

export interface CanvasProps extends HTMLCanvasProps {
	width: number;
	height: number;
	box?: CanvasBoxInterface;
	onInit?: (canvas: HTMLCanvasElement) => void;
	onDraw?: (frame: CanvasDrawInterface) => void;
}

export function useLayer(onDraw: OnDraw, zIndex = 0 as number): void {
	const listing = useMemo(
		(): CanvasLayer => [onDraw, zIndex],
		[onDraw, zIndex]
	);
	useCanvasListing(listing);
}

/**
 * Canvas React Element
 */
export default function CanvasBase(props: CanvasProps): JSX.Element {
	const { width, height, box, onInit, onDraw, children, ...otherProps } = props;

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [layers, setLayers] = useState<CanvasLayer[]>([]);

	const drawCanvas = useCallback(
		(opts): void => {
			const { count } = opts;

			const canvas = canvasRef.current;
			if (!canvas) {
				throw new Error('Canvas is not ready');
			}

			if (count === 0 && onInit) {
				onInit(canvas);
			}

			const orderedLayers = sortLayers([
				...(onDraw ? [[onDraw, 0] as CanvasLayer] : []),
				...layers,
			]);

			const frame: CanvasDrawInterface = {
				box: {
					left: 0,
					top: 0,
					width: canvas.width,
					height: canvas.height,
					scale: 1,
					...(box || {}),
					fullWidth: canvas.width,
					fullHeight: canvas.height,
				},
				canvas,
				...opts,
			};
			for (const [draw] of orderedLayers) {
				draw(frame);
			}
		},
		[box, canvasRef, onInit, onDraw, layers]
	);

	useAnimationFrame(drawCanvas);

	return (
		<CanvasProvider onChange={setLayers}>
			<canvas {...otherProps} ref={canvasRef} width={width} height={height}>
				{children}
			</canvas>
		</CanvasProvider>
	);
}
