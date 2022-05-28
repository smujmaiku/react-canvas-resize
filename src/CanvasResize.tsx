/*!
 * React Canvas Resize <https://github.com/smujmaiku/react-canvas-resize>
 * Copyright(c) 2022 Michael Szmadzinski
 * MIT Licensed
 */

import React, { useRef, useEffect } from 'react';
import CanvasBase, { CanvasBaseTypeProps, HTMLCanvasProps } from './CanvasBase';
import useContainBox, { ResizeBoxRatio } from './containBox';
import { CanvasBoxInterface } from './RenderProvider';

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
	onResize?: (box: CanvasBoxInterface) => void;
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

	useEffect(() => {
		if (!onResize) return;
		onResize(box);
	}, [box, onResize]);

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
