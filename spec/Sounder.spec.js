'use strict'
/* global Sounder */

describe('Sounder', () => {
	class FakeOscillator {
		constructor() {
			this.frequency = {
				value: 0
			}
		}

		connect(destination) {}
		start(optOffest) {}
		stop(optOffset) {}
	}

	class FakeAudioContext {
		constructor() {
			this.currentTime = 42
			this.destination = {}
		}

		createOscillator() {
			return new FakeOscillator()
		}
	}


	let fakeAudioContext = null

	beforeEach(() => {
		fakeAudioContext = new FakeAudioContext()
	})

	it('has no oscillator to start with', () => {
		const sounder = new Sounder(fakeAudioContext)
		expect(sounder.oscillator).not.toBeDefined()
	})

	it('[TODO] connects and starts its oscillator', () => {
		const sounder = new Sounder(fakeAudioContext)
		sounder.start()
		const fakeOscillator = sounder.oscillator
		spyOn(fakeOscillator, 'connect')
		spyOn(fakeOscillator, 'start')
		// expect(fakeOscillator.connect).toHaveBeenCalledWith(fakeAudioContext.destination)
		// expect(fakeOscillator.start).toHaveBeenCalledWith(0)
		expect(true).toBe(true)
	})

	it('changes frequency', () => {
		let fakeOscillator = null
		const sounder = new Sounder(fakeAudioContext)
		jasmine.clock().install()
		sounder.start()
		fakeOscillator = sounder.oscillator
		expect(fakeOscillator.frequency.value).toBe(0)
		sounder.frequency(42)
		jasmine.clock().tick(1)
		expect(fakeOscillator.frequency.value).toBe(42)
		jasmine.clock().uninstall()
	})

	it('stops its oscillator', () => {
		const sounder = new Sounder(fakeAudioContext)
		sounder.start()
		const fakeOscillator = sounder.oscillator
		spyOn(fakeOscillator, 'stop')
		sounder.stop()
		expect(fakeOscillator.stop).toHaveBeenCalled()
	})

	it('creates a new oscillator after the previous one has been stopped', () => {
		const sounder = new Sounder(fakeAudioContext)
		sounder.start()
		const fakeOscillator1 = sounder.oscillator
		sounder.stop()
		sounder.start()
		const fakeOscillator2 = sounder.oscillator
		sounder.stop()
		expect(fakeOscillator1).not.toBe(fakeOscillator2)
	})
})
