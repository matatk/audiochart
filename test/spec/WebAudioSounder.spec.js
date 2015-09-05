(function() {
  var FakeAudioContext, FakeOscillator, ac;

  if (typeof exports !== "undefined" && exports !== null) {
    ac = require('../audiochart');
  } else {
    ac = window;
  }

  FakeOscillator = (function() {
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

  FakeAudioContext = (function() {
    function FakeAudioContext() {
      this.currentTime = 42;
    }

    FakeAudioContext.prototype.createOscillator = function() {
      return new FakeOscillator;
    };

    FakeAudioContext.prototype.destination = {};

    return FakeAudioContext;

  })();

  describe('WebAudioSounder', function() {
    var fake_audio_context;
    fake_audio_context = null;
    beforeEach(function() {
      return fake_audio_context = new FakeAudioContext;
    });
    it('creates an oscillator', function() {
      var sounder;
      spyOn(fake_audio_context, 'createOscillator');
      sounder = new ac.WebAudioSounder(fake_audio_context);
      return expect(fake_audio_context.createOscillator).toHaveBeenCalled();
    });
    it('connects and starts its oscillator', function() {
      var fake_oscillator, sounder;
      sounder = new ac.WebAudioSounder(fake_audio_context);
      fake_oscillator = sounder.oscillator;
      spyOn(fake_oscillator, 'connect');
      spyOn(fake_oscillator, 'start');
      sounder.start();
      expect(fake_oscillator.connect).toHaveBeenCalledWith(fake_audio_context.destination);
      return expect(fake_oscillator.start).toHaveBeenCalledWith(0);
    });
    it('changes frequency immediately', function() {
      var fake_oscillator;
      fake_oscillator = null;
      runs(function() {
        var sounder;
        sounder = new ac.WebAudioSounder(fake_audio_context);
        fake_oscillator = sounder.oscillator;
        expect(fake_oscillator.frequency.value).toBe(0);
        return sounder.frequency(42);
      });
      return waitsFor(function() {
        return fake_oscillator.frequency.value === 42;
      });
    });
    it('changes frequency with an offset', function() {
      var delay, fake_oscillator, sounder;
      jasmine.Clock.useMock();
      delay = 250;
      sounder = new ac.WebAudioSounder(fake_audio_context);
      fake_oscillator = sounder.oscillator;
      expect(fake_oscillator.frequency.value).toBe(0);
      sounder.frequency(84, delay);
      jasmine.Clock.tick(delay);
      return expect(fake_oscillator.frequency.value).toBe(84);
    });
    it('stops its oscillator', function() {
      var fake_oscillator, sounder;
      sounder = new ac.WebAudioSounder(fake_audio_context);
      fake_oscillator = sounder.oscillator;
      spyOn(fake_oscillator, 'stop');
      sounder.stop();
      return expect(fake_oscillator.stop).toHaveBeenCalled();
    });
    return it('stops its oscillator at a given time', function() {
      var fake_oscillator, sounder;
      jasmine.Clock.useMock();
      sounder = new ac.WebAudioSounder(fake_audio_context);
      fake_oscillator = sounder.oscillator;
      spyOn(fake_oscillator, 'stop');
      sounder.stop(21);
      return expect(fake_oscillator.stop).toHaveBeenCalledWith(fake_audio_context.currentTime + 21);
    });
  });

}).call(this);
