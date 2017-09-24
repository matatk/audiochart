'use strict'
/* global AudioChart _AudioChart AudioContextGetter */

describe('AudioChart', function() {
	let fakeOptions = null

	beforeEach(function() {
		fakeOptions = { type: 'test' }
	})

	it('passes its context to _AudioChart', function() {
		function FakeAudioContext() {}
		const fakeAudioContext = new FakeAudioContext()
		spyOn(window, '_AudioChart')

		new AudioChart(fakeOptions, fakeAudioContext)
		expect(_AudioChart)
			.toHaveBeenCalledWith(fakeOptions, fakeAudioContext)
	})

	it('can create a new context and pass it to _AudioChart', function() {
		spyOn(window, '_AudioChart')
		spyOn(AudioContextGetter, 'get').and.returnValue(42)

		new AudioChart(fakeOptions)
		expect(_AudioChart)
			.toHaveBeenCalledWith(fakeOptions, 42)
	})

	it('throws with a message if Web Audio API is unsupported', function() {
		spyOn(AudioContextGetter, 'get').and.returnValue(null)
		expect(function() {
			new AudioChart(fakeOptions)
		}).toThrow(
			Error("Sorry, your browser doesn't support the Web Audio API.")
		)
	})
})
