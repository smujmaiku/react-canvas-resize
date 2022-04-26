import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import useAnimationFrame from './animationFrame';
import {
	CanvasBoxInterface,
	CanvasDrawInterface,
	CanvasLayer,
	CanvasProvider,
} from './context';
import Layer from './Layer';

import sortLayers from './sortLayer';

const noop = () => {
	// noop;
};

export type HTMLCanvasProps = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLCanvasElement>,
	HTMLCanvasElement
>;

export type ResizePlanT = 'clear' | 'static' | 'stretch' | 'redrawsync';

export interface CanvasBaseTypeProps {
	width: number;
	height: number;
	play?: boolean;
	box?: CanvasBoxInterface;
	resizePlan?: ResizePlanT;
	onInit?: (canvas: HTMLCanvasElement) => void;
	onDraw?: (frame: CanvasDrawInterface) => void;
}

export interface CanvasBaseProps extends HTMLCanvasProps, CanvasBaseTypeProps {
	// Just extend
}

/**
 * Canvas React Element
 */
export default function CanvasBase(props: CanvasBaseProps): JSX.Element {
	const {
		width,
		height,
		play,
		box,
		resizePlan = 'stretch',
		onInit,
		onDraw,
		children,
		...otherProps
	} = props;

	const [canvasEl, setCanvas] = useState<HTMLCanvasElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	canvasRef.current = canvasEl;

	const buffer = useMemo(
		(): HTMLCanvasElement => document.createElement('canvas'),
		[]
	);

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

			const orderedLayers = sortLayers(layers);

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

			buffer.width = canvas.width;
			buffer.height = canvas.height;
			const btx = buffer.getContext('2d');
			if (btx) {
				btx.clearRect(0, 0, buffer.width, buffer.height);
				btx.drawImage(canvas, 0, 0);
			}
		},
		[box, canvasRef, onInit, layers, buffer]
	);

	const renderFrame = useAnimationFrame(drawCanvas, play);

	// Render new canvas
	useEffect(() => {
		renderFrame(true);
	}, [renderFrame, canvasEl]);

	const redrawBuffer = useCallback(() => {
		if (!canvasEl) return;

		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		switch (resizePlan) {
			case 'clear':
				break;
			case 'static':
				ctx.drawImage(buffer, 0, 0);
				break;
			case 'stretch':
				ctx.drawImage(buffer, 0, 0, canvasEl.width, canvasEl.height);
				break;
			case 'redrawsync':
				renderFrame(true);
				break;
			default:
		}
	}, [canvasEl, buffer, resizePlan, renderFrame]);

	// Render on resize
	useEffect(() => {
		if (!canvasEl) return noop;

		const resizeObserver = new ResizeObserver(() => {
			renderFrame(false);
			redrawBuffer();
		});
		resizeObserver.observe(canvasEl);

		return () => {
			resizeObserver.disconnect();
		};
	}, [canvasEl, redrawBuffer, renderFrame]);

	return (
		<CanvasProvider onChange={setLayers}>
			<canvas {...otherProps} ref={setCanvas} width={width} height={height}>
				{onDraw && <Layer onDraw={onDraw} />}
				{children}
			</canvas>
		</CanvasProvider>
	);
}
