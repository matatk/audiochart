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

	it('creates an oscillator', function() {
		var sounder
		spyOn(fakeAudioContext, 'createOscillator')
		sounder = new window.WebAudioSounder(fakeAudioContext)
		expect(fakeAudioContext.createOscillator).toHaveBeenCalled()
	})

	it('connects and starts its oscillator', function() {
		var fakeOscillator
		var sounder
		sounder = new window.WebAudioSounder(fakeAudioContext)
		fakeOscillator = sounder.oscillator
		spyOn(fakeOscillator, 'connect')
		spyOn(fakeOscillator, 'start')
		sounder.start()
		expect(fakeOscillator.connect).toHaveBeenCalledWith(fakeAudioContext.destination)
		expect(fakeOscillator.start).toHaveBeenCalledWith(0)
	})

	it('changes frequency', function() {
		var fakeOscillator = null
		var sounder = new window.WebAudioSounder(fakeAudioContext)
		jasmine.clock().install()
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
		fakeOscillator = sounder.oscillator
		spyOn(fakeOscillator, 'stop')
		sounder.stop()
		expect(fakeOscillator.stop).toHaveBeenCalled()
	})
})
