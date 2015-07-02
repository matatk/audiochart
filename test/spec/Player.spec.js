(function() {
  var BaseFakeDataWrapper, FakeMapper, FakeSounder, LongFakeDataWrapper, ShortFakeDataWrapper, ac, expected_frequency_calls, mixin_data_wrapper, mixin_data_wrapper_core,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  if (typeof exports !== "undefined" && exports !== null) {
    ac = require('../audiochart');
  } else {
    ac = window;
  }

  expected_frequency_calls = function(playback_time, series_length) {
    var i, interval, j, out, ref;
    interval = playback_time / series_length;
    out = [];
    out.push([21]);
    for (i = j = 1, ref = series_length - 1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
      out.push([21, interval * i]);
    }
    return out;
  };

  BaseFakeDataWrapper = (function() {
    function BaseFakeDataWrapper() {}

    BaseFakeDataWrapper.prototype.num_series = function() {
      return 1;
    };

    BaseFakeDataWrapper.prototype.series_names = function() {
      return ['Test'];
    };

    BaseFakeDataWrapper.prototype.series_value = function(series, index) {
      return 42;
    };

    return BaseFakeDataWrapper;

  })();

  ShortFakeDataWrapper = (function(superClass) {
    extend(ShortFakeDataWrapper, superClass);

    function ShortFakeDataWrapper() {
      return ShortFakeDataWrapper.__super__.constructor.apply(this, arguments);
    }

    ShortFakeDataWrapper.prototype.series_length = function(series) {
      return 4;
    };

    return ShortFakeDataWrapper;

  })(BaseFakeDataWrapper);

  LongFakeDataWrapper = (function(superClass) {
    extend(LongFakeDataWrapper, superClass);

    function LongFakeDataWrapper() {
      return LongFakeDataWrapper.__super__.constructor.apply(this, arguments);
    }

    LongFakeDataWrapper.prototype.series_length = function(series) {
      return 100;
    };

    return LongFakeDataWrapper;

  })(BaseFakeDataWrapper);

  FakeMapper = (function() {
    function FakeMapper() {}

    FakeMapper.prototype.map = function(datum) {
      return 21;
    };

    return FakeMapper;

  })();

  FakeSounder = (function() {
    function FakeSounder() {}

    FakeSounder.prototype.frequency = function(frequency, offset) {};

    FakeSounder.prototype.start = function() {};

    FakeSounder.prototype.stop = function() {};

    return FakeSounder;

  })();

  mixin_data_wrapper_core = function(message, test_data_class, test_duration, test_call_count, test_interval, use_visual_callback) {
    return describe(message, function() {
      var fake_data, fake_mapper, fake_sounder, fake_visual_callback, player;
      fake_data = null;
      fake_mapper = null;
      fake_sounder = null;
      if (use_visual_callback) {
        fake_visual_callback = null;
      }
      player = null;
      beforeEach(function() {
        fake_data = new test_data_class;
        fake_mapper = new FakeMapper;
        fake_sounder = new FakeSounder;
        if (use_visual_callback) {
          fake_visual_callback = jasmine.createSpy('fake_visual_callback');
          return player = new ac.Player(test_duration, fake_data, fake_mapper, fake_sounder, fake_visual_callback);
        } else {
          return player = new ac.Player(test_duration, fake_data, fake_mapper, fake_sounder);
        }
      });
      it('works out for how long to sound each datum', function() {
        return expect(player.interval).toBe(test_interval);
      });
      it('starts the sounder', function() {
        jasmine.Clock.useMock();
        spyOn(fake_sounder, 'start');
        player.play();
        jasmine.Clock.tick(test_duration);
        return expect(fake_sounder.start.callCount).toBe(1);
      });
      it('stops the sounder', function() {
        jasmine.Clock.useMock();
        spyOn(fake_sounder, 'stop');
        player.play();
        jasmine.Clock.tick(test_duration);
        return expect(fake_sounder.stop.callCount).toBe(1);
      });
      it('makes the correct number of map calls', function() {
        jasmine.Clock.useMock();
        spyOn(fake_mapper, 'map');
        player.play();
        jasmine.Clock.tick(test_duration);
        return expect(fake_mapper.map.callCount).toBe(test_call_count);
      });
      it('makes the right number of calls to the sounder', function() {
        jasmine.Clock.useMock();
        spyOn(fake_sounder, 'frequency');
        player.play();
        jasmine.Clock.tick(test_duration);
        return expect(fake_sounder.frequency.callCount).toBe(test_call_count);
      });
      it('calls the sounder with the correct arguments each time', function() {
        jasmine.Clock.useMock();
        spyOn(fake_sounder, 'frequency');
        player.play();
        jasmine.Clock.tick(test_duration);
        return expect(fake_sounder.frequency.argsForCall).toEqual(expected_frequency_calls(test_duration, test_call_count));
      });
      if (use_visual_callback) {
        return it('makes the correct number of visual callback calls', function() {
          jasmine.Clock.useMock();
          player.play();
          jasmine.Clock.tick(test_duration);
          return expect(fake_visual_callback.callCount).toBe(test_call_count);
        });
      }
    });
  };

  mixin_data_wrapper = function(message, test_data_class, test_duration, test_call_count, test_interval) {
    return describe(message, function() {
      mixin_data_wrapper_core('when not having a callback', test_data_class, test_duration, test_call_count, test_interval, false);
      return mixin_data_wrapper_core('when having a callback', test_data_class, test_duration, test_call_count, test_interval, true);
    });
  };

  describe('Player', function() {
    mixin_data_wrapper('instantiated with short fake data source for 5000ms', ShortFakeDataWrapper, 5000, 4, 1250);
    mixin_data_wrapper('instantiated with short fake data source for 3000ms', ShortFakeDataWrapper, 3000, 4, 750);
    mixin_data_wrapper('instantiated with long fake data source for 5000ms', LongFakeDataWrapper, 5000, 100, 50);
    return mixin_data_wrapper('instantiated with long fake data source for 2500ms', LongFakeDataWrapper, 2500, 100, 25);
  });

}).call(this);
