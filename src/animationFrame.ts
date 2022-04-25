import { useEffect, useRef, useState } from 'react';

export type FrameFn = (frame: FrameFnInterface) => void;

function noop(): void {
	// noop
}

export type RenderFrame = () => void;

export interface FrameFnInterface {
	count: number;
	now: number;
	interval: number;
	fps: number;
}

function processFrames(frames: number[], now: number): number {
	// Purge old frames
	while (frames.length > 2 && frames[0] < now - 1000) {
		frames.shift();
	}

	const minFrameTime = Math.min(frames[0], now - 500);
	const fps = Math.round(((frames.length - 1) / (now - minFrameTime)) * 1000);

	return fps;
}

/**
 * Animation Frame Hook
 */
export default function useAnimationFrame(
	callback: FrameFn,
	play = true
): RenderFrame {
	const callbackRef = useRef<FrameFn>(callback);
	callbackRef.current = callback;

	const countRef = useRef<number>(0);
	const framesRef = useRef<number[]>([]);

	useEffect(() => {
		countRef.current = 0;
		framesRef.current = [];
	}, [countRef, framesRef]);

	const [renderFrame, setRenderFrame] = useState<() => void>(noop);

	useEffect(() => {
		let timer: number;

		const handleFrame = () => {
			const now = Date.now();

			cancelAnimationFrame(timer);
			if (play) {
				timer = requestAnimationFrame(handleFrame);
			}

			const interval = now - framesRef.current[framesRef.current.length - 1];
			framesRef.current.push(now);

			const fps = processFrames(framesRef.current, now);
			const count = countRef.current;
			countRef.current += 1;

			try {
				callbackRef.current({ count, now, interval, fps });
			} catch (e) {
				// Remove failed frame stats
				countRef.current -= 1;
				framesRef.current.pop();
			}
		};

		setRenderFrame(handleFrame);

		if (play) {
			handleFrame();
		}

		return () => {
			cancelAnimationFrame(timer);
		};
	}, [callbackRef, countRef, framesRef, play]);

	return renderFrame;
}
