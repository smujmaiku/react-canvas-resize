import React, { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import Canvas, { ResizedCanvasDrawInterface } from 'react-canvas-resize';
import './App.css';

const COLORS = ['#F43', '#4F3', '#43F'];

function App() {
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

	const handleDraw = useCallback(({ canvas, now, fps, interval, box }: ResizedCanvasDrawInterface): void => {
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

		ctx.fillText(`fps: ${fps}`, 10, 20)
		ctx.fillText(`interval: ${interval}`, 10, 35)
		ctx.fillText(`scale: ${scale.toFixed(2)}`, 10, 50)
	}, [color]);

	return (
		<div className="App">
			<Canvas
				className="canvas-wrap"
				ratio="16x9"
				onResize={console.log}
				onDraw={handleDraw}
				canvasProps={{
					className: "canvas"
				}}
				fillCanvas
			/>
		</div>
	);
}

export default App;
