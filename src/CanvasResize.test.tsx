import React from 'react';

describe('CanvasResize', () => {
	const CanvasResize = require('./CanvasResize');
	it('Should canvas', () => {
		expect(<CanvasResize />).toEqual(expect.any(React.Component));
	});
});
