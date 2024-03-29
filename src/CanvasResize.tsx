/*!
 * React Canvas Resize <https://github.com/smujmaiku/react-canvas-resize>
 * Copyright(c) 2022 Michael Szmadzinski
 * MIT Licensed
 */

import React, { useRef } from 'react';
import CanvasBase, { CanvasBaseTypeProps, HTMLCanvasProps } from './CanvasBase';
import useContainBox, { ResizeBoxRatio } from './containBox';

export type CanvasResizeTypeProps = Omit<
	CanvasBaseTypeProps,
	'width' | 'height'
>;

export type HTMLDivProps = React.DetailedHTMLProps<
	React.HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>;

type SafeDivProps = Omit<
	HTMLDivProps,
	keyof CanvasResizeTypeProps | 'canvasProps' | 'ratio'
>;

export interface CanvasResizeProps extends SafeDivProps, CanvasResizeTypeProps {
	canvasProps?: HTMLCanvasProps;
	ratio?: ResizeBoxRatio;
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
		children,
		...divProps
	} = props;

	const rootRef = useRef<HTMLDivElement>(null);
	const box = useContainBox(rootRef, ratio);

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
					marginLeft: box.left,
					marginTop: box.top,
				}}
				width={box.width}
				height={box.height}
				play={play}
				resizePlan={resizePlan}
				onInit={onInit}
				onDraw={onDraw}
				onResize={onResize}
			>
				{children}
			</CanvasBase>
		</div>
	);
}
