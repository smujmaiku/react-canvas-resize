import { useLayer } from './CanvasBase';
import { OnDraw } from './context';

export interface LayerProps {
	onDraw: OnDraw;
	zIndex?: number;
}

export default function Layer(props: LayerProps): null {
	const { onDraw, zIndex = 0 } = props;

	useLayer(onDraw, zIndex);

	return null;
}
