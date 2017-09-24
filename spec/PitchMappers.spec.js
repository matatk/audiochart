'use strict'

const mixinMinMax = function(Klass, testMin, testMax) {
	describe('Minimum and Maximum data', function() {
		let obj = null

		beforeEach(function() {
			obj = new Klass(testMin, testMax)
		})

		it('stores a minimum data value [not for public use]', function() {
			expect(obj.minimumDatum).toBe(testMin)
		})

		it('stores a maximum data value [not for public use]', function() {
			expect(obj.maximumDatum).toBe(testMax)
		})

		it('will not allow min datum > max datum', function() {
			expect(function() {
				new Klass(testMax, testMin)
			}).toThrow()
		})
	})
}


describe('PitchMapper', function() {
	const MIN = -4
	const MAX = 2
	mixinMinMax(window.PitchMapper, MIN, MAX)
})


describe('FrequencyPitchMapper', function() {
	const MIN = 0
	const MAX = 42

	mixinMinMax(window.FrequencyPitchMapper, MIN, MAX)

	it('will not allow min frequency > max frequency', function() {
		expect(function() {
			new window.FrequencyPitchMapper(0, 42, MAX, MIN)
		}).toThrow()
	})

	describe('maps from input data to a frequency', function() {
		it('test range 1', function() {
			const fm = new window.FrequencyPitchMapper(0, 42, 100, 1000)
			expect(fm.map(0)).toBe(100)
			expect(fm.map(42)).toBe(1000)
			expect(fm.map(21)).toBe(550)
		})

		it('test range 2', function() {
			const fm = new window.FrequencyPitchMapper(0, 100, 0, 100)
			expect(fm.map(0)).toBe(0)
			expect(fm.map(21)).toBe(21)
			expect(fm.map(42)).toBe(42)
			expect(fm.map(50)).toBe(50)
			expect(fm.map(70)).toBe(70)
			expect(fm.map(100)).toBe(100)
		})

		it('test range 3', function() {
			const fm = new window.FrequencyPitchMapper(0, 100, 1, 101)
			expect(fm.map(0)).toBe(1)
			expect(fm.map(21)).toBe(22)
			expect(fm.map(42)).toBe(43)
			expect(fm.map(50)).toBe(51)
			expect(fm.map(70)).toBe(71)
			expect(fm.map(100)).toBe(101)
		})

		it('test range 4', function() {
			const fm = new window.FrequencyPitchMapper(-100, 0, 0, 100)
			expect(fm.map(-100)).toBe(0)
			expect(fm.map(-70)).toBe(30)
			expect(fm.map(-50)).toBe(50)
			expect(fm.map(-20)).toBe(80)
			expect(fm.map(0)).toBe(100)
		})

		it('test range 5', function() {
			const fm = new window.FrequencyPitchMapper(-100, 100, 0, 100)
			expect(fm.map(-100)).toBe(0)
			expect(fm.map(-50)).toBe(25)
			expect(fm.map(0)).toBe(50)
			expect(fm.map(50)).toBe(75)
			expect(fm.map(100)).toBe(100)
		})

		it('test range 6', function() {
			const fm = new window.FrequencyPitchMapper(42, 42, 0, 100)
			expect(fm.map(42)).toBe(50)
		})
	})
})
