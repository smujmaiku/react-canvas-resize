import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
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

const noop = () => {
	// noop;
};

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

	const [canvasEl, setCanvas] = useState<HTMLCanvasElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	canvasRef.current = canvasEl;

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

	const renderFrame = useAnimationFrame(drawCanvas, play);

	// Render new canvas
	useEffect(() => {
		renderFrame();
	}, [renderFrame, canvasEl]);

	// Render on resize
	useEffect(() => {
		if (!canvasEl) return noop;

		const resizeObserver = new ResizeObserver(() => {
			renderFrame();
		});
		resizeObserver.observe(canvasEl);

		return () => {
			resizeObserver.disconnect();
		};
	}, [canvasEl, renderFrame]);

	return (
		<CanvasProvider onChange={setLayers}>
			<canvas {...otherProps} ref={setCanvas} width={width} height={height}>
				{children}
			</canvas>
		</CanvasProvider>
	);
}
