import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import useAnimationFrame, { FrameFn, FrameFnInterface } from './animationFrame';
import Layer from './Layer';
import {
	CanvasBoxInterface,
	CanvasDrawInterface,
	RenderFn,
	RenderProvider,
	RenderProviderRef,
} from './RenderProvider';

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

	const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	canvasRef.current = canvas;

	const [renderer, setRenderer] = useState<RenderProviderRef | null>(null);
	const render = useMemo(() => renderer?.render || noop, [renderer]);

	const buffer = useMemo(
		(): HTMLCanvasElement => document.createElement('canvas'),
		[]
	);

	const handleRendered = useCallback(
		(canvasEl: HTMLCanvasElement): void => {
			buffer.width = canvasEl.width;
			buffer.height = canvasEl.height;
			const btx = buffer.getContext('2d');
			if (btx) {
				btx.clearRect(0, 0, buffer.width, buffer.height);
				btx.drawImage(canvasEl, 0, 0);
			}
		},
		[buffer]
	);
	const renderFrame = useAnimationFrame(render, play);

	// Render new canvas
	useEffect(() => {
		if (!canvas) return;
		renderFrame(true);
	}, [renderFrame, canvas]);

	const redrawBuffer = useCallback(() => {
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		switch (resizePlan) {
			case 'clear':
				break;
			case 'static':
				ctx.drawImage(buffer, 0, 0);
				break;
			case 'stretch':
				ctx.drawImage(buffer, 0, 0, canvas.width, canvas.height);
				break;
			case 'redrawsync':
				renderFrame(true);
				break;
			default:
		}
	}, [canvas, buffer, resizePlan, renderFrame]);

	// Render on resize
	useEffect(() => {
		if (!canvas) return noop;

		const resizeObserver = new ResizeObserver(() => {
			renderFrame(false);
			redrawBuffer();
		});
		resizeObserver.observe(canvas);

		return () => {
			resizeObserver.disconnect();
		};
	}, [canvas, redrawBuffer, renderFrame]);

	return (
		<canvas {...otherProps} ref={setCanvas} width={width} height={height}>
			{canvas && (
				<RenderProvider
					ref={setRenderer}
					canvas={canvas}
					box={box}
					onRendered={handleRendered}
				>
					{onDraw && <Layer onDraw={onDraw} />}
					{children}
				</RenderProvider>
			)}
		</canvas>
	);
}
