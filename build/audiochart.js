(function() {
  var AudioChart, DataWrapper, FrequencyPitchMapper, GoogleDataWrapper, HTMLTableDataWrapper, JSONDataWrapper, NotePitchMapper, PitchMapper, Player, WebAudioSounder, _audio_context_getter, _google_visual_callback_maker,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  DataWrapper = (function() {
    function DataWrapper(data) {
      this.data = data;
      throw new Error('Please use a derived class');
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

  JSONDataWrapper = (function(_super) {
    __extends(JSONDataWrapper, _super);

    function JSONDataWrapper(json) {
      if (typeof json === 'string') {
        this.object = JSON.parse(json);
      } else if (typeof json === 'object') {
        this.object = json;
      } else {
        throw new Error("Please provide a JSON string or derived object.");
      }
    }

    JSONDataWrapper.prototype.num_series = function() {
      return this.object.data.length;
    };

    JSONDataWrapper.prototype.series_names = function() {
      var chunk, _i, _len, _ref, _results;
      _ref = this.object.data;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        chunk = _ref[_i];
        _results.push(chunk.series);
      }
      return _results;
    };

    JSONDataWrapper.prototype.series_min = function(series) {
      return Math.min.apply(this, this.object.data[series]['values']);
    };

    JSONDataWrapper.prototype.series_max = function(series) {
      return Math.max.apply(this, this.object.data[series]['values']);
    };

    JSONDataWrapper.prototype.series_value = function(series, index) {
      return this.object.data[series]['values'][index];
    };

    JSONDataWrapper.prototype.series_length = function(series) {
      return this.object.data[series]['values'].length;
    };

    return JSONDataWrapper;

  })(DataWrapper);

  HTMLTableDataWrapper = (function(_super) {
    __extends(HTMLTableDataWrapper, _super);

    function HTMLTableDataWrapper(doc, id) {
      this.table = doc.getElementById(id);
      if (this.table == null) {
        throw new Error('Failed to find table with id "' + id + '".');
      }
    }

    HTMLTableDataWrapper.prototype.num_series = function() {
      return this.table.getElementsByTagName('tr')[0].children.length;
    };

    HTMLTableDataWrapper.prototype.series_names = function() {
      var element, _i, _len, _ref, _results;
      _ref = this.table.getElementsByTagName('th');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        _results.push(element.textContent);
      }
      return _results;
    };

    HTMLTableDataWrapper.prototype._series_floats = function(series) {
      var element, _i, _len, _ref, _results;
      _ref = this.table.getElementsByTagName('td');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        _results.push(parseFloat(element.textContent));
      }
      return _results;
    };

    HTMLTableDataWrapper.prototype.series_min = function(series) {
      return Math.min.apply(this, this._series_floats(series));
    };

    HTMLTableDataWrapper.prototype.series_max = function(series) {
      return Math.max.apply(this, this._series_floats(series));
    };

    HTMLTableDataWrapper.prototype.series_value = function(series, index) {
      return parseFloat(this.table.getElementsByTagName('tr')[index + 1].children[series].textContent);
    };

    HTMLTableDataWrapper.prototype.series_length = function(series) {
      return this.table.getElementsByTagName('tr').length - 1;
    };

    return HTMLTableDataWrapper;

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

  Player = (function() {
    function Player(data, pitch_mapper, sounder, visual_callback) {
      this.data = data;
      this.pitch_mapper = pitch_mapper;
      this.sounder = sounder;
      this.visual_callback = visual_callback != null ? visual_callback : null;
      this.interval = (5 * 1000) / this.data.series_length(0);
    }

    Player.prototype.play = function() {
      var i, offset, series_length, series_max_index, _i;
      series_length = this.data.series_length(0);
      series_max_index = series_length - 1;
      this.sounder.start(0);
      if (this.visual_callback != null) {
        this.visual_callback(0, 0);
      }
      this.sounder.frequency(this.pitch_mapper.map(this.data.series_value(0, 0)));
      for (i = _i = 1; 1 <= series_max_index ? _i <= series_max_index : _i >= series_max_index; i = 1 <= series_max_index ? ++_i : --_i) {
        offset = this.interval * i;
        if (this.visual_callback != null) {
          this._highlight_enqueue(0, i, offset);
        }
        this.sounder.frequency(this.pitch_mapper.map(this.data.series_value(0, i)), offset);
      }
      this.sounder.stop((series_length * this.interval) / 1000);
    };

    Player.prototype._highlight_enqueue = function(series, row, offset) {
      var callback;
      callback = (function(_this) {
        return function() {
          _this.visual_callback(series, row);
        };
      })(this);
      setTimeout(callback, offset);
    };

    return Player;

  })();

  AudioChart = (function() {
    function AudioChart(options) {
      var callback, context, data_wrapper, error_support, error_type, frequency_pitch_mapper, player, sounder;
      error_support = "Sorry, it seems your browser doesn't support the Web Audio API.";
      context = _audio_context_getter();
      if (context == null) {
        alert(fail);
        throw new Error(fail);
      }
      error_type = "Invalid data type '" + options.type + "' given.";
      data_wrapper = null;
      callback = null;
      switch (options.type) {
        case 'google':
          data_wrapper = new GoogleDataWrapper(options.data);
          if (options['chart'] != null) {
            callback = _google_visual_callback_maker(options['chart']);
          }
          break;
        case 'json':
          data_wrapper = new JSONDataWrapper(options.data);
          break;
        case 'html_table':
          data_wrapper = new HTMLTableDataWrapper(options['html_document'], options['html_table_id']);
          break;
        default:
          alert(error_type);
          throw new Error(error_type);
      }
      frequency_pitch_mapper = new FrequencyPitchMapper(data_wrapper.series_min(0), data_wrapper.series_max(0), options['frequency_low'], options['frequency_high']);
      sounder = new WebAudioSounder(context);
      player = new Player(data_wrapper, frequency_pitch_mapper, sounder, callback);
      player.play();
    }

    return AudioChart;

  })();

  _audio_context_getter = function() {
    if (typeof AudioContext !== "undefined" && AudioContext !== null) {
      return new AudioContext;
    } else if (typeof webkitAudioContext !== "undefined" && webkitAudioContext !== null) {
      return new webkitAudioContext;
    } else {
      return null;
    }
  };

  _google_visual_callback_maker = function(chart) {
    return function(series, row) {
      chart.setSelection([
        {
          'row': row,
          'column': series + 1
        }
      ]);
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.AudioChart = AudioChart;
    exports.DataWrapper = DataWrapper;
    exports.GoogleDataWrapper = GoogleDataWrapper;
    exports.JSONDataWrapper = JSONDataWrapper;
    exports.HTMLTableDataWrapper = HTMLTableDataWrapper;
    exports.PitchMapper = PitchMapper;
    exports.FrequencyPitchMapper = FrequencyPitchMapper;
    exports.NotePitchMapper = NotePitchMapper;
    exports.WebAudioSounder = WebAudioSounder;
    exports.Player = Player;
    exports._google_visual_callback_maker = _google_visual_callback_maker;
  } else {
    this['AudioChart'] = AudioChart;
    this['DataWrapper'] = DataWrapper;
    this['GoogleDataWrapper'] = GoogleDataWrapper;
    this['JSONDataWrapper'] = JSONDataWrapper;
    this['HTMLTableDataWrapper'] = HTMLTableDataWrapper;
    this['PitchMapper'] = PitchMapper;
    this['FrequencyPitchMapper'] = FrequencyPitchMapper;
    this['NotePitchMapper'] = NotePitchMapper;
    this['WebAudioSounder'] = WebAudioSounder;
    this['Player'] = Player;
    this['_google_visual_callback_maker'] = _google_visual_callback_maker;
  }

}).call(this);

//# sourceMappingURL=audiochart.js.map
