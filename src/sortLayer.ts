import type { CanvasLayer } from './context';

export default function sortLayers(layers: CanvasLayer[]): CanvasLayer[] {
	return [...layers].sort(([, a], [, b]) => a - b);
}
