'use strict'

const FakePlayer = (function() {
	function FakePlayer() {}
	FakePlayer.prototype.play = function() {}
	FakePlayer.prototype.pause = function() {}
	FakePlayer.prototype.playPause = function() {}
	FakePlayer.prototype.stop = function() {}
	FakePlayer.prototype.stepForward = function() {}
	return FakePlayer
})()


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
			new window.KeyboardHandler(nonExistantDiv, fakePlayer)
		}).toThrow()
	})

	it('throws when a non-existant player is given', function() {
		expect(function() {
			new window.KeyboardHandler(keyTargetDiv)
		}).toThrow()
	})

	it('sets the tabindex of the target container to 0', function() {
		expect(keyTargetDiv.tabIndex).toBe(-1)
		new window.KeyboardHandler(keyTargetDiv, fakePlayer)
		expect(keyTargetDiv.tabIndex).toBe(0)
	})

	// TODO DRY
	it('stops the event default handler being called', function(done) {
		new window.KeyboardHandler(keyTargetDiv, fakePlayer)
		const evt = createKeydownEvent('Up', false)
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
		const keyboardHandler = new window.KeyboardHandler(keyTargetDiv, fakePlayer)
		spyOn(keyboardHandler, 'handleRight').and.callThrough()
		createAndDispatchKeydownEvent('Right', false, keyTargetDiv)
		// TODO how to not need the timeout?
		setTimeout(function() {
			expect(keyboardHandler.handleRight).toHaveBeenCalled()
			done()
		}, 100)
	})

	// TODO DRY
	it('steps its player when the right arrow key is pressed', function(done) {
		new window.KeyboardHandler(keyTargetDiv, fakePlayer)
		spyOn(fakePlayer, 'stepForward')
		createAndDispatchKeydownEvent('Right', false, keyTargetDiv)
		// TODO how to not need the timeout?
		setTimeout(function() {
			expect(fakePlayer.stepForward).toHaveBeenCalled()
			done()
		}, 100)
	})

	// TODO DRY
	it('knows when the space key has been pressed', function(done) {
		const keyboardHandler = new window.KeyboardHandler(keyTargetDiv, fakePlayer)
		spyOn(keyboardHandler, 'handleSpace').and.callThrough()
		createAndDispatchKeydownEvent('U+0020', false, keyTargetDiv)
		// TODO how to not need the timeout?
		setTimeout(function() {
			expect(keyboardHandler.handleSpace).toHaveBeenCalled()
			done()
		}, 100)
	})

	// TODO DRY
	it('pauses its player when space is pressed', function(done) {
		new window.KeyboardHandler(keyTargetDiv, fakePlayer)
		spyOn(fakePlayer, 'playPause')
		createAndDispatchKeydownEvent('U+0020', false, keyTargetDiv)
		// TODO how to not need the timeout?
		setTimeout(function() {
			expect(fakePlayer.playPause).toHaveBeenCalled()
			done()
		}, 100)
	})
})
