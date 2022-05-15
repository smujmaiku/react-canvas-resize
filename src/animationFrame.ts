import { useCallback, useEffect, useRef } from 'react';

const noop = () => {
	// noop
};

export interface FrameFnInterface {
	count: number;
	now: number;
	interval: number;
	fps: number;
}

export type FrameFn = (frame: FrameFnInterface) => void;

function processFrames(frames: number[], now: number): number {
	// Purge old frames
	while (frames.length > 2 && frames[0] < now - 1000) {
		frames.shift();
	}

	const minFrameTime = Math.min(frames[0], now - 500);
	const fps = Math.round(((frames.length - 1) / (now - minFrameTime)) * 1000);

	return fps;
}

export type RenderFrame = (sync?: boolean) => void;

/**
 * Animation Frame Hook
 */
export default function useAnimationFrame(
	callback: FrameFn,
	play = true
): RenderFrame {
	const callbackRef = useRef<FrameFn>(callback);
	callbackRef.current = callback;

	const playRef = useRef<boolean>(false);
	playRef.current = Boolean(play);

	const timerRef = useRef<number>(-1);
	const countRef = useRef<number>(0);
	const framesRef = useRef<number[]>([]);

	useEffect(() => {
		countRef.current = 0;
		framesRef.current = [];
	}, [countRef, framesRef]);

	const handleRender = useCallback(() => {
		const now = Date.now();

		cancelAnimationFrame(timerRef.current);
		if (playRef.current) {
			timerRef.current = requestAnimationFrame(handleRender);
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
	}, []);

	const renderFrame = useCallback(
		(sync = false) => {
			cancelAnimationFrame(timerRef.current);
			if (sync) {
				handleRender();
			} else {
				timerRef.current = requestAnimationFrame(handleRender);
			}
		},
		[handleRender]
	);

	// Handle play change
	useEffect(() => {
		if (!play) return noop;

		renderFrame(true);

		return () => {
			cancelAnimationFrame(timerRef.current);
		};
	}, [renderFrame, play]);

	return renderFrame;
}
