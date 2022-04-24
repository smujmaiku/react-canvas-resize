import type { OnDraw } from './CanvasBase';

export interface LayerProps {
	onDraw: OnDraw;
	zIndex?: number;
}

export function Layer(props: LayerProps): null {
	const { onDraw, zIndex = 0 } = props;

	useLayer(onDraw, zIndex);

	return null;
}
