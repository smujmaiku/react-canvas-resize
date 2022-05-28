import React, { useRef } from 'react';
import useContainBox, { ResizeBoxRatio } from './containBox';
import Crop, { CropProps } from './Crop';

export interface CropRatioProps
	extends Omit<CropProps, 'left' | 'top' | 'width' | 'height'> {
	ratio: ResizeBoxRatio;
}

export default function CropRatio(props: CropRatioProps) {
	const { ratio, children } = props;
	const cropRef = useRef<HTMLCanvasElement>(null);

	const box = useContainBox(cropRef, ratio);

	return (
		<Crop
			ref={cropRef}
			left={box.left}
			top={box.left}
			width={box.left}
			height={box.left}
		>
			{children}
		</Crop>
	);
}
