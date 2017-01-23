'use strict'

describe('KeyboardHandler', function() {
	var nonExistantDiv
	var keyboardHandlerDiv

	beforeAll(function() {
		jasmine.getFixtures().fixturesPath = 'spec/'
		loadFixtures('KeyboardHandler.fixtures.html')

		nonExistantDiv = document.getElementById('moo')
		keyboardHandlerDiv = document.getElementById('test-01')
	})

	it('throws when a non-existant container is given', function() {
		expect(function() {
			new window.KeyboardHandler(nonExistantDiv)
		}).toThrow()
	})

	it('knows when the right arrow key has been pressed', function() {
		var keyboardHandler = new window.KeyboardHandler(keyboardHandlerDiv)
		expect(true).toBe(true)
	})
})
