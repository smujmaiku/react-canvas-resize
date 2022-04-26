/*!
 * React Canvas Resize <https://github.com/smujmaiku/react-canvas-resize>
 * Copyright(c) 2022 Michael Szmadzinski
 * MIT Licensed
 */

import React, { useRef, useEffect } from 'react';
import CanvasBase, {
	CanvasBaseTypeProps,
	HTMLCanvasProps,
	ResizePlanT,
} from './CanvasBase';
import useContainBox, { ResizeBoxRatio } from './containBox';
import { CanvasBoxInterface } from './context';

export type HTMLDivProps = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>;

export type CanvasResizeTypeProps = Omit<
	CanvasBaseTypeProps,
	'width' | 'height' | 'box'
>;

export interface CanvasResizeProps extends CanvasResizeTypeProps, HTMLDivProps {
	canvasProps?: HTMLCanvasProps;
	ratio?: ResizeBoxRatio;
	resizePlan?: ResizePlanT;
	onResize?: (box: CanvasBoxInterface) => void;
	fillCanvas?: boolean;
}

/**
 * Resizing Canvas React Element
 */
export default function CanvasResize(props: CanvasResizeProps): JSX.Element {
	const {
		canvasProps = {},
		play,
		ratio = 1,
		resizePlan,
		onInit,
		onDraw,
		onResize,
		fillCanvas,
		children,
		...divProps
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
			{...divProps}
			ref={rootRef}
			style={{
				...divProps.style,
				padding: 0,
				overflow: 'hidden',
			}}
		>
			<CanvasBase
				{...canvasProps}
				style={{
					...canvasProps.style,
					margin: 0,
					marginLeft: left,
					marginTop: top,
				}}
				width={width}
				height={height}
				box={box}
				play={play}
				resizePlan={resizePlan}
				onInit={onInit}
				onDraw={onDraw}
			>
				{children}
			</CanvasBase>
		</div>
	);
}

export { default as CanvasBase } from './CanvasBase';
export { default as Layer, useLayer } from './Layer';
export { default as Crop } from './Crop';
export { default as useAnimationFrame } from './animationFrame';
export { default as useContainBox, containBox } from './containBox';
export { CanvasDrawInterface } from './context';
