/* The common DataWrapper 'interface' is validated via the tests
   Note: it is not done as a superclass (as PitchMapper is below) because
         there's really nothing in common implementation-wise; only the
         interface is shared.
var DataWrapper = (function() {
	function DataWrapper(data) {
		throw Error('Please use a derived object.');
	}

	DataWrapper.prototype.num_series = function() {};
	DataWrapper.prototype.series_names = function() {};
	DataWrapper.prototype.series_min = function(series) {};
	DataWrapper.prototype.series_max = function(series) {};
	DataWrapper.prototype.series_value = function(series, index) {};
	DataWrapper.prototype.series_length = function(series) {};

	return DataWrapper;
})();*/


var GoogleDataWrapper = (function() {
	function GoogleDataWrapper(data) {
		this.data = data;
	}

	GoogleDataWrapper.prototype.num_series = function() {
		return this.data.getNumberOfColumns() - 1;
	};

	GoogleDataWrapper.prototype.series_names = function() {
		var results = [];
		for (var i = 0; i < this.data.getNumberOfColumns() - 1; i++) {
			results.push(this.data.getColumnLabel(i));
		}
		return results;
	};

	GoogleDataWrapper.prototype.series_min = function(series) {
		return this.data.getColumnRange(series + 1).min;
	};

	GoogleDataWrapper.prototype.series_max = function(series) {
		return this.data.getColumnRange(series + 1).max;
	};

	GoogleDataWrapper.prototype.series_value = function(series, index) {
		return this.data.getValue(index, series + 1);
	};

	GoogleDataWrapper.prototype.series_length = function(series) {
		return this.data.getNumberOfRows();
	};

	return GoogleDataWrapper;
})();


var JSONDataWrapper = (function() {
	function JSONDataWrapper(json) {
		if (typeof json === 'string') {
			this.object = JSON.parse(json);
		} else if (typeof json === 'object') {
			this.object = json;
		} else {
			throw Error("Please provide a JSON string or derived object.");
		}
	}

	JSONDataWrapper.prototype.num_series = function() {
		return this.object.data.length;
	};

	JSONDataWrapper.prototype.series_names = function() {
		var results = [];
		for (var i = 0; i < this.object.data.length; i++) {
			results.push(this.object.data[i].series);
		}
		return results;
	};

	JSONDataWrapper.prototype.series_min = function(series) {
		return Math.min.apply(this, this.object.data[series].values);
	};

	JSONDataWrapper.prototype.series_max = function(series) {
		return Math.max.apply(this, this.object.data[series].values);
	};

	JSONDataWrapper.prototype.series_value = function(series, index) {
		return this.object.data[series].values[index];
	};

	JSONDataWrapper.prototype.series_length = function(series) {
		return this.object.data[series].values.length;
	};

	return JSONDataWrapper;
})();


var HTMLTableDataWrapper = (function() {
	function HTMLTableDataWrapper(table) {
		this.table = table;
		if (!this.table) {
			throw Error("No table given.");
		}
	}

	HTMLTableDataWrapper.prototype.num_series = function() {
		return this.table.getElementsByTagName('tr')[0].children.length;
	};

	HTMLTableDataWrapper.prototype.series_names = function() {
		var header_cells = this.table.getElementsByTagName('th');
		var results = [];
		for (var i = 0; i < header_cells.length; i++) {
			results.push(header_cells[i].textContent);
		}
		return results;
	};

	HTMLTableDataWrapper.prototype._series_floats = function(series) {
		var data_cells = this.table.getElementsByTagName('td');
		var results = [];
		for (var i = 0; i < data_cells.length; i++) {
			results.push(parseFloat(data_cells[i].textContent));
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
})();


var PitchMapper = (function() {
	function PitchMapper(minimum_datum, maximum_datum) {
		this.minimum_datum = minimum_datum;
		this.maximum_datum = maximum_datum;
		if (this.minimum_datum > this.maximum_datum) {
			throw Error('minimum datum should be <= maximum datum');
		}
	}

	PitchMapper.prototype.map = function(datum) {};  // FIXME naming conflict?

	return PitchMapper;
})();


var FrequencyPitchMapper = (function() {
	function FrequencyPitchMapper(minimum_datum, maximum_datum, minimum_frequency, maximum_frequency) {
		this.minimum_frequency = minimum_frequency;
		this.maximum_frequency = maximum_frequency;
		PitchMapper.call(this, minimum_datum, maximum_datum);
		if (this.minimum_frequency > this.maximum_frequency) {
			throw Error('minimum frequency should be <= maximum frequency');
		}
		this.data_range = this.maximum_datum - this.minimum_datum;
	}

	FrequencyPitchMapper.prototype = Object.create(PitchMapper.prototype);
	FrequencyPitchMapper.prototype.constructor = FrequencyPitchMapper;

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
})();


var NotePitchMapper = (function() {
	function NotePitchMapper() {
		return PitchMapper.apply(this, arguments);
	}

	NotePitchMapper.prototype = Object.create(PitchMapper.prototype);
	NotePitchMapper.prototype.constructor = NotePitchMapper;

	return NotePitchMapper;
})();


var WebAudioSounder = (function() {
	function WebAudioSounder(context) {
		this.context = context;
		this.oscillator = this.context.createOscillator();
	}

	WebAudioSounder.prototype.start = function() {
		this.oscillator.connect(this.context.destination);
		this.oscillator.start(0);
	};

	WebAudioSounder.prototype.frequency = function(frequency, offset) {
		var callback = (function(that) {
			return function() {
				that.oscillator.frequency.value = frequency;
			};
		})(this);
		setTimeout(callback, offset);
	};

	WebAudioSounder.prototype.stop = function(offset) {
		this.oscillator.stop(this.context.currentTime + offset);
	};

	return WebAudioSounder;
})();


var Player = (function() {
	function Player(duration, data, pitch_mapper, sounder, visual_callback) {
		this.data = data;
		this.pitch_mapper = pitch_mapper;
		this.sounder = sounder;
		if (arguments.length < 5) {
			this.visual_callback = null;
		} else {
			this.visual_callback = visual_callback;
		}
		this.interval = duration / this.data.series_length(0);
	}

	Player.prototype.play = function() {
		// FIXME
		var i, offset, series_length, series_max_index, _i;
		series_length = this.data.series_length(0);
		series_max_index = series_length - 1;
		this.sounder.start(0);
		if (this.visual_callback !== null) {
			this.visual_callback(0, 0);
		}
		this.sounder.frequency(this.pitch_mapper.map(this.data.series_value(0, 0)));
		for (i = _i = 1; 1 <= series_max_index ? _i <= series_max_index : _i >= series_max_index; i = 1 <= series_max_index ? ++_i : --_i) {
			offset = this.interval * i;
			if (this.visual_callback !== null) {
				this._highlight_enqueue(0, i, offset);
			}
			this.sounder.frequency(this.pitch_mapper.map(this.data.series_value(0, i)), offset);
		}
		this.sounder.stop((series_length * this.interval) / 1000);
	};

	Player.prototype._highlight_enqueue = function(series, row, offset) {
		var callback = (function(that) {
			return function() {
				that.visual_callback(series, row);
			};
		})(this);
		setTimeout(callback, offset);
	};

	return Player;
})();


var AudioChart = (function() {
	function AudioChart(options, context) {
		var fail = "Sorry, your browser doesn't support the Web Audio API.";
		if (arguments.length < 2) {
			context = AudioContextGetter.get();
			if (context === null) {
				throw Error(fail);
			}
		}
		return _AudioChart(options, context);
	}
	return AudioChart;
})();


var AudioContextGetter = (function() {
	function AudioContextGetter() {}

	var audio_context = null;

	var _get_audio_context = function() {
		if (window.AudioContext !== undefined) {
			return new window.AudioContext();
		} else if (window.webkitAudioContext !== undefined) {
			return new window.webkitAudioContext();
		} else {
			return null;
		}
	};

	AudioContextGetter.get = function() {
		return audio_context !== null ? audio_context : audio_context = _get_audio_context();
	};

	return AudioContextGetter;
})();


var _AudioChart = (function() {
	function _AudioChart(options, context) {
		var data_wrapper, callback, frequency_pitch_mapper, sounder, player;

		var result = _AudioChart._assign_wrapper_callback(options);
		data_wrapper = new result.wrapper(result.parameter);
		callback = result.callback;

		frequency_pitch_mapper = new FrequencyPitchMapper(
			data_wrapper.series_min(0),
			data_wrapper.series_max(0),
			options.frequency_low,
			options.frequency_high
		);

		sounder = new WebAudioSounder(context);

		player = new Player(
			options.duration,
			data_wrapper,
			frequency_pitch_mapper,
			sounder,
			callback
		);

		player.play();
	}

	// This is being done as a sort of 'class/static method' because
	// it doesn't need 'this'.
	// http://stackoverflow.com/a/1635143
	_AudioChart._assign_wrapper_callback = function(options) {
		var result = {
			'wrapper': null,
			'parameter': null,
			'callback': null
		};

		switch (options.type) {
			case 'google':
				result.wrapper = GoogleDataWrapper;
				result.parameter = options.data;
				if (options.hasOwnProperty('chart')) {
					result.callback =
						google_visual_callback_maker(options.chart);
				}
				break;
			case 'json':
				result.wrapper = JSONDataWrapper;
				result.parameter = options.data;
				break;
			case 'html_table':
				result.wrapper = HTMLTableDataWrapper;
				result.parameter = options.table;
				if (options.hasOwnProperty('highlight_class')) {
					result.callback = html_table_visual_callback_maker(
						options.table,
						options.highlight_class
					);
				}
				break;
			default:
				throw Error("Invalid data type '" + options.type + "' given.");
		}

		return result;
	};

	return _AudioChart;
})();


var google_visual_callback_maker = function(chart) {
	return function(series, row) {
		chart.setSelection([
				{
					'row': row,
					'column': series + 1
				}
		]);
	};
};


var html_table_visual_callback_maker = function(table, class_name) {
	return function(series, row) {
		// FIXME tidy up
		var cell, _i, _len, _ref;
		_ref = table.getElementsByTagName('td');
		for (_i = 0, _len = _ref.length; _i < _len; _i++) {
			cell = _ref[_i];
			cell.className = '';
		}
		cell = table.getElementsByTagName('td')[row];
		cell.className = class_name;
	};
};
