'use strict'
/* global AudioChart JSONDataWrapper GoogleDataWrapper HTMLTableDataWrapper htmlTableVisualCallbackMaker */

describe('AudioChart', function() {
	it('throws with a message if Web Audio API is unsupported', function() {
		spyOn(window, 'getAudioContext').and.returnValue(null)

		expect(function() {
			new AudioChart({})
		}).toThrow(
			Error("Sorry, your browser doesn't support the Web Audio API.")
		)
	})

	it('throws when an errant `options.type` is supplied', function() {
		const options = {
			type: 'moo',
			duration: 42,
			frequencyLow: 0,
			frequencyHigh: 0
		}

		expect(function() {
			new AudioChart(options, null)
		}).toThrow(Error("Invalid data type 'moo' given."))
	})

	it('throws when a duration is not given', function() {
		const options = {
			type: 'moo'
		}

		expect(function() {
			new AudioChart(options)
		}).toThrow(Error('No duration given'))
	})

	it('throws when a minimum frequency is not given', function() {
		const options = {
			type: 'moo',
			duration: 42
		}

		expect(function() {
			new AudioChart(options)
		}).toThrow(Error('No minimum frequency given'))
	})

	it('throws when a maximum frequency is not given', function() {
		const options = {
			type: 'moo',
			duration: 42,
			frequencyLow: 0
		}

		expect(function() {
			new AudioChart(options)
		}).toThrow(Error('No maximum frequency given'))
	})

	it('assigns a JSON data wrapper, parameter and no callback', function() {
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

	it('assigns a Google wrapper and parameter without a chart', function() {
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

	it('assigns a Google wrapper, parameter and chart callback', function() {
		const options = {
			'type': 'google',
			'data': 42,
			'chart': {}
		}

		spyOn(window, 'googleVisualCallbackMaker').and.returnValue(42)

		expect(AudioChart._assignWrapperCallback(options))
			.toEqual({
				'Wrapper': GoogleDataWrapper,
				'parameter': 42,
				'callback': 42
			})
	})

	it('assigns a HTML data wrapper, parameter and no callback', function() {
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

	it('assigns a HTML data wrapper, parameter and callback', function() {
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

	/* it('requires `data` to be specified with Google charts', () => {
		const options = {
			type: 'google',
			duration: 42,
			frequencyLow: 0,
			frequencyHigh: 0
		}

		expect(() => {
			new AudioChart(options)
		}).toThrow(Error('Options must include a data key'))
	})
	*/
})
