/*!
 * React Canvas Resize <https://github.com/smujmaiku/react-canvas-resize>
 * Copyright(c) 2020 Michael Szmadzinski
 * MIT Licensed
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Reduces a box inside a container
 * smujmaiku/moremath-js<https://github.com/smujmaiku/moremath-js>
 */
export function containBox(box: number[], container: number[]): number[] {
	if (container.length < 2) return container;

	const scales = container.map((v, i) => v / box[i]);
	const scale = scales.reduce((a, b) => Math.min(a, b));
	return box.map(v => v * scale);
};

interface FrameFnProps {
	count: number;
	now: number;
	interval: number;
	fps: number;
}

/**
 * Animation Frame Hook
 */
export function useAnimationFrame(fn: (frame: FrameFnProps) => void): void {
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
				fn({ count, now, interval, fps });
				count++;
			} catch (e) {
				frameTimes.pop();
			}
		};

		handleFrame();

		return () => {
			cancelAnimationFrame(timer);
		};
	}, [fn]);
}

interface CanvasBoxInterface {
	left: number;
	top: number;
	width: number;
	height: number;
	fullWidth: number;
	fullHeight: number;
};

/**
 * Contained box based on ref hook
 */
export function useContainBox(ref: React.MutableRefObject<HTMLElement>, ratio: number[]) {
	const [box, setBox] = useState<CanvasBoxInterface>({
		left: 0,
		top: 0,
		width: 1,
		height: 1,
		fullWidth: 1,
		fullHeight: 1,
	});

	const checkResize = useCallback(() => {
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
		};

		if (ratio.length === 2 && ratio.every(Boolean)) {
			[newBox.width, newBox.height] = containBox(
				ratio,
				[offsetWidth, offsetHeight],
			);
			newBox.left = Math.floor((offsetWidth - newBox.width) / 2);
			newBox.top = Math.floor((offsetHeight - newBox.height) / 2);
			newBox.width = Math.floor(newBox.width);
			newBox.height = Math.floor(newBox.height);
		}

		setBox((orig: CanvasBoxInterface) => {
			if (newBox.width === orig.width && newBox.height === orig.height &&
				newBox.left === orig.left && newBox.top === orig.top) {
				return orig;
			}
			return newBox;
		});
	}, [ratio, ref]);

	useAnimationFrame(checkResize);

	return box;
}

interface CanvasProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement> {
	width: number;
	height: number;
	onInit?: (canvas: HTMLCanvasElement) => void;
	onDraw?: (frame: FrameFnProps) => void;
}

/**
 * Canvas React Element
 */
export function Canvas(props: CanvasProps) {
	const {
		width,
		height,
		onInit,
		onDraw,
		...otherProps
	} = props;

	const canvasRef = useRef<HTMLCanvasElement>(null);

	const drawCanvas = useCallback((opts) => {
		const { count } = opts;

		const canvas = canvasRef.current;
		if (!canvas) {
			throw new Error('Canvas is not ready');
		}

		if (count === 0 && onInit) {
			onInit(canvas);
		}

		if (onDraw) {
			onDraw({
				canvas,
				...opts,
			});
		}
	}, [canvasRef, onInit, onDraw]);

	useAnimationFrame(drawCanvas);

	return <canvas
		{...otherProps}
		ref={canvasRef}
		width={width}
		height={height}
	/>;
};

interface ResizedFrameFnProps extends FrameFnProps {
	box: CanvasBoxInterface;
}

interface CanvasResizeProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	canvasProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLCanvasElement>, HTMLCanvasElement>;
	ratio: number[];
	onInit?: (canvas: HTMLCanvasElement) => void;
	onDraw?: (frame: ResizedFrameFnProps) => void;
	onResize?: (box: CanvasBoxInterface) => void;
	fillCanvas?: boolean;
}

/**
 * Resizing Canvas React Element
 */
export default function CanvasResize(props: CanvasResizeProps) {
	const {
		canvasProps = {},
		ratio,
		onInit,
		onDraw,
		onResize,
		fillCanvas,
		style = {},
		...otherProps
	} = props;

	const rootRef = useRef<HTMLDivElement>(null);

	const box = useContainBox(rootRef, ratio);

	useEffect(() => {
		if (!onResize) return;
		onResize(box);
	}, [box, onResize]);

	const handleDraw = useCallback((frame: FrameFnProps) => {
		onDraw({
			...frame,
			box,
		})
	}, [box]);

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
			onInit={onInit}
			onDraw={handleDraw}
		/>
	</div>;
}
