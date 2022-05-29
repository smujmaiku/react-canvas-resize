import { useCallback, useState } from 'react';
import useAnimationFrame from './animationFrame';

export type ResizeBoxRatio = number | string | number[];

/**
 * Reduces a box inside a container
 * smujmaiku/moremath-js<https://github.com/smujmaiku/moremath-js>
 */
export function containBox(box: number[], container: number[]): number[] {
	if (container.length < 2) return container;

	const scales = container.map((v, i) => v / box[i]);
	const scale = scales.reduce((a, b) => Math.min(a, b));
	return box.map((v) => v * scale);
}

export interface ContainBoxInterface {
	left: number;
	top: number;
	width: number;
	height: number;
}

/**
 * Contained box based on ref hook
 */
export default function useContainBox(
	ref: React.RefObject<HTMLElement>,
	ratio: ResizeBoxRatio
): ContainBoxInterface {
	let ratioX = 1;
	let ratioY = 1;

	if (typeof ratio === 'number') {
		ratioX = ratio;
	} else if (typeof ratio === 'string') {
		[ratioX = 1, ratioY = 1] = ratio
			.split(/[x:/]/)
			.map((v: string) => parseInt(v, 10));
	} else if (ratio instanceof Array) {
		[ratioX = 1, ratioY = 1] = ratio as number[];
	}

	const [box, setBox] = useState<ContainBoxInterface>({
		left: 0,
		top: 0,
		width: 1,
		height: 1,
	});

	const checkResize = useCallback((): void => {
		const root = ref.current;
		if (!root) return;

		const { offsetWidth, offsetHeight } = root;

		const newBox: ContainBoxInterface = {
			left: 0,
			top: 0,
			width: offsetWidth,
			height: offsetHeight,
		};

		[newBox.width, newBox.height] = containBox(
			[ratioX, ratioY],
			[offsetWidth, offsetHeight]
		);
		newBox.left = Math.floor((offsetWidth - newBox.width) / 2);
		newBox.top = Math.floor((offsetHeight - newBox.height) / 2);
		newBox.width = Math.floor(newBox.width);
		newBox.height = Math.floor(newBox.height);

		setBox((orig: ContainBoxInterface): ContainBoxInterface => {
			if (
				newBox.width === orig.width &&
				newBox.height === orig.height &&
				newBox.left === orig.left &&
				newBox.top === orig.top
			) {
				return orig;
			}
			return newBox;
		});
	}, [ratioX, ratioY, ref]);

	useAnimationFrame(checkResize);

	return box;
}
