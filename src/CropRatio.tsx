import React, { useRef } from 'react';
import useContainBox, { ResizeBoxRatio } from './containBox';
import Crop, { CropProps } from './Crop';
import { useCanvas } from './RenderProvider';

export interface CropRatioProps
	extends Omit<CropProps, 'left' | 'top' | 'width' | 'height'> {
	ratio: ResizeBoxRatio;
}

export default function CropRatio(props: CropRatioProps) {
	const { ratio, children } = props;
	const cropRef = useRef<HTMLCanvasElement | null>(null);
	cropRef.current = useCanvas() || null;

	const box = useContainBox(cropRef, ratio);

	return (
		<Crop left={box.left} top={box.top} width={box.width} height={box.height}>
			{children}
		</Crop>
	);
}
