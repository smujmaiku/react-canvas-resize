import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
	useLayer,
	RenderProvider,
	OnDraw,
	RenderProviderRef,
	CanvasDrawInterface,
} from './RenderProvider';

const noop = () => {
	// noop
};

export interface FrameProps {
	canvas: HTMLCanvasElement;
	onPreDraw?: OnDraw;
	onDraw: OnDraw;
	zIndex?: number;
	children?: React.ReactNode;
}

interface FrameCbRefs {
	onPreDraw?: OnDraw;
	onDraw?: OnDraw;
}

export default function Frame(props: FrameProps): JSX.Element {
	const { canvas, onPreDraw, onDraw, zIndex = 0, children } = props;

	const [renderer, setRenderer] = useState<RenderProviderRef | null>(null);
	const render = useMemo(() => renderer?.render || noop, [renderer]);

	const cbRefs = useRef<FrameCbRefs>({});
	cbRefs.current = { onPreDraw, onDraw };

	const handleDraw = useCallback(
		(frame: CanvasDrawInterface) => {
			cbRefs.current.onPreDraw?.(frame);
			render(frame);
			cbRefs.current.onDraw?.(frame);
		},
		[cbRefs, render]
	);

	useLayer(handleDraw, zIndex);

	return (
		<RenderProvider ref={setRenderer} canvas={canvas}>
			{children}
		</RenderProvider>
	);
}
