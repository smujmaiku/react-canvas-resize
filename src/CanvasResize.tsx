/*!
 * React Canvas Resize <https://github.com/smujmaiku/react-canvas-resize>
 * Copyright(c) 2021 Michael Szmadzinski
 * MIT Licensed
 */

import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import justObservable from 'just-observable';
import makeListProvider from 'make-list-provider';

const [CanvasProvider, useCanvasListing] = makeListProvider<CanvasLayer>();

/**
 * Reduces a box inside a container
 * smujmaiku/moremath-js<https://github.com/smujmaiku/moremath-js>
 */
export function containBox(box: number[], container: number[]): number[] {
	if (container.length < 2) return container;

	const scales = container.map((v, i) => v / box[i]);
	const scale = scales.reduce((a, b) => Math.min(a, b));
	return box.map(v => v * scale);
}

export type OnDraw = (frame: CanvasDrawInterface) => void;
export type CanvasLayer = [draw: OnDraw, zIndex: number];

export type FrameFn = (frame: FrameFnInterface) => void;

export interface FrameFnInterface {
	count: number;
	now: number;
	interval: number;
	fps: number;
}

function sortLayers(layers: CanvasLayer[]): CanvasLayer[] {
	return [...layers].sort(([, a], [, b]) => a - b)
}

/**
 * Animation Frame Hook
 */
export function useAnimationFrame(callback: FrameFn): void {
	// Allow callback to change without resetting useEffect.
	const frameObservable = useMemo(() => justObservable<FrameFnInterface>(), []);
	useEffect(() => {
		return frameObservable.subscribe(callback);
	}, [frameObservable, callback])

	useEffect(() => {
		let timer: number;
		let count = 0;
		const frameTimes: number[] = [];

		const handleFrame = () => {
			const now = Date.now();
			const interval = now - frameTimes[frameTimes.length - 1];
			frameTimes.push(now);

			while (frameTimes.length > 2 && frameTimes[0] < now - 1000) {
				frameTimes.shift();
			}
			const minFrameTime = Math.min(frameTimes[0], now - 500);
			const fps = Math.round((frameTimes.length - 1) / (now - minFrameTime) * 1000);

			cancelAnimationFrame(timer);
			timer = requestAnimationFrame(handleFrame);

			try {
				frameObservable.next({ count, now, interval, fps });
				count++;
			} catch (e) {
				frameTimes.pop();
			}
		};

		handleFrame();

		return () => {
			cancelAnimationFrame(timer);
		};
	}, [frameObservable]);
}

export type ResizeBoxRatio = number | string | number[];

export interface CanvasBoxInterface {
	left: number;
	top: number;
	width: number;
	height: number;
	fullWidth: number;
	fullHeight: number;
	scale: number;
}

/**
 * Contained box based on ref hook
 */
export function useContainBox(ref: React.RefObject<HTMLElement>, ratio: ResizeBoxRatio): CanvasBoxInterface {
	let ratioX = 1;
	let ratioY = 1;

	if (typeof ratio === 'number') {
		ratioX = ratio;
	} else if (typeof ratio === 'string') {
		[ratioX = 1, ratioY = 1] = ratio.split(/[x:\/]/).map((v: string) => parseInt(v));
	} else if (ratio instanceof Array) {
		[ratioX = 1, ratioY = 1] = ratio as number[];
	}

	const [box, setBox] = useState<CanvasBoxInterface>({
		left: 0,
		top: 0,
		width: 1,
		height: 1,
		fullWidth: 1,
		fullHeight: 1,
		scale: 1,
	});

	const checkResize = useCallback((): void => {
		const root = ref.current;
		if (!root) return;

		const { offsetWidth, offsetHeight } = root;

		const newBox: CanvasBoxInterface = {
			left: 0,
			top: 0,
			width: offsetWidth,
			height: offsetHeight,
			fullWidth: offsetWidth,
			fullHeight: offsetHeight,
			scale: 1,
		};

		[newBox.width, newBox.height] = containBox(
			[ratioX, ratioY],
			[offsetWidth, offsetHeight],
		);
		newBox.left = Math.floor((offsetWidth - newBox.width) / 2);
		newBox.top = Math.floor((offsetHeight - newBox.height) / 2);
		newBox.width = Math.floor(newBox.width);
		newBox.height = Math.floor(newBox.height);
		newBox.scale = newBox.width / ratioX;

		setBox((orig: CanvasBoxInterface): CanvasBoxInterface => {
			if (newBox.width === orig.width && newBox.height === orig.height &&
				newBox.left === orig.left && newBox.top === orig.top) {
				return orig;
			}
			return newBox;
		});
	}, [ratioX, ratioY, ref]);

	useAnimationFrame(checkResize);

	return box;
}

export interface CanvasDrawInterface extends FrameFnInterface {
	box: CanvasBoxInterface;
	canvas: HTMLCanvasElement;
}

export interface CanvasProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement> {
	width: number;
	height: number;
	box?: CanvasBoxInterface;
	onInit?: (canvas: HTMLCanvasElement) => void;
	onDraw?: (frame: CanvasDrawInterface) => void;
}

/**
 * Canvas React Element
 */
export function Canvas(props: CanvasProps): JSX.Element {
	const {
		width,
		height,
		box,
		onInit,
		onDraw,
		children,
		...otherProps
	} = props;

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [layers, setLayers] = useState<CanvasLayer[]>([]);

	const drawCanvas = useCallback((opts): void => {
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
		}
		for (const [draw] of orderedLayers) {
			draw(frame);
		}
	}, [box, canvasRef, onInit, onDraw, layers]);

	useAnimationFrame(drawCanvas);

	return (
		<CanvasProvider onChange={setLayers}>
			<canvas
				{...otherProps}
				ref={canvasRef}
				width={width}
				height={height}
			>
				{children}
			</canvas>
		</CanvasProvider>
	);
}

export interface CanvasResizeProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	canvasProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
	ratio?: ResizeBoxRatio;
	onInit?: (canvas: HTMLCanvasElement) => void;
	onDraw?: (frame: CanvasDrawInterface) => void;
	onResize?: (box: CanvasBoxInterface) => void;
	fillCanvas?: boolean;
}

/**
 * Resizing Canvas React Element
 */
export default function CanvasResize(props: CanvasResizeProps): JSX.Element {
	const {
		canvasProps = {},
		ratio = 1,
		onInit,
		onDraw,
		onResize,
		fillCanvas,
		style = {},
		children,
		...otherProps
	} = props;

	const rootRef = useRef<HTMLDivElement>(null);

	const box = useContainBox(rootRef, ratio);

	useEffect(() => {
		if (!onResize) return;
		onResize(box);
	}, [box, onResize]);

	const width = fillCanvas ? box.fullWidth : box.width;
	const height = fillCanvas ? box.fullHeight : box.height;
	const left = fillCanvas ? 0 : box.left;
	const top = fillCanvas ? 0 : box.top;

	return <div
		{...otherProps}
		ref={rootRef}
		style={{
			...style,
			padding: 0,
			overflow: 'hidden',
		}}
	>
		<Canvas
			{...canvasProps}
			style={{
				...(canvasProps.style || {}),
				margin: 0,
				marginLeft: left,
				marginTop: top,
			}}
			width={width}
			height={height}
			box={box}
			onInit={onInit}
			onDraw={onDraw}
		>
			{children}
		</Canvas>
	</div>;
}

export interface CropProps {
	left: number;
	top: number;
	width: number;
	height: number;
	zIndex?: number;
	children?: React.ReactNode;
}

export function Crop(props: CropProps): JSX.Element {
	const {
		left,
		top,
		width,
		height,
		zIndex = 0,
		children,
	} = props;

	const buffer = useMemo((): HTMLCanvasElement => document.createElement('canvas'), []);
	const [layers, setLayers] = useState<CanvasLayer[]>([]);

	useEffect(() => {
		buffer.width = width - left;
		buffer.height = height - top;
	}, [buffer, left, top, width, height])

	const handleDraw = useCallback((frame: CanvasDrawInterface): void => {
		const {
			box,
			canvas,
		} = frame;

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
	}, [buffer, left, top, width, height, layers]);

	useLayer(handleDraw, zIndex);

	return (
		<>
			<CanvasProvider onChange={setLayers}>
				{children}
			</CanvasProvider>
		</>
	);
}

export function useLayer(onDraw: OnDraw, zIndex = 0 as number): void {
	useCanvasListing(useMemo((): CanvasLayer => ([
		onDraw,
		zIndex,
	]), [onDraw, zIndex]));
}

export interface LayerProps {
	onDraw: OnDraw;
	zIndex?: number;
}

export function Layer(props: LayerProps): null {
	const {
		onDraw,
		zIndex = 0,
	} = props;

	useLayer(onDraw, zIndex);

	return null;
}
