'use strict'
/* global loadFixture KeyboardHandler */
// TODO DRY left/right arrow tests?

class FakePlayer {
	play() {}
	pause() {}
	playPause() {}
	stop() {}
	stepForward() {}
	stepBackward() {}
}


function createKeydownEvent(keyName, shift, alt) {
	return new KeyboardEvent('keydown', {
		key: keyName,
		shiftKey: shift,
		altKey: alt
	})
}


function createAndDispatchKeydownEvent(keyName, shift, alt, target) {
	target.dispatchEvent(createKeydownEvent(keyName, shift, alt))
}


describe('KeyboardHandler', () => {
	let nonExistantDiv
	let keyTargetDiv
	let fakePlayer

	beforeEach(() => {
		loadFixture('KeyboardHandler.fixtures.html')

		nonExistantDiv = document.getElementById('moo')
		keyTargetDiv = document.getElementById('test-01')
		fakePlayer = new FakePlayer()
	})

	it('throws when a non-existant container is given', () => {
		expect(() => {
			new KeyboardHandler(nonExistantDiv, fakePlayer)
		}).toThrow()
	})

	it('throws when a non-existant player is given', () => {
		expect(() => {
			new KeyboardHandler(keyTargetDiv)
		}).toThrow()
	})

	it('sets the tabindex of the target container to 0', () => {
		expect(keyTargetDiv.tabIndex).toBe(-1)
		new KeyboardHandler(keyTargetDiv, fakePlayer)
		expect(keyTargetDiv.tabIndex).toBe(0)
	})

	it('stops the event default handler being called', function(done) {
		new KeyboardHandler(keyTargetDiv, fakePlayer)
		const evt = createKeydownEvent('Meta', false)
		spyOn(evt, 'preventDefault')
		keyTargetDiv.dispatchEvent(evt)
		setTimeout(() => {
			expect(evt.preventDefault).toHaveBeenCalled()
			done()
		}, 100)
	})

	it('stops the event default handler being called, except for tab', function(done) {
		new KeyboardHandler(keyTargetDiv, fakePlayer)
		const evt = createKeydownEvent('Tab', false)
		spyOn(evt, 'preventDefault')
		keyTargetDiv.dispatchEvent(evt)
		setTimeout(() => {
			expect(evt.preventDefault).not.toHaveBeenCalled()
			done()
		}, 100)
	})

	it('knows when the left arrow key has been pressed', function(done) {
		const keyboardHandler = new KeyboardHandler(keyTargetDiv, fakePlayer)
		spyOn(keyboardHandler, 'handleLeft').and.callThrough()
		createAndDispatchKeydownEvent('ArrowLeft', false, false, keyTargetDiv)
		setTimeout(() => {
			expect(keyboardHandler.handleLeft).toHaveBeenCalledWith('normal')
			done()
		}, 100)
	})

	it('steps its player when the left arrow key is pressed', function(done) {
		new KeyboardHandler(keyTargetDiv, fakePlayer)
		spyOn(fakePlayer, 'stepBackward')
		createAndDispatchKeydownEvent('ArrowLeft', false, false, keyTargetDiv)
		setTimeout(() => {
			expect(fakePlayer.stepBackward).toHaveBeenCalledWith('normal')
			done()
		}, 100)
	})

	it('steps its player faster when shift + left arrow are pressed', function(done) {
		new KeyboardHandler(keyTargetDiv, fakePlayer)
		spyOn(fakePlayer, 'stepBackward')
		createAndDispatchKeydownEvent('ArrowLeft', true, false, keyTargetDiv)
		setTimeout(() => {
			expect(fakePlayer.stepBackward).toHaveBeenCalledWith('fast')
			done()
		}, 100)
	})

	it('steps its player by one when alt + left arrow are pressed', function(done) {
		new KeyboardHandler(keyTargetDiv, fakePlayer)
		spyOn(fakePlayer, 'stepBackward')
		createAndDispatchKeydownEvent('ArrowLeft', false, true, keyTargetDiv)
		setTimeout(() => {
			expect(fakePlayer.stepBackward).toHaveBeenCalledWith('slow')
			done()
		}, 100)
	})

	it('knows when the right arrow key has been pressed', function(done) {
		const keyboardHandler = new KeyboardHandler(keyTargetDiv, fakePlayer)
		spyOn(keyboardHandler, 'handleRight').and.callThrough()
		createAndDispatchKeydownEvent('ArrowRight', false, false, keyTargetDiv)
		setTimeout(() => {
			expect(keyboardHandler.handleRight).toHaveBeenCalledWith('normal')
			done()
		}, 100)
	})

	it('steps its player when the right arrow key is pressed', function(done) {
		new KeyboardHandler(keyTargetDiv, fakePlayer)
		spyOn(fakePlayer, 'stepForward')
		createAndDispatchKeydownEvent('ArrowRight', false, false, keyTargetDiv)
		setTimeout(() => {
			expect(fakePlayer.stepForward).toHaveBeenCalledWith('normal')
			done()
		}, 100)
	})

	it('steps its player faster when shift + right arrow are pressed', function(done) {
		new KeyboardHandler(keyTargetDiv, fakePlayer)
		spyOn(fakePlayer, 'stepForward')
		createAndDispatchKeydownEvent('ArrowRight', true, false, keyTargetDiv)
		setTimeout(() => {
			expect(fakePlayer.stepForward).toHaveBeenCalledWith('fast')
			done()
		}, 100)
	})

	it('steps its player by one when alt + right arrow are pressed', function(done) {
		new KeyboardHandler(keyTargetDiv, fakePlayer)
		spyOn(fakePlayer, 'stepForward')
		createAndDispatchKeydownEvent('ArrowRight', false, true, keyTargetDiv)
		setTimeout(() => {
			expect(fakePlayer.stepForward).toHaveBeenCalledWith('slow')
			done()
		}, 100)
	})

	it('knows when the space key has been pressed', function(done) {
		const keyboardHandler = new KeyboardHandler(keyTargetDiv, fakePlayer)
		spyOn(keyboardHandler, 'handleSpace').and.callThrough()
		createAndDispatchKeydownEvent(' ', false, false, keyTargetDiv)
		setTimeout(() => {
			expect(keyboardHandler.handleSpace).toHaveBeenCalled()
			done()
		}, 100)
	})

	it('pauses its player when space is pressed', function(done) {
		new KeyboardHandler(keyTargetDiv, fakePlayer)
		spyOn(fakePlayer, 'playPause')
		createAndDispatchKeydownEvent(' ', false, false, keyTargetDiv)
		setTimeout(() => {
			expect(fakePlayer.playPause).toHaveBeenCalled()
			done()
		}, 100)
	})
})
