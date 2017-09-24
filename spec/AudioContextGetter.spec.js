'use strict'

describe('AudioContextGetter', function() {
	it('returns the same audio context when called again', function() {
		const context1 = window.AudioContextGetter.get()
		const context2 = window.AudioContextGetter.get()
		const context3 = window.AudioContextGetter.get()
		expect(context1).toBe(context2)
		expect(context2).toBe(context3)
	})
})
