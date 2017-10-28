'use strict'
/* global PitchMapper FrequencyPitchMapper */

const mixinMinMax = function(Klass, testMin, testMax) {
	describe('Minimum and Maximum data', () => {
		let obj = null

		beforeEach(() => {
			obj = new Klass(testMin, testMax)
		})

		it('stores a minimum data value [not for public use]', () => {
			expect(obj.minimumDatum).toBe(testMin)
		})

		it('stores a maximum data value [not for public use]', () => {
			expect(obj.maximumDatum).toBe(testMax)
		})

		it('will not allow min datum > max datum', () => {
			expect(() => {
				new Klass(testMax, testMin)
			}).toThrow()
		})
	})
}


describe('PitchMapper', () => {
	const MIN = -4
	const MAX = 2
	mixinMinMax(PitchMapper, MIN, MAX)
})


describe('FrequencyPitchMapper', () => {
	const MIN = 0
	const MAX = 42

	mixinMinMax(FrequencyPitchMapper, MIN, MAX)

	it('will not allow min frequency > max frequency', () => {
		expect(() => {
			new FrequencyPitchMapper(0, 42, MAX, MIN)
		}).toThrow()
	})

	describe('maps from input data to a frequency', () => {
		it('test range 1', () => {
			const fm = new FrequencyPitchMapper(0, 42, 100, 1000)
			expect(fm.map(0)).toBe(100)
			expect(fm.map(42)).toBe(1000)
			expect(fm.map(21)).toBe(550)
		})

		it('test range 2', () => {
			const fm = new FrequencyPitchMapper(0, 100, 0, 100)
			expect(fm.map(0)).toBe(0)
			expect(fm.map(21)).toBe(21)
			expect(fm.map(42)).toBe(42)
			expect(fm.map(50)).toBe(50)
			expect(fm.map(70)).toBe(70)
			expect(fm.map(100)).toBe(100)
		})

		it('test range 3', () => {
			const fm = new FrequencyPitchMapper(0, 100, 1, 101)
			expect(fm.map(0)).toBe(1)
			expect(fm.map(21)).toBe(22)
			expect(fm.map(42)).toBe(43)
			expect(fm.map(50)).toBe(51)
			expect(fm.map(70)).toBe(71)
			expect(fm.map(100)).toBe(101)
		})

		it('test range 4', () => {
			const fm = new FrequencyPitchMapper(-100, 0, 0, 100)
			expect(fm.map(-100)).toBe(0)
			expect(fm.map(-70)).toBe(30)
			expect(fm.map(-50)).toBe(50)
			expect(fm.map(-20)).toBe(80)
			expect(fm.map(0)).toBe(100)
		})

		it('test range 5', () => {
			const fm = new FrequencyPitchMapper(-100, 100, 0, 100)
			expect(fm.map(-100)).toBe(0)
			expect(fm.map(-50)).toBe(25)
			expect(fm.map(0)).toBe(50)
			expect(fm.map(50)).toBe(75)
			expect(fm.map(100)).toBe(100)
		})

		it('test range 6', () => {
			const fm = new FrequencyPitchMapper(42, 42, 0, 100)
			expect(fm.map(42)).toBe(50)
		})
	})
})
