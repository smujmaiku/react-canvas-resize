import makeListProvider from 'make-list-provider';
import React, {
	createContext,
	useContext,
	useCallback,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import sortLayers from './sortLayer';

import type { FrameFnInterface } from './animationFrame';
import useResized from './resized';

export interface CanvasDrawInterface extends FrameFnInterface {
	canvas: HTMLCanvasElement;
}
export type OnDraw = (frame: CanvasDrawInterface) => void;
export type CanvasLayer = [draw: OnDraw, zIndex: number];

const canvasContext = createContext<HTMLCanvasElement | undefined>(undefined);

export function useCanvas(): HTMLCanvasElement | undefined {
	return useContext(canvasContext);
}

const [LayerProvider, useLayerListing] = makeListProvider<CanvasLayer>();

export function useLayer(onDraw: OnDraw, zIndex = 0 as number): void {
	const listing = useMemo(
		(): CanvasLayer => [onDraw, zIndex],
		[onDraw, zIndex]
	);
	useLayerListing(listing);
}

export type RenderedFn = (canvas: HTMLCanvasElement) => void;
export type RenderFn = (opts: FrameFnInterface) => void;

interface RenderDrawRefs {
	canvas?: HTMLCanvasElement;
	onRendered?: RenderedFn;
	layers: CanvasLayer[];
}

export type ResizeFn = (canvas: HTMLCanvasElement | null) => void;

export interface RenderProviderProps {
	onResize?: ResizeFn;
	canvas?: HTMLCanvasElement;
	onRendered?: RenderedFn;
	children?: React.ReactNode;
}

export interface RenderProviderRef {
	render: RenderFn;
}

export const RenderProvider = React.forwardRef<
	RenderProviderRef,
	RenderProviderProps
>((props, ref) => {
	const { onResize, children, ...drawProps } = props;

	const [layers, setLayers] = useState<CanvasLayer[]>([]);

	const drawRefs = useRef<RenderDrawRefs>({ layers: [] });
	drawRefs.current = {
		...drawProps,
		layers,
	};

	useResized(drawProps.canvas, onResize);

	const drawCanvas = useCallback(
		(opts: FrameFnInterface): void => {
			const { canvas, onRendered, layers: drawLayers } = drawRefs.current || {};

			if (!canvas) {
				throw new Error('Canvas is not ready');
			}

			const orderedLayers = sortLayers(drawLayers);

			const frame: CanvasDrawInterface = {
				...opts,
				canvas,
			};

			for (const [draw] of orderedLayers) {
				draw(frame);
			}

			onRendered?.(canvas);
		},
		[drawRefs]
	);

	useImperativeHandle(ref, () => ({ render: drawCanvas }), [drawCanvas]);

	return (
		<canvasContext.Provider value={drawProps.canvas}>
			<LayerProvider onChange={setLayers}>{children}</LayerProvider>;
		</canvasContext.Provider>
	);
});
