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
		const results = []
		for (let i = 0; i < this.data.getNumberOfColumns() - 1; i++) {
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
		const results = []
		for (let i = 0; i < this.object.data.length; i++) {
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
	 * @todo check it's a table
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
		const headerCells = this.table.getElementsByTagName('th')
		const results = []
		for (let i = 0; i < headerCells.length; i++) {
			results.push(headerCells[i].textContent)
		}
		return results
	}

	HTMLTableDataWrapper.prototype._seriesFloats = function(series) {
		const dataCells = this.table.getElementsByTagName('td')
		const results = []
		for (let i = 0; i < dataCells.length; i++) {
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
		let ratio
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
	}

	/**
	 * Start the oscillator
	 */
	WebAudioSounder.prototype.start = function() {
		// Oscillators cannot be re-used
		this.oscillator = this.context.createOscillator()
		this.oscillator.connect(this.context.destination)
		this.oscillator.start(0)
	}

	/**
	 * Set the frequency of the oscillator at a given point in time
	 * @param {number} frequency - the frequency to change to
	 */
	WebAudioSounder.prototype.frequency = function(frequency) {
		this.oscillator.frequency.value = frequency
	}

	/**
	 * Stop the oscillator at a given time
	 */
	WebAudioSounder.prototype.stop = function() {
		this.oscillator.stop()
	}

	return WebAudioSounder
})()


var Player = (function() {
	/**
	 * Orchestrates the audible (and visual cursor) rendering of the chart
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

		this.interval = Math.ceil(duration / this.data.seriesLength(0))
		console.log('Player: duration', duration, 'interval', this.interval)
		this.seriesMaxIndex = this.data.seriesLength(0) - 1

		this._state = 'ready'
	}

	/**
	 * Main entry point; manages state.
	 */
	Player.prototype.playPause = function() {
		switch (this._state) {
			case 'ready':
				this._play()
				break
			case 'playing':
				this._pause()
				break
			case 'paused':
				this._playLoop()
				break
			case 'finished':
				this._play()
				break
			default:
				throw Error('Player error: invalid state: ' + String(this._state))
		}
	}

	/**
	 * Resets play state and sets up a recurring function to update the sound
	 * (and, optionally, visual callback) at an interval dependant on the
	 * number of data.
	 */
	Player.prototype._play = function() {
		this.startTime = performance.now()
		this.sounder.start(0)
		this.playIndex = 0
		this._playLoop()
	}

	/**
	 * Update state and set _playOne() to run regularly, to render the sound
	 * (and optional visual cursor movement).
	 */
	Player.prototype._playLoop = function() {
		this._state = 'playing'
		this._playOne()  // so that it starts immediately
		const that = this
		this.intervalID = setInterval(function() {
			that._playOne()
		}, this.interval)
	}

	/**
	 * This is where the sound is actually played.  If a visual callback was
	 * specified, this also coordinates the visual highlighting of the current
	 * datum as the playback occurs.
	 */
	Player.prototype._playOne = function() {
		if (this.visualCallback !== null) {
			this.visualCallback(0, this.playIndex)
		}

		this.sounder.frequency(
			this.pitchMapper.map(
				this.data.seriesValue(0, this.playIndex)))

		if (this.playIndex === this.seriesMaxIndex) {
			clearInterval(this.intervalID)
			const that = this
			setTimeout(function() {
				that.sounder.stop()
			}, this.interval)  // TODO test
			this._state = 'finished'
			console.log('playback took:', performance.now() - this.startTime)
		}

		this.playIndex += 1
	}

	/**
	 * Temporarily pause the rendering of the chart.
	 * This inherently keeps the sound going at the frequency it was at when
	 * the pause was triggered.
	 * @todo feature/object to stop/fade the sound after n seconds?
	 */
	Player.prototype._pause = function() {
		clearInterval(this.intervalID)
		this._state = 'paused'
	}

	Player.prototype.stepBackward = function(skip) {
		const delta = skip || 50
		this.playIndex -= delta
		if (this.playIndex < 0) {
			this.playIndex = 0  // TODO test limiting
		}
		if (this._state === 'paused') {
			this._playOne()
		}
	}

	Player.prototype.stepForward = function(skip) {
		const delta = skip || 50
		this.playIndex += delta
		if (this.playIndex > this.seriesMaxIndex) {
			this.playIndex = this.seriesMaxIndex  // TODO test limiting
		}
		if (this._state === 'paused') {
			this._playOne()
		}
	}

	return Player
})()


var AudioContextGetter = (function() {
	/**
	 * @constructor AudioContextGetter
	 * @private
	 */
	function AudioContextGetter() {}

	let audioContext = null

	const _getAudioContext = function() {
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
		const tds = table.getElementsByTagName('td')
		let cell  // TODO remove
		for (let i = 0; i < tds.length; i++) {
			cell = tds[i]
			cell.classList.remove(className)
		}
		cell = table.getElementsByTagName('td')[row]
		cell.classList.add(className)
	}
}


var KeyboardHandler = (function() {
	/**
	 * @constructor KeyboardHandler
	 * @private
	 * @param {HTMLDivElement} container - The DIV containing the chart
	 * @param {Player} player - AudioChart Player object
	 * @todo mark up the DIV properly
	 * @todo check what sort of element we get given? no; could be button?
	 */
	function KeyboardHandler(container, player) {
		if (!container) {
			throw Error('No container given')
		}
		if (!player) {
			throw Error('No Player given')
		}

		container.setAttribute('tabindex', '0')
		container.addEventListener('keydown', this.keypressHandler.bind(this))
		this.player = player
	}

	/**
	 * Handle keypresses
	 *
	 * Note: This is bound to the {@link KeyboardHandler} so that it can call
	 *       the right handler methods.
	 *
	 * @param {KeyboardEvent} event - the KeyboardEvent that occured
	 * @todo make link work
	 */
	KeyboardHandler.prototype.keypressHandler = function(event) {
		event.preventDefault()  // TODO should this be here or later? check for defaultPrevented?

		if (event.key === 'ArrowRight') {
			this.handleRight()
		} else if (event.key === 'ArrowLeft' ) {
			this.handleLeft()
		} else if (event.key === ' ') {
			this.handleSpace()
		}
	}

	/** Handle a left arrow being pressed */
	KeyboardHandler.prototype.handleLeft = function() {
		this.player.stepBackward()
	}

	/** Handle a right arrow being pressed */
	KeyboardHandler.prototype.handleRight = function() {
		this.player.stepForward()
	}

	/** Handle the space key being pressed */
	KeyboardHandler.prototype.handleSpace = function() {
		this.player.playPause()
	}

	return KeyboardHandler
})()


var _AudioChart = (function() {
	/**
	 * @constructor _AudioChart
	 * @private
	 * @param {options} options - AudioChart options
	 * @param {AudioContext} context - the window's AudioContext
	 */
	function _AudioChart(options, context) {
		const result = _AudioChart._assignWrapperCallback(options)
		const dataWrapper = new result.Wrapper(result.parameter)
		const callback = result.callback

		const frequencyPitchMapper = new FrequencyPitchMapper(
			dataWrapper.seriesMin(0),
			dataWrapper.seriesMax(0),
			options.frequencyLow,
			options.frequencyHigh)

		const sounder = new WebAudioSounder(context)

		this.player = new Player(
			options.duration,
			dataWrapper,
			frequencyPitchMapper,
			sounder,
			callback)

		if (options.chartContainer) {
			new KeyboardHandler(
				options.chartContainer,
				this.player)
		}
	}

	/**
	 * Passes through play/pause commands to the Player
	 */
	_AudioChart.prototype.playPause = function() {
		this.player.playPause()
	}

	// This is being done as a sort of 'class/static method' because
	// it doesn't need 'this'.
	// http://stackoverflow.com/a/1635143
	_AudioChart._assignWrapperCallback = function(options) {
		const result = {
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
		const fail = "Sorry, your browser doesn't support the Web Audio API."
		if (arguments.length < 2) {
			context = AudioContextGetter.get()
			if (context === null) {
				throw Error(fail)
			}
		}

		return new _AudioChart(options, context)
	}

	return AudioChart
})()
