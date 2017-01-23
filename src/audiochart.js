'use strict'
/** @module */

/**
 * Array index number (starts at zero).
 * Used to specify series and row in visual callbacks.
 * @typedef {integer} index
 */


/**
 * A function that highlights the current datum visually.
 * Different callbacks must be created for different types of chart.
 * @callback VisualCallback
 * @param {index} series - The column of the cell to highlight
 * @param {index} row - The row of the cell to highlight
 */


/**
 * The common interface that the other DataWrappers use.
 *
 * The common DataWrapper 'interface' is validated via the tests.
 *
 * Note: it is not done as a superclass (as {@link PitchMapper} is) because
 *       there's really nothing in common implementation-wise; only the
 *       interface is shared.
 *
 * @interface DataWrapper
 * @private
 * @todo fix the link in this comment
 */
/**
 * Returns the number of series in the underlying data
 * @function DataWrapper#numSeries
 * @returns {integer} The number of series
 */
/**
 * Get a list of the underlying data series names
 * @function DataWrapper#seriesNames
 * @returns {string[]} An array of the series names
 */
/**
 * What is the minimum value in a given series?
 * @function DataWrapper#seriesMin
 * @param {index} series - The series number
 * @returns {Number} The minimum value in the series
 */
/**
 * What is the maximum value in a given series?
 * @function DataWrapper#seriesMax
 * @param {index} series - The series number
 * @returns {Number} The maximum value in the series
 */
/**
 * Get value of specific datum
 * @function DataWrapper#seriesValue
 * @param {index} series - The series number
 * @param {index} index - The row number
 * @todo rename `index` to `row`?
 * @returns {Number} the datum
 */
/**
 * What is the length of a series?
 * @function DataWrapper#seriesLength
 * @param {index} series - The series
 * @returns {integer} The number of data in the series
 */


var GoogleDataWrapper = (function() {
	/**
	 * @constructor GoogleDataWrapper
	 * @private
	 * @implements {DataWrapper}
	 * @param {GoogleDataTable} data - The in-memory GoogleDataTable
	 */
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
	/**
	 * @constructor JSONDataWrapper
	 * @private
	 * @implements {DataWrapper}
	 * @param {JSON} json - The JSON data, as a string or object
	 */
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
	/**
	 * @constructor HTMLTableDataWrapper
	 * @private
	 * @implements {DataWrapper}
	 * @param {HTMLTableElement} table - The in-DOM table element
	 */
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
	/**
	 * @constructor PitchMapper
	 * @private
	 * @param {number} minimumDatum - the minimum value in this data series
	 * @param {number} maximumDatum - the maximum value in this data series
	 */
	function PitchMapper(minimumDatum, maximumDatum) {
		this.minimumDatum = minimumDatum
		this.maximumDatum = maximumDatum
		if (this.minimumDatum > this.maximumDatum) {
			throw Error('minimum datum should be <= maximum datum')
		}
	}

	/**
	 * Map a datum to an output value
	 * @abstract
	 * @param {number} datum - the datum to be mapped
	 */
	PitchMapper.prototype.map = function(datum) {}  // FIXME naming conflict?

	return PitchMapper
})()


var FrequencyPitchMapper = (function() {
	/**
	 * @constructor FrequencyPitchMapper
	 * @private
	 * @extends {PitchMapper}
	 * @param {number} minimumDatum - the minimum value in this data series
	 * @param {number} maximumDatum - the maximum value in this data series
	 * @param {number} minimumFrequency - the minimum output frequency
	 * @param {number} maximumFrequency - the maximum output frequency
	 */
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

	/**
	 * @param {number} datum - the datum to be mapped
	 * @returns {number} frequency for this datum
	 */
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
	/**
	 * @constructor WebAudioSounder
	 * @private
	 * @param {AudioContext} context - the Web Audio API context
	 */
	function WebAudioSounder(context) {
		this.context = context
		this.oscillator = this.context.createOscillator()
	}

	/**
	 * Start the oscillator
	 */
	WebAudioSounder.prototype.start = function() {
		this.oscillator.connect(this.context.destination)
		this.oscillator.start(0)
	}

	/**
	 * Set the frequency of the oscillator at a given point in time
	 * @param {number} frequency - the frequency to change to
	 * @param {integer} offset - the number of milliseconds to elapse before the change
	 */
	WebAudioSounder.prototype.frequency = function(frequency, offset) {
		var callback = (function(that) {
			return function() {
				that.oscillator.frequency.value = frequency
			}
		})(this)
		setTimeout(callback, offset)
	}

	/**
	 * Stop the oscillator at a given time
	 * @param {integer} offset - the number of milliseconds to wait before stopping the oscillator
	 */
	WebAudioSounder.prototype.stop = function(offset) {
		this.oscillator.stop(this.context.currentTime + offset)
	}

	return WebAudioSounder
})()


var Player = (function() {
	/**
	 * @constructor Player
	 * @private
	 * @param {integer} duration - the length of the rendering in milliseconds
	 * @param {DataWrapper} data - the underlying data (wrapped in interface)
	 * @param {PitchMapper} pitchMapper - maps data to pitches
	 * @param {WebAudioSounder} sounder - the sounder object
	 * @param {VisualCallback} visualCallback - the callback function that highlights the current datum
	 */
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

	/**
	 * Play the underlying data as audio.
	 * If a visual callback was specified, this also coordinates the visual
	 * highlighting of the current datum as the playback occurs.
	 */
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

	/**
	 * Set up a visual highlight callback for the future (when the audio
	 * is playing)
	 * @param {index} series - the data series
	 * @param {index} row - the datum within that series
	 * @param {integer} offset - the number of milliseconds before highlighting this datum
	 */
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
	/**
	 * @constructor AudioContextGetter
	 * @private
	 */
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

	/**
	 * @returns {AudioContext} the page-global Web Audio context
	 */
	AudioContextGetter.get = function() {
		return audioContext !== null ? audioContext : audioContext = _getAudioContext()
	}

	return AudioContextGetter
})()


/**
 * Generates a function that moves the cursor on a Google Chart
 * @private
 * @param {GoogleChart} chart - the in-memory GoogleChart object
 * @returns {VisualCallback} the callback
 */
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


/**
 * Generate a callback that can be used to highlight table cells
 * @private
 * @param {HTMLTableElement} table - The in-DOM table element
 * @param {string} className - Name of the CSS highlight class
 * @returns {VisualCallback} The highlighting function
 */
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
	/**
	 * @constructor _AudioChart
	 * @private
	 * @param {options} options - AudioChart options
	 * @param {AudioContext} context - the window's AudioContext
	 */
	function _AudioChart(options, context) {
		var result = _AudioChart._assignWrapperCallback(options)
		var dataWrapper = new result.Wrapper(result.parameter)
		var callback = result.callback

		var frequencyPitchMapper = new FrequencyPitchMapper(
			dataWrapper.seriesMin(0),
			dataWrapper.seriesMax(0),
			options.frequencyLow,
			options.frequencyHigh
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
			case 'htmlTable':
				result.Wrapper = HTMLTableDataWrapper
				result.parameter = options.table
				if (options.hasOwnProperty('highlightClass')) {
					result.callback = htmlTableVisualCallbackMaker(
						options.table,
						options.highlightClass)
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
	/**
	 * Main entry point for API consumers.
	 * This first checks to see if the Web Audio API is available, and
	 * throws an {Error} if not.
	 * @constructor AudioChart
	 * @param {options} options - AudioChart options
	 * @param {AudioContext} context - the window's AudioContext
	 * @returns {_AudioChart} the real AudioChart object
	 */
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


var KeyboardHandler = (function() {
	/**
	 * @constructor KeyboardHandler
	 * @private
	 * @param {HTMLDivElement} container - The `<div>` containing the chart
	 */
	function KeyboardHandler(container) {
		if (!container) {
			throw Error('No container given')
		}
	}

	return KeyboardHandler
})()
