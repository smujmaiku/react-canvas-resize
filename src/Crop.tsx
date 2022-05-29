import React, {
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
} from 'react';
import Frame from './Frame';
import {
	CanvasBoxInterface,
	CanvasDrawInterface,
	useBox,
} from './RenderProvider';

export interface CropProps {
	left: number;
	top: number;
	width: number;
	height: number;
	zIndex?: number;
	children?: React.ReactNode;
}

export const Crop = React.forwardRef((props: CropProps, ref): JSX.Element => {
	const { left, top, width, height, zIndex = 0, children } = props;

	const buffer = useMemo(
		(): HTMLCanvasElement => document.createElement('canvas'),
		[]
	);

	useImperativeHandle(ref, () => buffer, [buffer]);

	useEffect(() => {
		buffer.width = width;
		buffer.height = height;
	}, [buffer, width, height]);

	const parentBox = useBox();
	const box: Partial<CanvasBoxInterface> = useMemo(
		() => ({
			...parentBox,
			left: (parentBox?.left || 0) + left,
			top: (parentBox?.top || 0) + top,
			width,
			height,
		}),
		[parentBox, left, top, width, height]
	);

	const handlePreDraw = useCallback(
		(frame: CanvasDrawInterface): void => {
			const { canvas } = frame;

			const btx = buffer.getContext('2d');
			if (!btx) return;

			btx.clearRect(0, 0, buffer.width, buffer.height);
			btx.drawImage(canvas, -left, -top);
		},
		[buffer, left, top]
	);

	const handleDraw = useCallback(
		(frame: CanvasDrawInterface): void => {
			const { canvas } = frame;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			ctx.drawImage(buffer, left, top);
		},
		[buffer, left, top]
	);

	return (
		<Frame
			canvas={buffer}
			onPreDraw={handlePreDraw}
			onDraw={handleDraw}
			zIndex={zIndex}
			box={box}
		>
			{children}
		</Frame>
	);
});

export default Crop;
