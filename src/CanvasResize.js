/*!
 * React Canvas Resize <https://github.com/smujmaiku/react-canvas-resize>
 * Copyright(c) 2020 Michael Szmadzinski
 * MIT Licensed
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Reduces a box inside a container
 * @param {Array} box
 * @param {Array} container
 * @param {Function?} reducer
 * @returns {Array}
 */
function containBox(box, container, reducer = Math.min) {
	if (container.length < 2) return container;

	const scales = container.map((v, i) => v / box[i]);
	const scale = scales.reduce((a, b) => reducer(a, b));
	return box.map(v => v * scale);
};

/**
 * Animation Frame Hook
 * @param {Function} fn
 */
export function useAnimationFrame(fn) {
	useEffect(() => {
		let timer;
		let count = 0;
		const frameTimes = [];

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

export function Canvas(props) {
	const {
		width,
		height,
		onInit,
		onDraw,
		...otherProps
	} = props;

	const canvasRef = useRef();

	const drawCanvas = useCallback((opts) => {
		const { count } = opts;

		const canvas = canvasRef.current;
		if (!canvas) {
			throw new Error('Canvas is not ready');
		}

		if (count === 0 && onInit) {
			onInit({
				canvas,
			});
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
		ref={canvasRef}
		width={width}
		height={height}
		{...otherProps}
	/>;
}

Canvas.defaultProps = {
	onInit: undefined,
	onDraw: undefined,
};

Canvas.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	onInit: PropTypes.func,
	onDraw: PropTypes.func,
};

export default function CanvasResize(props) {
	const {
		style,
		canvasProps,
		ratio,
		onInit,
		onDraw,
		onResize,
		...otherProps
	} = props;

	const [size, setSize] = useState({
		left: 0,
		top: 0,
		width: 1,
		height: 1,
	});

	const rootRef = useRef();
	const canvasRef = useRef();

	const checkResize = useCallback(() => {
		const root = rootRef.current;
		if (!root) return;

		const { offsetWidth, offsetHeight } = root;

		const size = {
			left: 0,
			top: 0,
			width: offsetWidth,
			height: offsetHeight,
		};

		if (ratio.length === 2 && ratio.every(Boolean)) {
			[size.width, size.height] = containBox(
				ratio,
				[offsetWidth, offsetHeight],
			);
			size.left = (offsetWidth - size.width) / 2;
			size.top = (offsetHeight - size.height) / 2;

			for (const key of Object.keys(size)) {
				size[key] = Math.floor(size[key]);
			}
		}

		setSize(orig => {
			if (Object.entries(size).some(([key, value]) => value !== orig[key])) {
				onResize({ ...size });
				return size;
			} else {
				return orig;
			}
		});
	}, [ratio, rootRef, onResize]);

	useAnimationFrame(checkResize);

	return <div
		ref={rootRef}
		style={{
			...style,
			padding: 0,
		}}
		{...otherProps}
	>
		<Canvas
			ref={canvasRef}
			style={{
				margin: 0,
				marginLeft: size.left,
				marginTop: size.top,
			}}
			width={size.width}
			height={size.height}
			onInit={onInit}
			onDraw={onDraw}
			{...canvasProps}
		/>
	</div>;
}

CanvasResize.defaultProps = {
	style: {},
	canvasProps: {},
	ratio: [],
	onInit: () => {},
	onDraw: () => {},
	onResize: () => {},
};

CanvasResize.propTypes = {
	style: PropTypes.object,
	canvasProps: PropTypes.object,
	ratio: PropTypes.array,
	onInit: PropTypes.func,
	onDraw: PropTypes.func,
	onResize: PropTypes.func,
};
