const React = require('react');
const CanvasResize = require('./CanvasResize');

describe('CanvasResize', () => {
	it('Should canvas', () => {
		expect(<CanvasResize/>).toEqual(expect.any(React.Component));
	});
});
