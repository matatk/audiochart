'use strict'
/** @module */
/* exported AudioChart */

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


/**
 * @private
 * @implements {DataWrapper}
 * @param {GoogleDataTable} data - The in-memory GoogleDataTable
 */
class GoogleDataWrapper {
	constructor(data) {
		this.data = data
	}

	numSeries() {
		return this.data.getNumberOfColumns() - 1
	}

	seriesNames() {
		const results = []
		for (let i = 0; i < this.data.getNumberOfColumns() - 1; i++) {
			results.push(this.data.getColumnLabel(i))
		}
		return results
	}

	seriesMin(series) {
		return this.data.getColumnRange(series + 1).min
	}

	seriesMax(series) {
		return this.data.getColumnRange(series + 1).max
	}

	seriesValue(series, index) {
		return this.data.getValue(index, series + 1)
	}

	seriesLength(series) {
		return this.data.getNumberOfRows()
	}
}


/**
 * @private
 * @implements {DataWrapper}
 * @param {JSON} json - The JSON data, as a string or object
 */
class JSONDataWrapper {
	constructor(json) {
		if (typeof json === 'string') {
			this.object = JSON.parse(json)
		} else if (typeof json === 'object') {
			this.object = json
		} else {
			throw Error('Please provide a JSON string or derived object.')
		}
	}

	numSeries() {
		return this.object.data.length
	}

	seriesNames() {
		const results = []
		for (let i = 0; i < this.object.data.length; i++) {
			results.push(this.object.data[i].series)
		}
		return results
	}

	seriesMin(series) {
		return Math.min.apply(this, this.object.data[series].values)
	}

	seriesMax(series) {
		return Math.max.apply(this, this.object.data[series].values)
	}

	seriesValue(series, index) {
		return this.object.data[series].values[index]
	}

	seriesLength(series) {
		return this.object.data[series].values.length
	}
}


/**
 * @private
 * @implements {DataWrapper}
 * @param {HTMLTableElement} table - The in-DOM table element
 * @todo check it's a table
 */
class HTMLTableDataWrapper {
	constructor(table) {
		this.table = table
		if (!this.table) {
			throw Error('No table given.')
		}
	}

	numSeries() {
		return this.table.getElementsByTagName('tr')[0].children.length
	}

	seriesNames() {
		const headerCells = this.table.getElementsByTagName('th')
		const results = []
		for (let i = 0; i < headerCells.length; i++) {
			results.push(headerCells[i].textContent)
		}
		return results
	}

	_seriesFloats(series) {
		const dataCells = this.table.getElementsByTagName('td')
		const results = []
		for (let i = 0; i < dataCells.length; i++) {
			results.push(parseFloat(dataCells[i].textContent))
		}
		return results
	}

	seriesMin(series) {
		return Math.min.apply(this, this._seriesFloats(series))
	}

	seriesMax(series) {
		return Math.max.apply(this, this._seriesFloats(series))
	}

	seriesValue(series, index) {
		return parseFloat(this.table.getElementsByTagName('tr')[index + 1].children[series].textContent)
	}

	seriesLength(series) {
		return this.table.getElementsByTagName('tr').length - 1
	}
}


/**
 * @private
 * @param {number} minimumDatum - the minimum value in this data series
 * @param {number} maximumDatum - the maximum value in this data series
 */
class PitchMapper {
	constructor(minimumDatum, maximumDatum) {
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
	map(datum) {}  // FIXME naming conflict?
}


/**
 * @private
 * @extends {PitchMapper}
 * @param {number} minimumDatum - the minimum value in this data series
 * @param {number} maximumDatum - the maximum value in this data series
 * @param {number} minimumFrequency - the minimum output frequency
 * @param {number} maximumFrequency - the maximum output frequency
 */
class FrequencyPitchMapper extends PitchMapper {
	constructor(minimumDatum, maximumDatum, minimumFrequency, maximumFrequency) {
		super(minimumDatum, maximumDatum)
		this.minimumFrequency = minimumFrequency
		this.maximumFrequency = maximumFrequency
		if (this.minimumFrequency > this.maximumFrequency) {
			throw Error('minimum frequency should be <= maximum frequency')
		}
		this.dataRange = this.maximumDatum - this.minimumDatum
	}

	/**
	 * @param {number} datum - the datum to be mapped
	 * @returns {number} frequency for this datum
	 */
	map(datum) {
		let ratio
		if (this.dataRange) {
			ratio = (datum - this.minimumDatum) / this.dataRange
		} else {
			ratio = 0.5
		}
		return this.minimumFrequency + ratio * (this.maximumFrequency - this.minimumFrequency)
	}
}


/**
 * @private
 * @param {AudioContext} context - the Web Audio API context
 */
class WebAudioSounder {
	constructor(context) {
		this.context = context
	}

	/**
	 * Start the oscillator
	 */
	start() {
		// Oscillators cannot be re-used
		this.oscillator = this.context.createOscillator()
		this.oscillator.connect(this.context.destination)
		this.oscillator.start(0)
	}

	/**
	 * Set the frequency of the oscillator at a given point in time
	 * @param {number} frequency - the frequency to change to
	 */
	frequency(frequency) {
		this.oscillator.frequency.value = frequency
	}

	/**
	 * Stop the oscillator at a given time
	 */
	stop() {
		this.oscillator.stop()
	}
}

/**
 * Orchestrates the audible (and visual cursor) rendering of the chart
 * @private
 * @param {integer} duration - the length of the rendering in milliseconds
 * @param {DataWrapper} data - the underlying data (wrapped in interface)
 * @param {PitchMapper} pitchMapper - maps data to pitches
 * @param {WebAudioSounder} sounder - the sounder object
 * @param {VisualCallback} visualCallback - the callback function that highlights the current datum
 */
class Player {
	constructor(duration, data, pitchMapper, sounder, visualCallback) {
		const minInterval = 10  // ms between soundings of successive datum points

		this.data = data
		this.pitchMapper = pitchMapper
		this.sounder = sounder
		if (arguments.length < 5) {
			this.visualCallback = null
		} else {
			this.visualCallback = visualCallback
		}

		const seriesLen = this.data.seriesLength(0)

		const sampling = Player.samplingInfo(duration, seriesLen)
		this.interval = sampling.interval
		this.sampleOneIn = sampling.in

		this.seriesMaxIndex = seriesLen - 1  // TODO just use seriesLen?
		this._state = 'ready'
	}

	/* static function to work out sampling rate */
	static samplingInfo(duration, seriesLen) {
		const minInterval = 10
		let interval
		let sampleOneIn
		let slots

		const idealInterval = Math.ceil(duration / seriesLen)
		console.log(`sampleInfo: duration: ${duration}; series length: ${seriesLen}; ideal interval: ${idealInterval}`)

		if (idealInterval < minInterval) {
			interval = minInterval
			slots = Math.floor(duration / minInterval)
			const sampleOneInFloat = seriesLen / slots
			sampleOneIn = Math.round(seriesLen / slots)
			console.log(`sampleInfo: Need to sample 1 in ${sampleOneIn} (${sampleOneInFloat})`)
		} else {
			slots = Math.floor(duration / minInterval)
			interval = idealInterval
			sampleOneIn = 1
		}

		console.log(`sampleInfo: it will take ${ (seriesLen / sampleOneIn) * interval}`)

		return {
			'sample': 1,
			'in': sampleOneIn,
			'interval': interval
		}
	}

	/**
	 * Main entry point; manages state.
	 */
	playPause() {
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
	_play() {
		// Debugging info
		this.playTimes = []  // store all lengths of time that playOne took
		this.playCount = 0   // how many datum points were actually sounded?

		this.startTime = performance.now()
		this.sounder.start(0)
		this.playIndex = 0

		this._playLoop()
	}

	/**
	 * Update state and set _playOne() to run regularly, to render the sound
	 * (and optional visual cursor movement).
	 */
	_playLoop() {
		this._state = 'playing'
		this._playOne()  // so that it starts immediately
		this.intervalID = setInterval(() => this._playOne(), this.interval)
	}

	/**
	 * This is where the sound is actually played.  If a visual callback was
	 * specified, this also coordinates the visual highlighting of the current
	 * datum as the playback occurs.
	 */
	_playOne() {
		const thisPlayTimeStart = performance.now()

		if (this.playIndex <= this.seriesMaxIndex) {
			if (this.visualCallback !== null) {
				this.visualCallback(0, this.playIndex)
			}

			this.sounder.frequency(
				this.pitchMapper.map(
					this.data.seriesValue(0, this.playIndex)))
		} else {
			clearInterval(this.intervalID)
			this.sounder.stop()
			this._state = 'finished'

			// Debugging info
			console.log(`Player: Playing ${this.playCount} of ${this.playIndex} took ${Math.round(performance.now() - this.startTime)} ms`)
			const sum = this.playTimes.reduce((acc, cur) => acc + cur)
			const mean = sum / this.playTimes.length
			console.log(`Player: Average play func time: ${mean.toFixed(2)} ms`)
		}

		this.playIndex += this.sampleOneIn > 0 ? this.sampleOneIn : 1  // TODO sl
		this.playCount += 1
		this.playTimes.push(performance.now() - thisPlayTimeStart)
	}

	/**
	 * Temporarily pause the rendering of the chart.
	 * This inherently keeps the sound going at the frequency it was at when
	 * the pause was triggered.
	 * @todo feature/object to stop/fade the sound after n seconds?
	 */
	_pause() {
		clearInterval(this.intervalID)
		this._state = 'paused'
	}

	stepBackward(skip) {
		const delta = skip || 50
		this.playIndex -= delta
		if (this.playIndex < 0) {
			this.playIndex = 0  // TODO test limiting
		}
		if (this._state === 'paused') {
			this._playOne()
		}
	}

	stepForward(skip) {
		const delta = skip || 50
		this.playIndex += delta
		if (this.playIndex > this.seriesMaxIndex) {
			this.playIndex = this.seriesMaxIndex  // TODO test limiting
		}
		if (this._state === 'paused') {
			this._playOne()
		}
	}
}


/**
 * Ensures that there is only one Web Audio context per page.
 * Sets up a new AudioContext the first time it's called; then re-uses it.
 * @private
 * @returns {AudioContext} page-global Web Audio context
 */
var getAudioContext = (function() {
	let audioContext = null

	if (window.AudioContext !== undefined) {
		audioContext = new window.AudioContext()
	} else if (window.webkitAudioContext !== undefined) {
		/* eslint-disable new-cap */
		audioContext = new window.webkitAudioContext()
		/* eslint-enable new-cap */
	}

	function _getAudioContext() {
		return audioContext
	}

	return _getAudioContext
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


/**
 * @private
 * @param {HTMLDivElement} container - The DIV containing the chart
 * @param {Player} player - AudioChart Player object
 * @todo mark up the DIV properly
 * @todo check what sort of element we get given? no; could be button?
 */
class KeyboardHandler {
	constructor(container, player) {
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
	keypressHandler(event) {
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
	handleLeft() {
		this.player.stepBackward()
	}

	/** Handle a right arrow being pressed */
	handleRight() {
		this.player.stepForward()
	}

	/** Handle the space key being pressed */
	handleSpace() {
		this.player.playPause()
	}
}


/** Main object for API consumers. */
class AudioChart {
	/**
	 * This first checks to see if the Web Audio API is available, and
	 * throws an {Error} if not.
	 * @param {options} options - AudioChart options
	 * @param {AudioContext} context - the window's AudioContext
	 */
	constructor(options, context) {
		const fail = "Sorry, your browser doesn't support the Web Audio API."
		if (arguments.length < 2) {
			context = getAudioContext()
			if (context === null) {
				throw Error(fail)
			}
		}

		const result = AudioChart._assignWrapperCallback(options)
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
	playPause() {
		this.player.playPause()
	}

	static _assignWrapperCallback(options) {
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
}
