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

export type HTMLCanvasProps = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLCanvasElement>,
	HTMLCanvasElement
>;

export interface CanvasProps extends HTMLCanvasProps {
	width: number;
	height: number;
	play?: boolean;
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
	const { width, height, play, box, onInit, onDraw, children, ...otherProps } =
		props;

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [layers, setLayers] = useState<CanvasLayer[]>([]);
	const [needFrame, setNeedFrame] = useState<boolean>(true);

	const drawCanvas = useCallback(
		(opts): void => {
			const { count } = opts;

			const canvas = canvasRef.current;
			if (!canvas) {
				throw new Error('Canvas is not ready');
			}

			setNeedFrame(false);

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

	const animate = play || needFrame;
	useAnimationFrame(drawCanvas, animate);

	return (
		<CanvasProvider onChange={setLayers}>
			<canvas {...otherProps} ref={canvasRef} width={width} height={height}>
				{children}
			</canvas>
		</CanvasProvider>
	);
}
