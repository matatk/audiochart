'use strict'
/* exported dataWrappersTestCore */

function dataWrappersTestCore(thing, wrapper1, wrapper2, wrapper3) {
	describe(thing + ' (via common interface)', () => {
		describe('when storing positive-valued data', () => {
			let data = null
			beforeEach(() => {
				data = wrapper1
			})

			it('can get the number of series', () => {
				expect(data.numSeries()).toBe(1)
			})

			it('can get series names', () => {
				expect(data.seriesNames()).toEqual(['Test'])
			})

			it('can get the min and max value of data in a series', () => {
				expect(data.seriesMin(0)).toBe(2)
				expect(data.seriesMax(0)).toBe(4)
			})

			it('can get values of data in a series', () => {
				expect(data.seriesValue(0, 0)).toBe(2)
				expect(data.seriesValue(0, 1)).toBe(3)
				expect(data.seriesValue(0, 2)).toBe(3)
				expect(data.seriesValue(0, 3)).toBe(4)
			})

			it('gets the length of a series', () => {
				expect(data.seriesLength(0)).toBe(4)
			})
		})

		describe('when storing negative-valued data', () => {
			let data = null
			beforeEach(() => {
				data = wrapper2
			})

			it('can get the number of series', () => {
				expect(data.numSeries()).toBe(1)
			})

			it('can get series names', () => {
				expect(data.seriesNames()).toEqual(['Test'])
			})

			it('can get the min and max value of data in a series', () => {
				expect(data.seriesMin(0)).toBe(-90)
				expect(data.seriesMax(0)).toBe(20)
			})

			it('can get values of data in a series', () => {
				expect(data.seriesValue(0, 0)).toBe(20)
				expect(data.seriesValue(0, 1)).toBe(-10)
				expect(data.seriesValue(0, 2)).toBe(0)
				expect(data.seriesValue(0, 3)).toBe(8)
				expect(data.seriesValue(0, 4)).toBe(-90)
			})

			it('gets the length of a series', () => {
				expect(data.seriesLength(0)).toBe(5)
			})
		})

		describe('when storing two-series data', () => {
			let data = null
			beforeEach(() => {
				data = wrapper3
			})

			it('can get the number of series', () => {
				expect(data.numSeries()).toBe(2)
			})

			it('can get series names', () => {
				expect(data.seriesNames()).toEqual(['Test1', 'Test2'])
			})

			it('can get the min and max value of data in each series', () => {
				expect(data.seriesMin(0)).toBe(-90)
				expect(data.seriesMax(0)).toBe(20)

				expect(data.seriesMin(1)).toBe(-42)
				expect(data.seriesMax(1)).toBe(72)
			})

			it('can get values of data in a series', () => {
				expect(data.seriesValue(0, 0)).toBe(20)
				expect(data.seriesValue(0, 1)).toBe(-10)
				expect(data.seriesValue(0, 2)).toBe(0)
				expect(data.seriesValue(0, 3)).toBe(8)
				expect(data.seriesValue(0, 4)).toBe(-90)

				expect(data.seriesValue(1, 0)).toBe(42)
				expect(data.seriesValue(1, 1)).toBe(72)
				expect(data.seriesValue(1, 2)).toBe(-42)
				expect(data.seriesValue(1, 3)).toBe(-8)
				expect(data.seriesValue(1, 4)).toBe(0)
			})

			it('gets the length of a series', () => {
				expect(data.seriesLength(0)).toBe(5)

				expect(data.seriesLength(1)).toBe(5)
			})
		})
	})
}
