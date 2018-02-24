'use strict'
/* global c3VisualCallbackMaker */

describe('c3VisualCallback', () => {
	class FakeChart {
		select(ids, indices, resetOthers) {}
	}

	let fakeChart = null
	let c3VisualCallback = null

	beforeEach(() => {
		fakeChart = new FakeChart()
		c3VisualCallback = c3VisualCallbackMaker(fakeChart)
		spyOn(fakeChart, 'select')
	})

	it('asks for the first datum in all series', () => {
		c3VisualCallback(0)
		expect(fakeChart.select).toHaveBeenCalledWith(
			null,
			[0],
			true
		)
	})

	it('asks for the second datum in all series', () => {
		c3VisualCallback(1)
		expect(fakeChart.select).toHaveBeenCalledWith(
			null,
			[1],
			true
		)
	})
})
