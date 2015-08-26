(function() {
  var AudioChart, DataWrapper, FrequencyPitchMapper, GoogleDataWrapper, HTMLTableDataWrapper, JSONDataWrapper, NotePitchMapper, PitchMapper, Player, WebAudioSounder, _audio_context_getter, _google_visual_callback_maker, _html_table_visual_callback_maker,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

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

  GoogleDataWrapper = (function(superClass) {
    extend(GoogleDataWrapper, superClass);

    function GoogleDataWrapper(data) {
      this.data = data;
    }

    GoogleDataWrapper.prototype.num_series = function() {
      return this.data.getNumberOfColumns() - 1;
    };

    GoogleDataWrapper.prototype.series_names = function() {
      var i, j, ref, results;
      results = [];
      for (i = j = 1, ref = this.data.getNumberOfColumns() - 1; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
        results.push(this.data.getColumnLabel(i));
      }
      return results;
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

  JSONDataWrapper = (function(superClass) {
    extend(JSONDataWrapper, superClass);

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
      var chunk, j, len, ref, results;
      ref = this.object.data;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        chunk = ref[j];
        results.push(chunk.series);
      }
      return results;
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

  HTMLTableDataWrapper = (function(superClass) {
    extend(HTMLTableDataWrapper, superClass);

    function HTMLTableDataWrapper(table1) {
      this.table = table1;
      if (!this.table) {
        throw new Error("No table given.");
      }
    }

    HTMLTableDataWrapper.prototype.num_series = function() {
      return this.table.getElementsByTagName('tr')[0].children.length;
    };

    HTMLTableDataWrapper.prototype.series_names = function() {
      var element, j, len, ref, results;
      ref = this.table.getElementsByTagName('th');
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        element = ref[j];
        results.push(element.textContent);
      }
      return results;
    };

    HTMLTableDataWrapper.prototype._series_floats = function(series) {
      var element, j, len, ref, results;
      ref = this.table.getElementsByTagName('td');
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        element = ref[j];
        results.push(parseFloat(element.textContent));
      }
      return results;
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
    function PitchMapper(minimum_datum1, maximum_datum1) {
      this.minimum_datum = minimum_datum1;
      this.maximum_datum = maximum_datum1;
      if (this.minimum_datum > this.maximum_datum) {
        throw new Error('minimum datum should be <= maximum datum');
      }
    }

    PitchMapper.prototype.map = function(datum) {};

    return PitchMapper;

  })();

  FrequencyPitchMapper = (function(superClass) {
    extend(FrequencyPitchMapper, superClass);

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

  NotePitchMapper = (function(superClass) {
    extend(NotePitchMapper, superClass);

    function NotePitchMapper() {
      return NotePitchMapper.__super__.constructor.apply(this, arguments);
    }

    return NotePitchMapper;

  })(PitchMapper);

  WebAudioSounder = (function() {
    function WebAudioSounder(context1) {
      this.context = context1;
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
    function Player(duration, data, pitch_mapper, sounder1, visual_callback) {
      this.data = data;
      this.pitch_mapper = pitch_mapper;
      this.sounder = sounder1;
      this.visual_callback = visual_callback != null ? visual_callback : null;
      this.interval = duration / this.data.series_length(0);
    }

    Player.prototype.play = function() {
      var i, j, offset, ref, series_length, series_max_index;
      series_length = this.data.series_length(0);
      series_max_index = series_length - 1;
      this.sounder.start(0);
      if (this.visual_callback != null) {
        this.visual_callback(0, 0);
      }
      this.sounder.frequency(this.pitch_mapper.map(this.data.series_value(0, 0)));
      for (i = j = 1, ref = series_max_index; 1 <= ref ? j <= ref : j >= ref; i = 1 <= ref ? ++j : --j) {
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
      var callback, context, data_wrapper, error_type, fail, frequency_pitch_mapper, player, sounder;
      fail = "Sorry, it seems your browser doesn't support the Web Audio API.";
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
          data_wrapper = new HTMLTableDataWrapper(options.table);
          if (options['highlight_class'] != null) {
            callback = _html_table_visual_callback_maker(options.table, options['highlight_class']);
          }
          break;
        default:
          alert(error_type);
          throw new Error(error_type);
      }
      frequency_pitch_mapper = new FrequencyPitchMapper(data_wrapper.series_min(0), data_wrapper.series_max(0), options['frequency_low'], options['frequency_high']);
      sounder = new WebAudioSounder(context);
      player = new Player(options['duration'], data_wrapper, frequency_pitch_mapper, sounder, callback);
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

  _html_table_visual_callback_maker = function(table, class_name) {
    return function(series, row) {
      var cell, j, len, ref;
      ref = table.getElementsByTagName('td');
      for (j = 0, len = ref.length; j < len; j++) {
        cell = ref[j];
        cell.className = '';
      }
      cell = table.getElementsByTagName('td')[row];
      cell.className = class_name;
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
    exports._html_table_visual_callback_maker = _html_table_visual_callback_maker;
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
    this['_html_table_visual_callback_maker'] = _html_table_visual_callback_maker;
  }

}).call(this);

//# sourceMappingURL=audiochart.js.map
