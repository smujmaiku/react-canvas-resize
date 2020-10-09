import React from 'react';
import Canvas from 'react-canvas-resize';
import './App.css';

function handleDraw({canvas, now, fps, interval}) {
	const {
		width,
		height,
	} = canvas;

	// Limit FPS
	// if(interval < 1000 / 20) throw new Error();

	const ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, width, height);

	const scale = Math.min(width, height)
	const sx = Math.cos((now) / 300) * scale / 2.1;
	const sy = Math.sin((now) / 120) * scale / 2.1;
	const ex = Math.cos((now + 100) / 300) * scale / 2.1;
	const ey = Math.sin((now + 100) / 120) * scale / 2.1;

	ctx.clearRect(0, 0, width, height);

	ctx.save();

	ctx.translate(width / 2, height / 2);
	ctx.lineWidth = scale / 20;
	ctx.strokeStyle = '#F43';
	ctx.beginPath();
	ctx.moveTo(sx, sy);
	ctx.lineTo(ex, ey);
	ctx.stroke();

	ctx.restore();

	ctx.fillText(`fps: ${fps}`, 10,20)
	ctx.fillText(`interval: ${interval}`, 10,35)
}

function App() {
	return (
		<div className="App">
			<Canvas
				className="canvas-wrap"
				ratio={[16,9]}
				onResize={console.log}
				onDraw={handleDraw}
				canvasProps={{
					className: "canvas"
				}}
			/>
		</div>
	);
}

export default App;
