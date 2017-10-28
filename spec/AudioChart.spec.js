'use strict'
/* global AudioChart JSONDataWrapper GoogleDataWrapper HTMLTableDataWrapper googleVisualCallbackMaker htmlTableVisualCallbackMaker */

describe('AudioChart', () => {
	it('throws with a message if Web Audio API is unsupported', () => {
		spyOn(window, 'getAudioContext').and.returnValue(null)

		expect(() => {
			new AudioChart({})
		}).toThrow(
			Error("Sorry, your browser doesn't support the Web Audio API.")
		)
	})

	describe('options checking', () => {
		it('throws when an errant `options.type` is supplied', () => {
			const options = {
				type: 'moo',
				duration: 42,
				frequencyLow: 0,
				frequencyHigh: 0
			}

			expect(() => {
				AudioChart._checkOptions(options)
			}).toThrow(Error("Invalid data type 'moo' given."))
		})

		it('throws when a duration is not given', () => {
			const options = {
				type: 'moo'
			}

			expect(() => {
				AudioChart._checkOptions(options)
			}).toThrow(Error('No duration given'))
		})

		it('throws when a minimum frequency is not given', () => {
			const options = {
				type: 'moo',
				duration: 42
			}

			expect(() => {
				AudioChart._checkOptions(options)
			}).toThrow(Error('No minimum frequency given'))
		})

		it('throws when a maximum frequency is not given', () => {
			const options = {
				type: 'moo',
				duration: 42,
				frequencyLow: 0
			}

			expect(() => {
				AudioChart._checkOptions(options)
			}).toThrow(Error('No maximum frequency given'))
		})

		it('requires `data` to be specified with Google charts', () => {
			const options = {
				type: 'google',
				duration: 42,
				frequencyLow: 0,
				frequencyHigh: 0
			}

			expect(() => {
				AudioChart._checkOptions(options)
			}).toThrow(Error("Options must include a 'data' key"))
		})

		it('requires `data` to be specified with C3 charts', () => {
			const options = {
				type: 'c3',
				duration: 42,
				frequencyLow: 0,
				frequencyHigh: 0
			}

			expect(() => {
				AudioChart._checkOptions(options)
			}).toThrow(Error("Options must include a 'data' key"))
		})

		it('requires `data` to be specified with JSON data', () => {
			const options = {
				type: 'json',
				duration: 42,
				frequencyLow: 0,
				frequencyHigh: 0
			}

			expect(() => {
				AudioChart._checkOptions(options)
			}).toThrow(Error("Options must include a 'data' key"))
		})

		it('accepts when `data` is specified', () => {
			const options = {
				type: 'google',
				data: {},
				duration: 42,
				frequencyLow: 0,
				frequencyHigh: 0
			}

			expect(() => {
				AudioChart._checkOptions(options)
			}).not.toThrow()
		})

		it('requires `table` to be specified for HTML tables', () => {
			const options = {
				type: 'htmlTable',
				duration: 42,
				frequencyLow: 0,
				frequencyHigh: 0
			}

			expect(() => {
				AudioChart._checkOptions(options)
			}).toThrow(Error("Options must include a 'table' key"))
		})
	})

	describe('data wrapper and callback creation', () => {
		it('assigns a JSON data wrapper, parameter and no callback', () => {
			const options = {
				'type': 'json',
				'data': 42
			}

			expect(AudioChart._assignWrapperCallback(options))
				.toEqual({
					'Wrapper': JSONDataWrapper,
					'parameter': 42,
					'callback': null
				})
		})

		it('assigns a Google wrapper and parameter without a chart', () => {
			const options = {
				'type': 'google',
				'data': 42
			}

			expect(AudioChart._assignWrapperCallback(options))
				.toEqual({
					'Wrapper': GoogleDataWrapper,
					'parameter': 42,
					'callback': null
				})
		})

		it('assigns a Google wrapper, parameter and chart callback', () => {
			const fakeChart = {}

			const options = {
				'type': 'google',
				'data': 42,
				'chart': fakeChart
			}

			spyOn(window, 'googleVisualCallbackMaker').and.returnValue(42)

			expect(AudioChart._assignWrapperCallback(options))
				.toEqual({
					'Wrapper': GoogleDataWrapper,
					'parameter': 42,
					'callback': 42
				})

			expect(googleVisualCallbackMaker).toHaveBeenCalledWith(fakeChart)
		})

		it('assigns a HTML data wrapper, parameter and no callback', () => {
			const options = {
				'type': 'htmlTable',
				'table': 42
			}

			expect(AudioChart._assignWrapperCallback(options))
				.toEqual({
					'Wrapper': HTMLTableDataWrapper,
					'parameter': 42,
					'callback': null
				})
		})

		it('assigns a HTML data wrapper, parameter and callback', () => {
			const options = {
				'type': 'htmlTable',
				'table': 42,
				'highlightClass': 'moo'
			}

			spyOn(window, 'htmlTableVisualCallbackMaker').and.returnValue(42)

			expect(AudioChart._assignWrapperCallback(options))
				.toEqual({
					'Wrapper': HTMLTableDataWrapper,
					'parameter': 42,
					'callback': 42
				})

			expect(htmlTableVisualCallbackMaker)
				.toHaveBeenCalledWith(42, 'moo')
		})
	})

	describe('options updating', () => {
		const jsonDummyData = {
			data: [
				{
					series: 'test',
					values: [0, 1, 2]
				}
			]
		}

		it('allows us to see the current options', () => {
			const options = {
				type: 'json',
				data: jsonDummyData,
				duration: 42,
				frequencyLow: 0,
				frequencyHigh: 1
			}

			const ac = new AudioChart(options)

			expect(ac.options).toBe(options)
		})

		it("won't let us change options by editng the returned object", () => {
			const initOptions = {
				type: 'json',
				data: jsonDummyData,
				duration: 42,
				frequencyLow: 0,
				frequencyHigh: 1
			}

			const ac = new AudioChart(initOptions)
			const acOptions = ac.options
			expect(() => acOptions.type = 'moo').toThrow()
		})

		it("won't let us add options by editng the returned object", () => {
			const initOptions = {
				type: 'json',
				data: jsonDummyData,
				duration: 42,
				frequencyLow: 0,
				frequencyHigh: 1
			}

			const ac = new AudioChart(initOptions)
			const acOptions = ac.options
			expect(() => acOptions.moo = 42).toThrow()
		})

		it('throws when no new options are given', () => {
			const ac = new AudioChart({
				type: 'json',
				data: jsonDummyData,
				duration: 42,
				frequencyLow: 0,
				frequencyHigh: 1
			})

			expect(() => {
				ac.updateOptions()
			}).toThrow(Error('No new options given'))

			expect(() => {
				ac.updateOptions({})
			}).toThrow(Error('No new options given'))
		})

		it('allows all options to be updated', () => {
			const initOptions = {
				type: 'json',
				data: jsonDummyData,
				duration: 42,
				frequencyLow: 0,
				frequencyHigh: 0
			}

			spyOn(AudioChart, '_checkOptions')

			const ac = new AudioChart(initOptions)

			expect(AudioChart._checkOptions.calls.count()).toBe(1)
			expect(AudioChart._checkOptions).toHaveBeenCalledWith(initOptions)
			expect(ac.options).toBe(initOptions)

			const newOptions = {
				type: 'json',
				data: jsonDummyData,
				duration: 72,
				frequencyLow: 42,
				frequencyHigh: 420
			}

			expect(() => {
				ac.updateOptions(newOptions)
			}).not.toThrow()

			expect(AudioChart._checkOptions.calls.count()).toBe(2)
			expect(AudioChart._checkOptions).toHaveBeenCalledWith(newOptions)
			expect(ac.options).toEqual(newOptions)
		})

		it('allows partial options updates', () => {
			const initOptions = {
				type: 'json',
				data: jsonDummyData,
				duration: 72,
				frequencyLow: 0,
				frequencyHigh: 0
			}

			const ac = new AudioChart(initOptions)

			expect(ac.options).toBe(initOptions)

			ac.updateOptions({
				frequencyLow: 210,
				frequencyHigh: 420
			})

			expect(ac.options).toEqual({
				type: 'json',
				data: jsonDummyData,
				duration: 72,
				frequencyLow: 210,
				frequencyHigh: 420
			})
		})
	})
})
