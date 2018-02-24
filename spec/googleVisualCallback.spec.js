'use strict'
/* global googleVisualCallbackMaker */

describe('googleVisualCallback', () => {
	class FakeChart {
		setSelection() {}
	}

	let fakeChart = null
	let googleVisualCallback = null

	beforeEach(() => {
		fakeChart = new FakeChart()
		googleVisualCallback = googleVisualCallbackMaker(fakeChart)
		spyOn(fakeChart, 'setSelection')
	})

	it('correctly munges its parameters for the first datum', () => {
		googleVisualCallback(0)
		expect(fakeChart.setSelection).toHaveBeenCalledWith([{'row': 0}])
	})

	it('correctly munges its parameters for the second datum', () => {
		googleVisualCallback(1)
		expect(fakeChart.setSelection).toHaveBeenCalledWith([{'row': 1 }])
	})
})
