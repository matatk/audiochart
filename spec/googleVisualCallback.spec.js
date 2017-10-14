'use strict'
/* global googleVisualCallbackMaker */

describe('googleVisualCallback', function() {
	class FakeChart {
		setSelection() {}
	}

	let fakeChart = null
	let googleVisualCallback = null

	beforeEach(function() {
		fakeChart = new FakeChart()
		googleVisualCallback = googleVisualCallbackMaker(fakeChart)
		spyOn(fakeChart, 'setSelection')
	})

	it('correctly munges its parameters (1a)', function() {
		googleVisualCallback(0, 0)
		expect(fakeChart.setSelection).toHaveBeenCalledWith([
			{
				'row': 0,
				'column': 1
			}
		])
	})

	it('correctly munges its parameters (1b)', function() {
		googleVisualCallback(0, 1)
		expect(fakeChart.setSelection).toHaveBeenCalledWith([
			{
				'row': 1,
				'column': 1
			}
		])
	})

	it('correctly munges its parameters (1c)', function() {
		googleVisualCallback(0, 2)
		expect(fakeChart.setSelection).toHaveBeenCalledWith([
			{
				'row': 2,
				'column': 1
			}
		])
	})

	it('correctly munges its parameters (2)', function() {
		googleVisualCallback(1, 0)
		expect(fakeChart.setSelection).toHaveBeenCalledWith([
			{
				'row': 0,
				'column': 2
			}
		])
	})
})
