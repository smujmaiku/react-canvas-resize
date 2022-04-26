import { useMemo } from 'react';
import { CanvasLayer, OnDraw, useCanvasListing } from './context';

export function useLayer(onDraw: OnDraw, zIndex = 0 as number): void {
	const listing = useMemo(
		(): CanvasLayer => [onDraw, zIndex],
		[onDraw, zIndex]
	);
	useCanvasListing(listing);
}

export interface LayerProps {
	onDraw: OnDraw;
	zIndex?: number;
}

export default function Layer(props: LayerProps): null {
	const { onDraw, zIndex = 0 } = props;

	useLayer(onDraw, zIndex);

	return null;
}
