'use strict'

describe('AudioChart', function() {
	let fakeOptions = null

	beforeEach(function() {
		fakeOptions = { type: 'test' }
	})

	it('passes its context to _AudioChart', function() {
		function FakeAudioContext() {}
		const fakeAudioContext = new FakeAudioContext()
		spyOn(window, '_AudioChart')

		new window.AudioChart(fakeOptions, fakeAudioContext)
		expect(window._AudioChart)
			.toHaveBeenCalledWith(fakeOptions, fakeAudioContext)
	})

	it('can create a new context and pass it to _AudioChart', function() {
		spyOn(window, '_AudioChart')
		spyOn(window, 'getAudioContext').and.returnValue(42)

		new window.AudioChart(fakeOptions)
		expect(window._AudioChart)
			.toHaveBeenCalledWith(fakeOptions, 42)
	})

	it('throws with a message if Web Audio API is unsupported', function() {
		spyOn(window, 'getAudioContext').and.returnValue(null)
		expect(function() {
			new window.AudioChart(fakeOptions)
		}).toThrow(
			Error("Sorry, your browser doesn't support the Web Audio API.")
		)
	})
})
