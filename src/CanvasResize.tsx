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

interface CanvasBoxInterface {
	left: number;
	top: number;
	width: number;
	height: number;
};

interface CanvasResizeProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	canvasProps?: CanvasProps;
	ratio: number[];
	onInit?: (canvas: HTMLCanvasElement) => void;
	onDraw?: (frame: FrameFnProps) => void;
	onResize?: (box: CanvasBoxInterface) => void;
}

/**
 * Resizing Canvas React Element
 */
export default function CanvasResize(props: CanvasResizeProps) {
	const {
		canvasProps,
		ratio,
		onInit,
		onDraw,
		onResize,
		style,
		...otherProps
	} = props;

	const [box, setBox] = useState<CanvasBoxInterface>({
		left: 0,
		top: 0,
		width: 1,
		height: 1,
	});

	const rootRef = useRef<HTMLDivElement>(null);

	const checkResize = useCallback(() => {
		const root = rootRef.current;
		if (!root) return;

		const { offsetWidth, offsetHeight } = root;

		const newBox: CanvasBoxInterface = {
			left: 0,
			top: 0,
			width: offsetWidth,
			height: offsetHeight,
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
			if (onResize) {
				onResize(newBox);
			}
			return newBox;
		});
	}, [ratio, rootRef, onResize]);

	useAnimationFrame(checkResize);

	return <div
		{...otherProps}
		ref={rootRef}
		style={{
			...style,
			padding: 0,
		}}
	>
		<Canvas
			{...canvasProps}
			style={{
				...(canvasProps?.style || {}),
				margin: 0,
				marginLeft: box.left,
				marginTop: box.top,
			}}
			width={box.width}
			height={box.height}
			onInit={onInit}
			onDraw={onDraw}
		/>
	</div>;
}
