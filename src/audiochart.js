'use strict'

/* The common DataWrapper 'interface' is validated via the tests
   Note: it is not done as a superclass (as PitchMapper is below) because
         there's really nothing in common implementation-wise; only the
         interface is shared.
var DataWrapper = (function() {
	function DataWrapper(data) {
		throw Error('Please use a derived object.');
	}

	DataWrapper.prototype.numSeries = function() {};
	DataWrapper.prototype.seriesNames = function() {};
	DataWrapper.prototype.seriesMin = function(series) {};
	DataWrapper.prototype.seriesMax = function(series) {};
	DataWrapper.prototype.seriesValue = function(series, index) {};
	DataWrapper.prototype.seriesLength = function(series) {};

	return DataWrapper;
})();*/


var GoogleDataWrapper = (function() {
	function GoogleDataWrapper(data) {
		this.data = data
	}

	GoogleDataWrapper.prototype.numSeries = function() {
		return this.data.getNumberOfColumns() - 1
	}

	GoogleDataWrapper.prototype.seriesNames = function() {
		var results = []
		for (var i = 0; i < this.data.getNumberOfColumns() - 1; i++) {
			results.push(this.data.getColumnLabel(i))
		}
		return results
	}

	GoogleDataWrapper.prototype.seriesMin = function(series) {
		return this.data.getColumnRange(series + 1).min
	}

	GoogleDataWrapper.prototype.seriesMax = function(series) {
		return this.data.getColumnRange(series + 1).max
	}

	GoogleDataWrapper.prototype.seriesValue = function(series, index) {
		return this.data.getValue(index, series + 1)
	}

	GoogleDataWrapper.prototype.seriesLength = function(series) {
		return this.data.getNumberOfRows()
	}

	return GoogleDataWrapper
})()


var JSONDataWrapper = (function() {
	function JSONDataWrapper(json) {
		if (typeof json === 'string') {
			this.object = JSON.parse(json)
		} else if (typeof json === 'object') {
			this.object = json
		} else {
			throw Error('Please provide a JSON string or derived object.')
		}
	}

	JSONDataWrapper.prototype.numSeries = function() {
		return this.object.data.length
	}

	JSONDataWrapper.prototype.seriesNames = function() {
		var results = []
		for (var i = 0; i < this.object.data.length; i++) {
			results.push(this.object.data[i].series)
		}
		return results
	}

	JSONDataWrapper.prototype.seriesMin = function(series) {
		return Math.min.apply(this, this.object.data[series].values)
	}

	JSONDataWrapper.prototype.seriesMax = function(series) {
		return Math.max.apply(this, this.object.data[series].values)
	}

	JSONDataWrapper.prototype.seriesValue = function(series, index) {
		return this.object.data[series].values[index]
	}

	JSONDataWrapper.prototype.seriesLength = function(series) {
		return this.object.data[series].values.length
	}

	return JSONDataWrapper
})()


var HTMLTableDataWrapper = (function() {
	function HTMLTableDataWrapper(table) {
		this.table = table
		if (!this.table) {
			throw Error('No table given.')
		}
	}

	HTMLTableDataWrapper.prototype.numSeries = function() {
		return this.table.getElementsByTagName('tr')[0].children.length
	}

	HTMLTableDataWrapper.prototype.seriesNames = function() {
		var headerCells = this.table.getElementsByTagName('th')
		var results = []
		for (var i = 0; i < headerCells.length; i++) {
			results.push(headerCells[i].textContent)
		}
		return results
	}

	HTMLTableDataWrapper.prototype._seriesFloats = function(series) {
		var dataCells = this.table.getElementsByTagName('td')
		var results = []
		for (var i = 0; i < dataCells.length; i++) {
			results.push(parseFloat(dataCells[i].textContent))
		}
		return results
	}

	HTMLTableDataWrapper.prototype.seriesMin = function(series) {
		return Math.min.apply(this, this._seriesFloats(series))
	}

	HTMLTableDataWrapper.prototype.seriesMax = function(series) {
		return Math.max.apply(this, this._seriesFloats(series))
	}

	HTMLTableDataWrapper.prototype.seriesValue = function(series, index) {
		return parseFloat(this.table.getElementsByTagName('tr')[index + 1].children[series].textContent)
	}

	HTMLTableDataWrapper.prototype.seriesLength = function(series) {
		return this.table.getElementsByTagName('tr').length - 1
	}

	return HTMLTableDataWrapper
})()


var PitchMapper = (function() {
	function PitchMapper(minimumDatum, maximumDatum) {
		this.minimumDatum = minimumDatum
		this.maximumDatum = maximumDatum
		if (this.minimumDatum > this.maximumDatum) {
			throw Error('minimum datum should be <= maximum datum')
		}
	}

	PitchMapper.prototype.map = function(datum) {}  // FIXME naming conflict?

	return PitchMapper
})()


var FrequencyPitchMapper = (function() {
	function FrequencyPitchMapper(minimumDatum, maximumDatum, minimumFrequency, maximumFrequency) {
		this.minimumFrequency = minimumFrequency
		this.maximumFrequency = maximumFrequency
		PitchMapper.call(this, minimumDatum, maximumDatum)
		if (this.minimumFrequency > this.maximumFrequency) {
			throw Error('minimum frequency should be <= maximum frequency')
		}
		this.dataRange = this.maximumDatum - this.minimumDatum
	}

	FrequencyPitchMapper.prototype = Object.create(PitchMapper.prototype)
	FrequencyPitchMapper.prototype.constructor = FrequencyPitchMapper

	FrequencyPitchMapper.prototype.map = function(datum) {
		var ratio
		if (this.dataRange) {
			ratio = (datum - this.minimumDatum) / this.dataRange
		} else {
			ratio = 0.5
		}
		return this.minimumFrequency + ratio * (this.maximumFrequency - this.minimumFrequency)
	}

	return FrequencyPitchMapper
})()


var WebAudioSounder = (function() {
	function WebAudioSounder(context) {
		this.context = context
		this.oscillator = this.context.createOscillator()
	}

	WebAudioSounder.prototype.start = function() {
		this.oscillator.connect(this.context.destination)
		this.oscillator.start(0)
	}

	WebAudioSounder.prototype.frequency = function(frequency, offset) {
		var callback = (function(that) {
			return function() {
				that.oscillator.frequency.value = frequency
			}
		})(this)
		setTimeout(callback, offset)
	}

	WebAudioSounder.prototype.stop = function(offset) {
		this.oscillator.stop(this.context.currentTime + offset)
	}

	return WebAudioSounder
})()


var Player = (function() {
	function Player(duration, data, pitchMapper, sounder, visualCallback) {
		this.data = data
		this.pitchMapper = pitchMapper
		this.sounder = sounder
		if (arguments.length < 5) {
			this.visualCallback = null
		} else {
			this.visualCallback = visualCallback
		}
		this.interval = duration / this.data.seriesLength(0)
	}

	Player.prototype.play = function() {
		var seriesLength = this.data.seriesLength(0)
		var seriesMaxIndex = seriesLength - 1

		this.sounder.start(0)
		if (this.visualCallback !== null) {
			this.visualCallback(0, 0)
		}
		this.sounder.frequency(this.pitchMapper.map(this.data.seriesValue(0, 0)))
		for (var i = 1; i <= seriesMaxIndex; i++) {
			var offset = this.interval * i
			if (this.visualCallback !== null) {
				this._highlightEnqueue(0, i, offset)
			}
			this.sounder.frequency(this.pitchMapper.map(this.data.seriesValue(0, i)), offset)
		}
		this.sounder.stop((seriesLength * this.interval) / 1000)
	}

	Player.prototype._highlightEnqueue = function(series, row, offset) {
		var callback = (function(that) {
			return function() {
				that.visualCallback(series, row)
			}
		})(this)
		setTimeout(callback, offset)
	}

	return Player
})()


var AudioContextGetter = (function() {
	function AudioContextGetter() {}

	var audioContext = null

	var _getAudioContext = function() {
		if (window.AudioContext !== undefined) {
			return new window.AudioContext()
		} else if (window.webkitAudioContext !== undefined) {
			/* eslint-disable new-cap */
			return new window.webkitAudioContext()
			/* eslint-enable new-cap */
		}
		return null
	}

	AudioContextGetter.get = function() {
		return audioContext !== null ? audioContext : audioContext = _getAudioContext()
	}

	return AudioContextGetter
})()


var googleVisualCallbackMaker = function(chart) {
	return function(series, row) {
		chart.setSelection([
			{
				'row': row,
				'column': series + 1
			}
		])
	}
}


var htmlTableVisualCallbackMaker = function(table, className) {
	return function(series, row) {
		var tds = table.getElementsByTagName('td')
		var cell  // TODO remove
		for (var i = 0; i < tds.length; i++) {
			cell = tds[i]
			cell.classList.remove(className)
		}
		cell = table.getElementsByTagName('td')[row]
		cell.classList.add(className)
	}
}


var _AudioChart = (function() {
	function _AudioChart(options, context) {
		var result = _AudioChart._assignWrapperCallback(options)
		var dataWrapper = new result.Wrapper(result.parameter)
		var callback = result.callback

		var frequencyPitchMapper = new FrequencyPitchMapper(
			dataWrapper.seriesMin(0),
			dataWrapper.seriesMax(0),
			options.frequency_low,
			options.frequency_high
		)

		var sounder = new WebAudioSounder(context)

		var player = new Player(
			options.duration,
			dataWrapper,
			frequencyPitchMapper,
			sounder,
			callback
		)

		player.play()
	}

	// This is being done as a sort of 'class/static method' because
	// it doesn't need 'this'.
	// http://stackoverflow.com/a/1635143
	_AudioChart._assignWrapperCallback = function(options) {
		var result = {
			'Wrapper': null,
			'parameter': null,
			'callback': null
		}

		switch (options.type) {
			case 'google':
				result.Wrapper = GoogleDataWrapper
				result.parameter = options.data
				if (options.hasOwnProperty('chart')) {
					result.callback =
						googleVisualCallbackMaker(options.chart)
				}
				break
			case 'json':
				result.Wrapper = JSONDataWrapper
				result.parameter = options.data
				break
			case 'html_table':
				result.Wrapper = HTMLTableDataWrapper
				result.parameter = options.table
				if (options.hasOwnProperty('highlight_class')) {
					result.callback = htmlTableVisualCallbackMaker(
						options.table,
						options.highlight_class
					)
				}
				break
			default:
				throw Error("Invalid data type '" + options.type + "' given.")
		}

		return result
	}

	return _AudioChart
})()


var AudioChart = (function() {
	function AudioChart(options, context) {
		var fail = "Sorry, your browser doesn't support the Web Audio API."
		if (arguments.length < 2) {
			context = AudioContextGetter.get()
			if (context === null) {
				throw Error(fail)
			}
		}
		return _AudioChart(options, context)
	}
	return AudioChart
})()
