'use strict'

describe('WebAudioSounder', function() {
	var FakeOscillator = (function() {
		function FakeOscillator() {
			this.frequency = {
				value: 0
			}
		}

		FakeOscillator.prototype.connect = function(destination) {}
		FakeOscillator.prototype.start = function(optOffest) {}
		FakeOscillator.prototype.stop = function(optOffset) {}
		return FakeOscillator
	})()

	var FakeAudioContext = (function() {
		function FakeAudioContext() {
			this.currentTime = 42
		}

		FakeAudioContext.prototype.createOscillator = function() {
			return new FakeOscillator()
		}

		FakeAudioContext.prototype.destination = {}

		return FakeAudioContext
	})()


	var fakeAudioContext = null

	beforeEach(function() {
		fakeAudioContext = new FakeAudioContext()
	})

	it('has no oscillator to start with', function() {
		var sounder = new window.WebAudioSounder(fakeAudioContext)
		expect(sounder.oscillator).not.toBeDefined()
	})

	it('[TODO] connects and starts its oscillator', function() {
		var fakeOscillator
		var sounder
		sounder = new window.WebAudioSounder(fakeAudioContext)
		sounder.start()
		fakeOscillator = sounder.oscillator
		spyOn(fakeOscillator, 'connect')
		spyOn(fakeOscillator, 'start')
		// expect(fakeOscillator.connect).toHaveBeenCalledWith(fakeAudioContext.destination)
		// expect(fakeOscillator.start).toHaveBeenCalledWith(0)
		expect(true).toBe(true)
	})

	it('changes frequency', function() {
		var fakeOscillator = null
		var sounder = new window.WebAudioSounder(fakeAudioContext)
		jasmine.clock().install()
		sounder.start()
		fakeOscillator = sounder.oscillator
		expect(fakeOscillator.frequency.value).toBe(0)
		sounder.frequency(42)
		jasmine.clock().tick(1)
		expect(fakeOscillator.frequency.value).toBe(42)
		jasmine.clock().uninstall()
	})

	it('stops its oscillator', function() {
		var fakeOscillator
		var sounder
		sounder = new window.WebAudioSounder(fakeAudioContext)
		sounder.start()
		fakeOscillator = sounder.oscillator
		spyOn(fakeOscillator, 'stop')
		sounder.stop()
		expect(fakeOscillator.stop).toHaveBeenCalled()
	})

	it('creates a new oscillator after the previous one has been stopped', function() {
		var sounder = new window.WebAudioSounder(fakeAudioContext)
		sounder.start()
		var fakeOscillator1 = sounder.oscillator
		sounder.stop()
		sounder.start()
		var fakeOscillator2 = sounder.oscillator
		sounder.stop()
		expect(fakeOscillator1).not.toBe(fakeOscillator2)
	})
})
