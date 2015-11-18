describe('WebAudioSounder', function() {
	var FakeOscillator = (function() {
		function FakeOscillator() {
			this.frequency = {
				value: 0
			};
		}

		FakeOscillator.prototype.connect = function(destination) {};
		FakeOscillator.prototype.start = function(opt_offest) {};
		FakeOscillator.prototype.stop = function(opt_offset) {};
		return FakeOscillator;
	})();

	var FakeAudioContext = (function() {
		function FakeAudioContext() {
			this.currentTime = 42;
		}

		FakeAudioContext.prototype.createOscillator = function() {
			return new FakeOscillator();
		};

		FakeAudioContext.prototype.destination = {};

		return FakeAudioContext;
	})();


	var fake_audio_context = null;

	beforeEach(function() {
		fake_audio_context = new FakeAudioContext();
	});

	it('creates an oscillator', function() {
		var sounder;
		spyOn(fake_audio_context, 'createOscillator');
		sounder = new window.WebAudioSounder(fake_audio_context);
		expect(fake_audio_context.createOscillator).toHaveBeenCalled();
	});

	it('connects and starts its oscillator', function() {
		var fake_oscillator, sounder;
		sounder = new window.WebAudioSounder(fake_audio_context);
		fake_oscillator = sounder.oscillator;
		spyOn(fake_oscillator, 'connect');
		spyOn(fake_oscillator, 'start');
		sounder.start();
		expect(fake_oscillator.connect).toHaveBeenCalledWith(fake_audio_context.destination);
		expect(fake_oscillator.start).toHaveBeenCalledWith(0);
	});

	it('changes frequency immediately', function() {
		var fake_oscillator = null;
		var sounder = new window.WebAudioSounder(fake_audio_context);
		jasmine.clock().install();
		fake_oscillator = sounder.oscillator;
		expect(fake_oscillator.frequency.value).toBe(0);
		sounder.frequency(42);
		jasmine.clock().tick(1);
		expect(fake_oscillator.frequency.value).toBe(42);
		jasmine.clock().uninstall();
	});

	it('changes frequency with an offset', function() {
		var delay, fake_oscillator, sounder;
		jasmine.clock().install();
		delay = 250;
		sounder = new window.WebAudioSounder(fake_audio_context);
		fake_oscillator = sounder.oscillator;
		expect(fake_oscillator.frequency.value).toBe(0);
		sounder.frequency(84, delay);
		jasmine.clock().tick(delay);
		expect(fake_oscillator.frequency.value).toBe(84);
		jasmine.clock().uninstall();
	});

	it('stops its oscillator', function() {
		var fake_oscillator, sounder;
		sounder = new window.WebAudioSounder(fake_audio_context);
		fake_oscillator = sounder.oscillator;
		spyOn(fake_oscillator, 'stop');
		sounder.stop();
		expect(fake_oscillator.stop).toHaveBeenCalled();
	});

	it('stops its oscillator at a given time', function() {
		var fake_oscillator, sounder;
		sounder = new window.WebAudioSounder(fake_audio_context);
		fake_oscillator = sounder.oscillator;
		spyOn(fake_oscillator, 'stop');
		sounder.stop(21);
		expect(fake_oscillator.stop).toHaveBeenCalledWith(fake_audio_context.currentTime + 21);
	});
});
