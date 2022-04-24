import { useEffect, useRef } from 'react';

export type FrameFn = (frame: FrameFnInterface) => void;

export interface FrameFnInterface {
	count: number;
	now: number;
	interval: number;
	fps: number;
}

/**
 * Animation Frame Hook
 */
export default function useAnimationFrame(callback: FrameFn): void {
	const callbackRef = useRef<FrameFn>(callback);
	callbackRef.current = callback;

	useEffect(() => {
		let timer: number;
		let count = 0;
		const frameTimes: number[] = [];

		const handleFrame = () => {
			const now = Date.now();
			const interval = now - frameTimes[frameTimes.length - 1];
			frameTimes.push(now);

			while (frameTimes.length > 2 && frameTimes[0] < now - 1000) {
				frameTimes.shift();
			}
			const minFrameTime = Math.min(frameTimes[0], now - 500);
			const fps = Math.round(
				((frameTimes.length - 1) / (now - minFrameTime)) * 1000
			);

			cancelAnimationFrame(timer);
			timer = requestAnimationFrame(handleFrame);

			try {
				callbackRef.current({ count, now, interval, fps });
				count += 1;
			} catch (e) {
				frameTimes.pop();
			}
		};

		handleFrame();

		return () => {
			cancelAnimationFrame(timer);
		};
	}, [callbackRef]);
}
