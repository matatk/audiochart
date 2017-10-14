'use strict'
/* global c3VisualCallbackMaker */

describe('c3VisualCallback', function() {
	class FakeChart {
		select(ids, indices, resetOthers) {}
	}

	let fakeChart = null
	let c3VisualCallback = null

	beforeEach(function() {
		fakeChart = new FakeChart()
		c3VisualCallback = c3VisualCallbackMaker(fakeChart)
		spyOn(fakeChart, 'select')
	})

	it('asks for the first datum in the first series', () => {
		// FIXME filter to series 1
		c3VisualCallback(0, 0)
		expect(fakeChart.select).toHaveBeenCalledWith(
			null,
			[0],
			true
		)
	})

	it('asks for the second datum in the first series', () => {
		// FIXME filter to series 1
		c3VisualCallback(0, 1)
		expect(fakeChart.select).toHaveBeenCalledWith(
			null,
			[1],
			true
		)
	})

	it('asks for the first datum in the second series', () => {
		// FIXME this test is borked; won't select series two
		c3VisualCallback(1, 0)
		expect(fakeChart.select).toHaveBeenCalledWith(
			null,
			[0],
			true
		)
	})
})
