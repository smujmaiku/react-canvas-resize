/*!
 * React Canvas Resize <https://github.com/smujmaiku/react-canvas-resize>
 * Copyright(c) 2021 Michael Szmadzinski
 * MIT Licensed
 */

import React, { useRef, useEffect } from 'react';
import CanvasBase, {
	CanvasBoxInterface,
	CanvasDrawInterface,
} from './CanvasBase';
import useContainBox, { ResizeBoxRatio } from './containBox';

export interface CanvasResizeProps extends HTMLDivProps {
	canvasProps?: HTMLCanvasProps;
	ratio?: ResizeBoxRatio;
	onInit?: (canvas: HTMLCanvasElement) => void;
	onDraw?: (frame: CanvasDrawInterface) => void;
	onResize?: (box: CanvasBoxInterface) => void;
	fillCanvas?: boolean;
	style?: HTMLDivProps['style'];
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

	return (
		<div
			{...otherProps}
			ref={rootRef}
			style={{
				...style,
				padding: 0,
				overflow: 'hidden',
			}}
		>
			<CanvasBase
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
			</CanvasBase>
		</div>
	);
}
