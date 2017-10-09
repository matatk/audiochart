'use strict'

describe('getAudioContext', function() {
	it('returns the same audio context when called again', function() {
		const context1 = window.getAudioContext()
		const context2 = window.getAudioContext()
		const context3 = window.getAudioContext()
		expect(context1).toBe(context2)
		expect(context2).toBe(context3)
	})
})
