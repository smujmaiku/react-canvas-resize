import type { CanvasLayer } from './CanvasBase';

export default function sortLayers(layers: CanvasLayer[]): CanvasLayer[] {
	return [...layers].sort(([, a], [, b]) => a - b);
}
