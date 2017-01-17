'use strict'

var dataWrappersTestCore = function(thing, wrapper1, wrapper2) {
	describe(thing + ' (via common interface)', function() {
		describe('when storing positive-valued data', function() {
			var data = null
			beforeEach(function() {
				data = wrapper1
			})

			it('can get the number of series', function() {
				expect(data.numSeries()).toBe(1)
			})

			it('can get series names', function() {
				expect(data.seriesNames()).toEqual(['Test'])
			})

			it('can get the min and max value of data in a series', function() {
				expect(data.seriesMin(0)).toBe(2)
				expect(data.seriesMax(0)).toBe(4)
			})

			it('can get values of data in a series', function() {
				expect(data.seriesValue(0, 0)).toBe(2)
				expect(data.seriesValue(0, 1)).toBe(3)
				expect(data.seriesValue(0, 2)).toBe(3)
				expect(data.seriesValue(0, 3)).toBe(4)
			})

			it('gets the length of a series', function() {
				expect(data.seriesLength(0)).toBe(4)
			})
		})

		describe('when storing negative-valued data', function() {
			var data = null
			beforeEach(function() {
				data = wrapper2
			})

			it('can get the number of series', function() {
				expect(data.numSeries()).toBe(1)
			})

			it('can get series names', function() {
				expect(data.seriesNames()).toEqual(['Test'])
			})

			it('can get the min and max value of data in a series', function() {
				expect(data.seriesMin(0)).toBe(-90)
				expect(data.seriesMax(0)).toBe(20)
			})

			it('can get values of data in a series', function() {
				expect(data.seriesValue(0, 0)).toBe(20)
				expect(data.seriesValue(0, 1)).toBe(-10)
				expect(data.seriesValue(0, 2)).toBe(0)
				expect(data.seriesValue(0, 3)).toBe(8)
				expect(data.seriesValue(0, 4)).toBe(-90)
			})

			it('gets the length of a series', function() {
				expect(data.seriesLength(0)).toBe(5)
			})
		})
	})
}
