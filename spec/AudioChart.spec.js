'use strict'
/* global AudioChart JSONDataWrapper GoogleDataWrapper HTMLTableDataWrapper htmlTableVisualCallbackMaker */

describe('AudioChart', function() {
	let fakeOptions = null

	beforeEach(function() {
		fakeOptions = { type: 'test' }
	})

	it('throws with a message if Web Audio API is unsupported', function() {
		spyOn(window, 'getAudioContext').and.returnValue(null)
		expect(function() {
			new AudioChart(fakeOptions)
		}).toThrow(
			Error("Sorry, your browser doesn't support the Web Audio API.")
		)
	})

	it('throws when an errant `options.type` is supplied', function() {
		const options = {
			'type': 'moo'
		}

		expect(function() {
			new AudioChart(options, null)
		}).toThrow(Error("Invalid data type 'moo' given."))
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

		// FIXME Given that we have to do this to stub out this callback
		// maker, maybe it is better to revert to doing this for *all* of
		// these tests, because returning this artificial object thing is
		// a bit naff...
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
})
