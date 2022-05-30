# React Canvas Resize

Do you use a lot of canvas but find it difficult in React?
Is tracking resizing elements causing your canvas to stretch?
Do you want to maintain a ratio for your canvas scene?

React Canvas Resize makes canvases easy!

## Installation

`npm i react-canvas-resize`

## Usage

More examples on [Github Pages][gh-pages]

### Basic

```jsx
import React from 'react';
import CanvasResize from 'react-canvas-resize';

const App = () => {
	const handleDraw = ({ canvas }) => {
		// Do your stuff here
	}

	return (
		<CanvasResize
			play
			ratio={[4, 3]}
			onDraw={handleDraw}
			style={{
				height: 100,
				width: 100,
			}}
		/>
	);
};
```

### Layer

`Layer` allows for stages of drawing and multiple callbacks of the onDraw function.
Each `Layer` will be called in child order starting with the `CanvasBase.onDraw`.

```jsx
return (
	<CanvasBase
		onDraw={handleDraw}
	>
		<Layer onDraw={handleLayer1} />
		<Layer onDraw={handleLayer2} />
	</CanvasBase>
);
```

### Crop

`Crop` will create a subframe canvas that will limit any children to a smaller area.

```jsx
return (
	<CanvasBase
		onDraw={handleDraw}
		width={50}
		height={50}
	>
		<Crop left={10} top={10} width={20} height={20}>
			<Layer onDraw={handleLayer} />
		</Crop>
	</CanvasBase>
);
```

## License

Copyright (c) 2022, Michael Szmadzinski. (MIT License)


[gh-pages]: https://smujmaiku.github.io/react-canvas-resize/