import type { CanvasLayer } from './RenderProvider';

export default function sortLayers(layers: CanvasLayer[]): CanvasLayer[] {
	return [...layers].sort(([, a], [, b]) => a - b);
}
