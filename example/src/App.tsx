import React, { useState, useEffect, useCallback } from 'react';
import Canvas, { useLayer, Crop, Layer, CanvasDrawInterface } from 'react-canvas-resize';
import './App.css';

const COLORS = ['#F43', '#4F3', '#43F'];

function Fill({ color }: { color: string }): null {
	const handleDraw = useCallback(({ canvas, box }: CanvasDrawInterface): void => {
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error();

		const { width, height, } = box;

		ctx.save();

		ctx.fillStyle = color;
		ctx.fillRect(0, 0, width, height);

		ctx.restore();
	}, [color]);

	useLayer(handleDraw);
	return null;
}

function Stats(): JSX.Element {
	const handleDraw = useCallback(({ canvas, fps, interval, count, box }: CanvasDrawInterface): void => {
		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error();

		const {
			scale,
			width,
			height
		} = box;

		ctx.fillText(`fps: ${fps}`, 5, 15);
		ctx.fillText(`interval: ${interval}`, 5, 30);
		ctx.fillText(`count: ${count}`, 5, 45);
		ctx.fillText(`scale: ${scale.toFixed(2)}`, 5, 60);
		ctx.fillText(`size: ${width.toFixed(1)} x ${height.toFixed(1)}`, 5, 75);
	}, []);

	return <Layer onDraw={handleDraw} />;
}

function App(): JSX.Element {
	const [color, setColor] = useState<string>('#F43');

	useEffect(() => {
		let index = 0;
		const timer = setInterval(() => {
			index = (index + 1) % COLORS.length;
			setColor(COLORS[index]);
		}, 1000);

		return () => {
			clearInterval(timer);
		}
	}, []);

	const handleDraw = useCallback(({ canvas, now, fps, interval, box }: CanvasDrawInterface): void => {
		const {
			width,
			height,
			left,
			top,
			fullWidth,
			fullHeight,
			scale,
		} = box;

		// Limit FPS to 20
		// if(interval < 1000 / 20) throw new Error();

		const ctx = canvas.getContext('2d');
		if (!ctx) throw new Error();
		ctx.clearRect(0, 0, fullWidth, fullHeight);

		ctx.save();

		ctx.translate(left, top);
		ctx.strokeStyle = '#111';
		ctx.strokeRect(2, 2, width - 4, height - 4)

		ctx.restore();

		ctx.save();

		const sx = Math.cos((now) / 300) * 4 * scale;
		const sy = Math.sin((now) / 120) * 4 * scale;
		const ex = Math.cos((now + 100) / 300) * 4 * scale;
		const ey = Math.sin((now + 100) / 120) * 4 * scale;

		ctx.translate(left + width / 2, top + height / 2);
		ctx.lineWidth = scale;
		ctx.strokeStyle = color;
		ctx.beginPath();
		ctx.moveTo(sx, sy);
		ctx.lineTo(ex, ey);
		ctx.stroke();

		ctx.restore();
	}, [color]);

	const [play, setPlay] = useState(true);
	const togglePlay = useCallback(() => {
		setPlay(v => !v);
	}, []);

	return (
		<div className="App">
			<Canvas
				play={play}
				onClick={togglePlay}
				className="canvas-wrap"
				ratio="16x9"
				resizePlan="static"
				onResize={console.log}
				onDraw={handleDraw}
				canvasProps={{
					className: "canvas"
				}}
				fillCanvas
			>
				<Stats />
				<Crop
					left={110}
					top={10}
					width={120}
					height={90}
					zIndex={99}
				>
					<Fill color="#CCC" />
					<Stats />
				</Crop>
			</Canvas>
		</div>
	);
}

export default App;
