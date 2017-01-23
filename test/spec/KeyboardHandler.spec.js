'use strict'

function _createAndDispatchKeydownEvent(keyName, target) {
	// Looks like Phantom doesn't support Event constructors
	// https://github.com/ariya/phantomjs/issues/11289#issuecomment-38880333
	var keydownEvent
	try {
		keydownEvent = new KeyboardEvent('keydown')
	} catch (error) {
		keydownEvent = document.createEvent('KeyboardEvent')
		keydownEvent.initEvent('keydown', true, false)
	}
	keydownEvent.key = keyName  // TODO support keyIdentifier for Safari?

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

	it('[TODO] listens for keypresses on container', function() {
		// TODO complete this
		new window.KeyboardHandler(keyTargetDiv)
		// expect(keyTargetDiv).toHandle('keypress')
		expect(true).toBe(true)
	})

	it('knows when the right arrow key has been pressed', function() {
		var keyboardHandler = new window.KeyboardHandler(keyTargetDiv)
		expect(keyboardHandler.triggered).toBe(false)

		_createAndDispatchKeydownEvent('Left', keyTargetDiv)
		expect(keyboardHandler.triggered).toBe(false)

		_createAndDispatchKeydownEvent('Right', keyTargetDiv)
		setTimeout(function() {
			expect(keyboardHandler.triggered).toBe(true)
		}, 100)
		// TODO make this work using done()?
	})
})
