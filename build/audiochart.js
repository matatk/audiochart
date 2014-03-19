// Generated by CoffeeScript 1.7.1
(function() {
  var AudioChart, DataWrapper, FrequencyPitchMapper, GoogleDataWrapper, NotePitchMapper, PitchMapper, Player, WebAudioSounder, audio_context_getter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  DataWrapper = (function() {
    function DataWrapper(data) {
      this.data = data;
      throw new Error('please use a derived class');
    }

    DataWrapper.prototype.num_series = function() {};

    DataWrapper.prototype.series_names = function() {};

    DataWrapper.prototype.series_min = function(series) {};

    DataWrapper.prototype.series_max = function(series) {};

    DataWrapper.prototype.series_value = function(series, index) {};

    DataWrapper.prototype.series_length = function(series) {};

    return DataWrapper;

  })();

  GoogleDataWrapper = (function(_super) {
    __extends(GoogleDataWrapper, _super);

    function GoogleDataWrapper(data) {
      this.data = data;
    }

    GoogleDataWrapper.prototype.num_series = function() {
      return this.data.getNumberOfColumns() - 1;
    };

    GoogleDataWrapper.prototype.series_names = function() {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 1, _ref = this.data.getNumberOfColumns() - 1; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        _results.push(this.data.getColumnLabel(i));
      }
      return _results;
    };

    GoogleDataWrapper.prototype.series_min = function(series) {
      return this.data.getColumnRange(series + 1)['min'];
    };

    GoogleDataWrapper.prototype.series_max = function(series) {
      return this.data.getColumnRange(series + 1)['max'];
    };

    GoogleDataWrapper.prototype.series_value = function(series, index) {
      return this.data.getValue(index, series + 1);
    };

    GoogleDataWrapper.prototype.series_length = function(series) {
      return this.data.getNumberOfRows();
    };

    return GoogleDataWrapper;

  })(DataWrapper);

  PitchMapper = (function() {
    function PitchMapper(minimum_datum, maximum_datum) {
      this.minimum_datum = minimum_datum;
      this.maximum_datum = maximum_datum;
      if (this.minimum_datum > this.maximum_datum) {
        throw new Error('minimum datum should be <= maximum datum');
      }
    }

    PitchMapper.prototype.map = function(datum) {};

    return PitchMapper;

  })();

  FrequencyPitchMapper = (function(_super) {
    __extends(FrequencyPitchMapper, _super);

    function FrequencyPitchMapper(minimum_datum, maximum_datum, minimum_frequency, maximum_frequency) {
      this.minimum_frequency = minimum_frequency;
      this.maximum_frequency = maximum_frequency;
      FrequencyPitchMapper.__super__.constructor.call(this, minimum_datum, maximum_datum);
      if (this.minimum_frequency > this.maximum_frequency) {
        throw new Error('minimum frequency should be <= maximum frequency');
      }
      this.data_range = this.maximum_datum - this.minimum_datum;
    }

    FrequencyPitchMapper.prototype.map = function(datum) {
      var ratio;
      if (this.data_range) {
        ratio = (datum - this.minimum_datum) / this.data_range;
      } else {
        ratio = 0.5;
      }
      return this.minimum_frequency + ratio * (this.maximum_frequency - this.minimum_frequency);
    };

    return FrequencyPitchMapper;

  })(PitchMapper);

  NotePitchMapper = (function(_super) {
    __extends(NotePitchMapper, _super);

    function NotePitchMapper() {
      return NotePitchMapper.__super__.constructor.apply(this, arguments);
    }

    return NotePitchMapper;

  })(PitchMapper);

  WebAudioSounder = (function() {
    function WebAudioSounder(context) {
      this.context = context;
      this.oscillator = this.context.createOscillator();
    }

    WebAudioSounder.prototype.start = function() {
      this.oscillator.connect(this.context.destination);
      this.oscillator.start(0);
    };

    WebAudioSounder.prototype.frequency = function(frequency, offset) {
      var callback;
      callback = (function(_this) {
        return function() {
          _this.oscillator.frequency.value = frequency;
        };
      })(this);
      setTimeout(callback, offset);
    };

    WebAudioSounder.prototype.stop = function(offset) {
      this.oscillator.stop(offset);
    };

    return WebAudioSounder;

  })();

  audio_context_getter = function() {
    if (typeof AudioContext !== "undefined" && AudioContext !== null) {
      return new AudioContext;
    } else if (typeof webkitAudioContext !== "undefined" && webkitAudioContext !== null) {
      return new webkitAudioContext;
    } else {
      throw new Error('No support for Web Audio API');
    }
  };

  Player = (function() {
    function Player(data_wrapper, pitch_mapper, sounder) {
      this.data_wrapper = data_wrapper;
      this.pitch_mapper = pitch_mapper;
      this.sounder = sounder;
      this.interval = (5 * 1000) / this.data_wrapper.series_length(0);
    }

    Player.prototype.play = function() {
      var i, series_length, series_max_index, _i;
      series_length = this.data_wrapper.series_length(0);
      series_max_index = series_length - 1;
      this.sounder.start(0);
      this.sounder.frequency(this.pitch_mapper.map(this.data_wrapper.series_value(0, 0)));
      for (i = _i = 1; 1 <= series_max_index ? _i <= series_max_index : _i >= series_max_index; i = 1 <= series_max_index ? ++_i : --_i) {
        this.sounder.frequency(this.pitch_mapper.map(this.data_wrapper.series_value(0, i)), this.interval * i);
      }
      this.sounder.stop((series_length * this.interval) / 1000);
    };

    return Player;

  })();

  AudioChart = (function() {
    function AudioChart(data) {
      this.data_wrapper = new GoogleDataWrapper(data);
      this.freq_pitch_mapper = new FrequencyPitchMapper(this.data_wrapper.series_min(0), this.data_wrapper.series_max(0), 200, 600);
      this.sounder = new WebAudioSounder(audio_context_getter());
      this.player = new Player(this.data_wrapper, this.freq_pitch_mapper, this.sounder);
      this.player.play();
    }

    return AudioChart;

  })();

  if (typeof exports !== "undefined" && exports !== null) {
    exports.AudioChart = AudioChart;
    exports.DataWrapper = DataWrapper;
    exports.GoogleDataWrapper = GoogleDataWrapper;
    exports.PitchMapper = PitchMapper;
    exports.FrequencyPitchMapper = FrequencyPitchMapper;
    exports.NotePitchMapper = NotePitchMapper;
    exports.WebAudioSounder = WebAudioSounder;
    exports.Player = Player;
  } else {
    this['AudioChart'] = AudioChart;
    this['DataWrapper'] = DataWrapper;
    this['GoogleDataWrapper'] = GoogleDataWrapper;
    this['PitchMapper'] = PitchMapper;
    this['FrequencyPitchMapper'] = FrequencyPitchMapper;
    this['NotePitchMapper'] = NotePitchMapper;
    this['WebAudioSounder'] = WebAudioSounder;
    this['Player'] = Player;
  }

}).call(this);
