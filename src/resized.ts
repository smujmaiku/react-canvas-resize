import { useEffect } from 'react';

const noop = () => {
	// noop;
};

export default function useResized<T extends HTMLElement>(
	element?: T | null,
	callback?: (element: T | null) => void
) {
	useEffect(() => {
		if (!callback) {
			return noop;
		}

		if (!element) {
			callback(null);
			return noop;
		}

		callback(element);
		const resizeObserver = new ResizeObserver(() => {
			callback(element);
		});
		resizeObserver.observe(element);

		return () => {
			resizeObserver.disconnect();
		};
	}, [element, callback]);
}
