'use strict'

function createAndDispatchKeydownEvent(keyName, shift, target) {
	// Looks like Phantom doesn't support Event constructors
	// https://github.com/ariya/phantomjs/issues/11289#issuecomment-38880333
	//
	// Also Phantom doesn't seem to support assigning the shiftKey property
	var keydownEvent
	try {
		keydownEvent = new KeyboardEvent('keydown', {
			shiftKey: shift
		})
	} catch (error) {
		keydownEvent = document.createEvent('KeyboardEvent')
		keydownEvent.initEvent('keydown', true, false)
	}
	keydownEvent.key = keyName

	target.dispatchEvent(keydownEvent)
}

describe('KeyboardHandler', function() {
	var nonExistantDiv
	var keyTargetDiv

	beforeEach(function() {
		jasmine.getFixtures().fixturesPath = 'spec/'
		loadFixtures('KeyboardHandler.fixtures.html')

		nonExistantDiv = document.getElementById('moo')
		keyTargetDiv = document.getElementById('test-01')
	})

	it('throws when a non-existant container is given', function() {
		expect(function() {
			new window.KeyboardHandler(nonExistantDiv)
		}).toThrow()
	})

	it('sets the tabindex of the target container to 0', function() {
		expect(keyTargetDiv.tabIndex).toBe(-1)
		new window.KeyboardHandler(keyTargetDiv)
		expect(keyTargetDiv.tabIndex).toBe(0)
	})

	it('knows when the right arrow key has been pressed', function(done) {
		var keyboardHandler = new window.KeyboardHandler(keyTargetDiv)
		spyOn(keyboardHandler, 'handleRight').and.callThrough()
		createAndDispatchKeydownEvent('Right', false, keyTargetDiv)
		// TODO how to not need the timeout?
		setTimeout(function() {
			expect(keyboardHandler.handleRight).toHaveBeenCalled()
			done()
		}, 100)
	})

	it('knows when the space key has been pressed', function(done) {
		var keyboardHandler = new window.KeyboardHandler(keyTargetDiv)
		spyOn(keyboardHandler, 'handleSpace').and.callThrough()
		createAndDispatchKeydownEvent('U+0020', false, keyTargetDiv)
		// TODO how to not need the timeout?
		setTimeout(function() {
			expect(keyboardHandler.handleSpace).toHaveBeenCalled()
			done()
		}, 100)
	})
})
