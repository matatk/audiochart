'use strict'
/* global PitchMapper FrequencyPitchMapper */

function mixinMinMax(Klass) {
	describe('Minimum and Maximum data', () => {
		const singleSeriesGood = [{
			minimumDatum: -4,
			maximumDatum: 2,
			minimumFrequency: 0,
			maximumFrequency: 100
		}]

		const singleSeriesBadData = [{
			minimumDatum: 2,
			maximumDatum: -4,
			minimumFrequency: 0,
			maximumFrequency: 100
		}]

		const singleSeriesBadFrequency = [{
			minimumDatum: -4,
			maximumDatum: 2,
			minimumFrequency: 100,
			maximumFrequency: 0
		}]

		const twoSeriesBad = [{
			minimumDatum: -4,
			maximumDatum: 2,
			minimumFrequency: 0,
			maximumFrequency: 100
		}, {
			minimumDatum: 100,
			maximumDatum: -100,
			minimumFrequency: 400,
			maximumFrequency: 800
		}]

		const twoSeriesGood = [{
			minimumDatum: -4,
			maximumDatum: 2,
			minimumFrequency: 0,
			maximumFrequency: 100
		}, {
			minimumDatum: -100,
			maximumDatum: 100,
			minimumFrequency: 400,
			maximumFrequency: 800
		}]

		it('throws when single series min datum > max datum', () => {
			expect(() => {
				new Klass(singleSeriesBadData)
			}).toThrow(Error('minimum datum should be <= maximum datum'))
		})

		it('throws when single series min frequency > max frequency', () => {
			expect(() => {
				new Klass(singleSeriesBadFrequency)
			}).toThrow(Error('minimum frequency should be <= maximum frequency'))
		})

		it("doesn't throw when single series data is good", () => {
			expect(() => {
				new Klass(singleSeriesGood)
			}).not.toThrow()
		})

		it("throws when there's an error with the second series' info", () => {
			expect(() => {
				new Klass(twoSeriesBad)
			}).toThrow()
		})

		it("doesn't throw when both series are OK", () => {
			expect(() => {
				new Klass(twoSeriesGood)
			}).not.toThrow()
		})
	})
}


describe('FrequencyPitchMapper', () => {
	mixinMinMax(FrequencyPitchMapper)

	describe('maps from input data to a frequency', () => {
		it('with data from 0 to 42 and frequencies from 0 to 1000', () => {
			const fm = new FrequencyPitchMapper([{
				minimumDatum: 0,
				maximumDatum: 42,
				minimumFrequency: 100,
				maximumFrequency: 1000
			}])

			expect(fm.map(0, 0)).toBe(100)
			expect(fm.map(0, 42)).toBe(1000)
			expect(fm.map(0, 21)).toBe(550)
		})

		it('with second series data from 0 to 42 and frequencies from 0 to 1000', () => {
			const fm = new FrequencyPitchMapper([{
				minimumDatum: 0,
				maximumDatum: 1,
				minimumFrequency: 0,
				maximumFrequency: 1
			}, {
				minimumDatum: 0,
				maximumDatum: 42,
				minimumFrequency: 100,
				maximumFrequency: 1000
			}])

			expect(fm.map(1, 0)).toBe(100)
			expect(fm.map(1, 42)).toBe(1000)
			expect(fm.map(1, 21)).toBe(550)
		})

		it('with data from 0 to 100 and frequencies from 0 to 100', () => {
			const fm = new FrequencyPitchMapper([{
				minimumDatum: 0,
				maximumDatum: 100,
				minimumFrequency: 0,
				maximumFrequency: 100
			}])

			expect(fm.map(0, 0)).toBe(0)
			expect(fm.map(0, 21)).toBe(21)
			expect(fm.map(0, 42)).toBe(42)
			expect(fm.map(0, 50)).toBe(50)
			expect(fm.map(0, 70)).toBe(70)
			expect(fm.map(0, 100)).toBe(100)
		})

		it('with data from 0 to 100 and frequencies from 1 to 101', () => {
			const fm = new FrequencyPitchMapper([{
				minimumDatum: 0,
				maximumDatum: 100,
				minimumFrequency: 1,
				maximumFrequency: 101
			}])

			expect(fm.map(0, 0)).toBe(1)
			expect(fm.map(0, 21)).toBe(22)
			expect(fm.map(0, 42)).toBe(43)
			expect(fm.map(0, 50)).toBe(51)
			expect(fm.map(0, 70)).toBe(71)
			expect(fm.map(0, 100)).toBe(101)
		})

		it('with data from -100 to 0 and frequencies from 0 to 100', () => {
			const fm = new FrequencyPitchMapper([{
				minimumDatum: -100,
				maximumDatum: 0,
				minimumFrequency: 0,
				maximumFrequency: 100
			}])

			expect(fm.map(0, -100)).toBe(0)
			expect(fm.map(0, -70)).toBe(30)
			expect(fm.map(0, -50)).toBe(50)
			expect(fm.map(0, -20)).toBe(80)
			expect(fm.map(0, 0)).toBe(100)
		})

		it('with data from -100 to 100 and frequencies from 0 to 100', () => {
			const fm = new FrequencyPitchMapper([{
				minimumDatum: -100,
				maximumDatum: 100,
				minimumFrequency: 0,
				maximumFrequency: 100
			}])

			expect(fm.map(0, -100)).toBe(0)
			expect(fm.map(0, -50)).toBe(25)
			expect(fm.map(0, 0)).toBe(50)
			expect(fm.map(0, 50)).toBe(75)
			expect(fm.map(0, 100)).toBe(100)
		})

		it('with data from 42 to 42 and frequencies from 0 to 100', () => {
			const fm = new FrequencyPitchMapper([{
				minimumDatum: 42,
				maximumDatum: 42,
				minimumFrequency: 0,
				maximumFrequency: 100
			}])

			expect(fm.map(0, 42)).toBe(50)
		})
	})
})
