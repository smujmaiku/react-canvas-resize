/*!
 * React Canvas Resize <https://github.com/smujmaiku/react-canvas-resize>
 * Copyright(c) 2020 Michael Szmadzinski
 * MIT Licensed
 */

import React from 'react';
import PropTypes from 'prop-types';
import { containBox } from 'moremath-js';

class Canvas extends React.Component {
	constructor(props) {
		super(props);

		this.loopCount = -1;
		this.canvasRef = React.createRef();
	}

	componentWillUnmount() {
		cancelAnimationFrame(this.drawCanvasI);
		this.drawCanvasI = 'STOP';
	}

	drawCanvas() {
		const now = Date.now();

		cancelAnimationFrame(this.drawCanvasI);
		delete this.drawCanvasI;
		this.requestDrawCanvas();

		const {
			props,
			canvasRef,
			loopCount,
		} = this;

		const {
			onInit,
			onDraw,
		} = props;

		this.loopCount++;
		const canvas = canvasRef.current;

		if (!this.sentInit) {
			this.sentInit = true;
			onInit({
				canvas,
			});
		}

		onDraw({
			canvas,
			now,
			count: loopCount,
		});
	}

	requestDrawCanvas() {
		if (this.drawCanvasI) return;
		this.drawCanvasI = requestAnimationFrame(() => this.drawCanvas());
	}

	render() {
		this.requestDrawCanvas();

		const {
			props,
			canvasRef,
		} = this;

		const {
			width,
			height,
			onInit,
			onDraw,
			...otherProps
		} = props;

		return <canvas
			ref={canvasRef}
			width={width}
			height={height}
			{...otherProps}
		/>;
	}
}

Canvas.defaultProps = {
	onInit: () => {},
	onDraw: () => {},
};

Canvas.propTypes = {
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	onInit: PropTypes.func,
	onDraw: PropTypes.func,
};

class CanvasResize extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			left: 0,
			top: 0,
			width: 1,
			height: 1,
		};

		this.rootRef = React.createRef();
		this.canvasRef = React.createRef();
	}

	shouldComponentUpdate(props, state) {
		for (const key of ['left', 'top', 'width', 'height']) {
			if (this.state[key] !== state[key]) return true;
		}

		for (const key of Object.keys(props)) {
			if (this.props[key] !== props[key]) return true;
		}

		return false;
	}

	componentWillUnmount() {
		cancelAnimationFrame(this.drawCanvasI);
		this.drawCanvasI = 'STOP';
	}

	handleDraw(opts) {
		this.checkResize();

		this.props.onDraw(opts);
	}

	checkResize() {
		const { rootRef, props, state } = this;
		const { ratio, onResize } = props;

		const root = rootRef.current;
		if (!root) return;

		const { offsetWidth, offsetHeight } = root;

		const size = {
			left: 0,
			top: 0,
			width: offsetWidth,
			height: offsetHeight,
		};

		if (ratio.length === 2 && ratio.every(Boolean)) {
			[size.width, size.height] = containBox(
				ratio,
				[offsetWidth, offsetHeight],
			);
			size.left = (offsetWidth - size.width) / 2;
			size.top = (offsetHeight - size.height) / 2;

			for (const key of Object.keys(size)) {
				size[key] = Math.floor(size[key]);
			}
		}

		if (Object.entries(size).some(([key, value]) => value !== state[key])) {
			onResize({ ...size });
			this.setState(size);
		}
	}

	render() {
		const {
			props,
			state,
			rootRef,
			canvasRef,
		} = this;

		const {
			style,
			ratio,
			canvasProps,
			onInit,
			onResize,
			onDraw,
			...otherProps
		} = props;

		const {
			left,
			top,
			width,
			height,
		} = state;

		return <div
			ref={rootRef}
			style={{
				...style,
				padding: 0,
			}}
			{...otherProps}
		>
			<Canvas
				ref={canvasRef}
				style={{
					margin: 0,
					marginLeft: left,
					marginTop: top,
				}}
				width={width}
				height={height}
				onDraw={(opts) => this.handleDraw(opts)}
				{...canvasProps}
			/>
		</div>;
	}
}

CanvasResize.defaultProps = {
	style: {},
	canvasProps: {},
	ratio: [],
	onInit: () => {},
	onDraw: () => {},
	onResize: () => {},
};

CanvasResize.propTypes = {
	style: PropTypes.object,
	canvasProps: PropTypes.object,
	ratio: PropTypes.array,
	onInit: PropTypes.func,
	onDraw: PropTypes.func,
	onResize: PropTypes.func,
};

export default CanvasResize;

export {
	Canvas,
};
