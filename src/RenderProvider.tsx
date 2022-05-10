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

export interface CanvasBoxInterface {
	left: number;
	top: number;
	width: number;
	height: number;
	fullWidth: number;
	fullHeight: number;
	scale: number;
}

export interface CanvasDrawInterface extends FrameFnInterface {
	box: CanvasBoxInterface;
	canvas: HTMLCanvasElement;
}
export type OnDraw = (frame: CanvasDrawInterface) => void;
export type CanvasLayer = [draw: OnDraw, zIndex: number];

const boxContext = createContext<Partial<CanvasBoxInterface> | undefined>(
	undefined
);

export function useBox(): Partial<CanvasBoxInterface> | undefined {
	return useContext(boxContext);
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
	box?: Partial<CanvasBoxInterface>;
	onRendered?: RenderedFn;
	layers: CanvasLayer[];
}

export interface RenderProviderProps {
	canvas?: HTMLCanvasElement;
	box?: Partial<CanvasBoxInterface>;
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
	const { children, ...drawProps } = props;

	const [layers, setLayers] = useState<CanvasLayer[]>([]);

	const drawRefs = useRef<RenderDrawRefs>({ layers: [] });
	drawRefs.current = {
		...drawProps,
		layers,
	};

	const drawCanvas = useCallback(
		(opts: FrameFnInterface): void => {
			const {
				canvas,
				box,
				onRendered,
				layers: drawLayers,
			} = drawRefs.current || {};

			if (!canvas) {
				throw new Error('Canvas is not ready');
			}

			const orderedLayers = sortLayers(drawLayers);

			const frame: CanvasDrawInterface = {
				...opts,
				canvas,
				box: {
					left: 0,
					top: 0,
					width: canvas.width,
					height: canvas.height,
					scale: 1,
					...box,
					fullWidth: canvas.width,
					fullHeight: canvas.height,
				},
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
		<boxContext.Provider value={drawProps.box}>
			<LayerProvider onChange={setLayers}>{children}</LayerProvider>;
		</boxContext.Provider>
	);
});
