# React Canvas Resize

A canvas wrapper to resize and handle drawing

## Installation

`npm i smujmaiku/react-canvas-resize`

## Examples

### ES6

Babel with `import`

```jsx
import React from 'react';
import CanvasResize from 'react-canvas-resize';

const App = (props) => {
	return <CanvasResize
		style={{
			height: 100,
			width: 100,
		}}
		ratio={[4, 3]}
		onDraw={handleDraw}
	>;
};
```

## License

Copyright (c) 2020, Michael Szmadzinski. (MIT License)
