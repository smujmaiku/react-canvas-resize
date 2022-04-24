import makeListProvider from 'make-list-provider';
import type { FrameFnInterface } from './animationFrame';

export interface CanvasBoxInterface {
	left: number;
	top: number;
	width: number;
	height: number;
	fullWidth: number;
	fullHeight: number;
	scale: number;
}

export interface CanvasDrawInterface extends FrameFnInterface {
	box: CanvasBoxInterface;
	canvas: HTMLCanvasElement;
}
export type OnDraw = (frame: CanvasDrawInterface) => void;
export type CanvasLayer = [draw: OnDraw, zIndex: number];

export const [CanvasProvider, useCanvasListing] =
	makeListProvider<CanvasLayer>();
