'use strict'
/* global KeyboardHandler */

class FakePlayer {
	play() {}
	pause() {}
	playPause() {}
	stop() {}
	stepForward() {}
}


function createKeydownEvent(keyName, shift) {
	return new KeyboardEvent('keydown', {
		key: keyName,
		shiftKey: shift
	})
}


function createAndDispatchKeydownEvent(keyName, shift, target) {
	target.dispatchEvent(createKeydownEvent(keyName, shift))
}


describe('KeyboardHandler', function() {
	let nonExistantDiv
	let keyTargetDiv
	let fakePlayer

	beforeEach(function() {
		jasmine.getFixtures().fixturesPath = 'base/spec/'
		loadFixtures('KeyboardHandler.fixtures.html')

		nonExistantDiv = document.getElementById('moo')
		keyTargetDiv = document.getElementById('test-01')
		fakePlayer = new FakePlayer()
	})

	it('throws when a non-existant container is given', function() {
		expect(function() {
			new KeyboardHandler(nonExistantDiv, fakePlayer)
		}).toThrow()
	})

	it('throws when a non-existant player is given', function() {
		expect(function() {
			new KeyboardHandler(keyTargetDiv)
		}).toThrow()
	})

	it('sets the tabindex of the target container to 0', function() {
		expect(keyTargetDiv.tabIndex).toBe(-1)
		new KeyboardHandler(keyTargetDiv, fakePlayer)
		expect(keyTargetDiv.tabIndex).toBe(0)
	})

	// TODO DRY
	it('stops the event default handler being called', function(done) {
		new KeyboardHandler(keyTargetDiv, fakePlayer)
		const evt = createKeydownEvent('Meta', false)
		spyOn(evt, 'preventDefault')
		keyTargetDiv.dispatchEvent(evt)
		// TODO how to not need the timeout?
		setTimeout(function() {
			expect(evt.preventDefault).toHaveBeenCalled()
			done()
		}, 100)
	})

	// TODO DRY
	it('knows when the right arrow key has been pressed', function(done) {
		const keyboardHandler = new KeyboardHandler(keyTargetDiv, fakePlayer)
		spyOn(keyboardHandler, 'handleRight').and.callThrough()
		createAndDispatchKeydownEvent('ArrowRight', false, keyTargetDiv)
		// TODO how to not need the timeout?
		setTimeout(function() {
			expect(keyboardHandler.handleRight).toHaveBeenCalled()
			done()
		}, 100)
	})

	// TODO DRY
	it('steps its player when the right arrow key is pressed', function(done) {
		new KeyboardHandler(keyTargetDiv, fakePlayer)
		spyOn(fakePlayer, 'stepForward')
		createAndDispatchKeydownEvent('ArrowRight', false, keyTargetDiv)
		// TODO how to not need the timeout?
		setTimeout(function() {
			expect(fakePlayer.stepForward).toHaveBeenCalled()
			done()
		}, 100)
	})

	// TODO DRY
	it('knows when the space key has been pressed', function(done) {
		const keyboardHandler = new KeyboardHandler(keyTargetDiv, fakePlayer)
		spyOn(keyboardHandler, 'handleSpace').and.callThrough()
		createAndDispatchKeydownEvent(' ', false, keyTargetDiv)
		// TODO how to not need the timeout?
		setTimeout(function() {
			expect(keyboardHandler.handleSpace).toHaveBeenCalled()
			done()
		}, 100)
	})

	// TODO DRY
	it('pauses its player when space is pressed', function(done) {
		new KeyboardHandler(keyTargetDiv, fakePlayer)
		spyOn(fakePlayer, 'playPause')
		createAndDispatchKeydownEvent(' ', false, keyTargetDiv)
		// TODO how to not need the timeout?
		setTimeout(function() {
			expect(fakePlayer.playPause).toHaveBeenCalled()
			done()
		}, 100)
	})
})
