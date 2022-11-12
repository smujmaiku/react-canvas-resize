import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import useAnimationFrame from './animationFrame';
import Layer from './Layer';
import {
	CanvasDrawInterface,
	RenderProvider,
	RenderProviderRef,
	ResizeFn,
} from './RenderProvider';

const noop = () => {
	// noop;
};

export type HTMLCanvasProps = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLCanvasElement>,
	HTMLCanvasElement
>;

export type ResizePlanT = 'clear' | 'static' | 'stretch' | 'redrawsync';
export type InitFn = (canvas: HTMLCanvasElement) => void;
export type DrawFn = (frame: CanvasDrawInterface) => void;

export interface CanvasBaseTypeProps {
	play?: boolean;
	resizePlan?: ResizePlanT;
	onInit?: InitFn;
	onDraw?: DrawFn;
	onResize?: ResizeFn;
}

type SafeCanvasProps = Omit<
	HTMLCanvasProps,
	keyof CanvasBaseTypeProps | 'height' | 'width'
>;
export interface CanvasBaseProps extends SafeCanvasProps, CanvasBaseTypeProps {
	height?: number | string | undefined;
	width?: number | string | undefined;
}

/**
 * Canvas React Element
 */
export default function CanvasBase(props: CanvasBaseProps): JSX.Element {
	const {
		play = false,
		resizePlan = 'stretch',
		onResize,
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

	const [width, setWidth] = useState(0);
	const [height, setHeight] = useState(0);

	// Render on resize
	const handleResize = useCallback(
		(element) => {
			if (!canvas) return;

			setWidth(canvas.offsetWidth);
			setHeight(canvas.offsetHeight);
			renderFrame(false);
			redrawBuffer();

			if (onResize) {
				onResize(element);
			}
		},
		[canvas, renderFrame, redrawBuffer, onResize]
	);

	return (
		<canvas width={width} height={height} {...otherProps} ref={setCanvas}>
			{canvas && (
				<RenderProvider
					ref={setRenderer}
					onResize={handleResize}
					canvas={canvas}
					onRendered={handleRendered}
				>
					{onDraw && <Layer onDraw={onDraw} />}
					{children}
				</RenderProvider>
			)}
		</canvas>
	);
}
