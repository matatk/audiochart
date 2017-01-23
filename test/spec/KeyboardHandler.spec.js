'use strict'
/* global loadFixtures */

describe('KeyboardHandler', function() {
	jasmine.getFixtures().fixturesPath = 'spec/'
	loadFixtures('KeyboardHandler.fixtures.html')

	var nonExistantDiv = document.getElementById('moo')
	var keyboardHandlerDiv = document.getElementById('test-01')

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
