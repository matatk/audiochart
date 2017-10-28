'use strict'
/* global getAudioContext */

describe('getAudioContext', () => {
	it('returns the same audio context when called again', () => {
		const context1 = getAudioContext()
		const context2 = getAudioContext()
		const context3 = getAudioContext()
		expect(context1).toBe(context2)
		expect(context2).toBe(context3)
	})
})
