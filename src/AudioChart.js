/** @module */
/* exported AudioChart */
/* global getAudioContext FrequencyPitchMapper WebAudioSounder Player KeyboardHandler GoogleDataWrapper googleVisualCallbackMaker JSONDataWrapper HTMLTableDataWrapper htmlTableVisualCallbackMaker C3DataWrapper c3VisualCallbackMaker */

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
 * @typedef {Object} AudioChartOptions
 * @todo move the documentation here? (Downside is that the branching/groups
 *       of different options required for different chart types would be less
 *       clear.)
 */

/**
 * @typedef {Object} WrapperAndCallbackResults
 * @property {Function} Wrapper - the data wrapper function
 * @property {Object|HTMLTableElement} parameter
 *	the rendered chart, or HTML table
 * @property {VisualCallback} callback
 *	if requested by the user, a callback is created and returned
 */

/** Main object for API consumers */
class AudioChart {
	/**
	 * Create an AudioChart object.
	 * This first checks to see if the Web Audio API is available, and throws
	 * an {Error} if not. Then check the options given by the user.
	 * @param {AudioChartOptions} options - AudioChart options
	 */
	constructor(options) {
		const context = getAudioContext()

		if (context === null) {
			throw Error("Sorry, your browser doesn't support the Web Audio API.")
		}

		// The testing for this next bit is a bit of a fudge as curerntly I've
		// not come up with a beter way than having the testing done on static
		// functions and checking their return values, or if they throw an
		// exception.
		//
		// The thing blocking this is that I don't know how to stub out
		// globally-declared ES6 classes *or* to run each test via Karma in an
		// isolated environment where I can mock those global classes.
		//
		// TODO, as per https://github.com/matatk/audiochart/issues/37

		// Check the passed-in options object for the right keys (not their
		// values—that is checked by each object respectively).
		AudioChart._checkOptions(options)

		// Make a data wrapper of the appropriate class, instantiated with the
		// appropriate data paramater (from options.data) and, optionally, make
		// a visual callback (which may use options.chart, or other options if
		// it's an HTML table visual callback).
		const result = AudioChart._assignWrapperCallback(options)

		// Now everything has been checked, we can set it all up...

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

	/**
	 * Updates an AudioChart object to reflect new options. Can accept a subset
	 * of the standard options, so if only duration changes, then you need only
	 * specify the new duration and not the type and other paramaters.
	 * @param {AudioChartOptions} newOptions - Partial/full AudioChart options
	 */
	updateOptions(newOptions) {
		if (newOptions === undefined || Object.keys(newOptions).length === 0) {
			throw Error('No new options given')
		}
	}

	/**
	 * Checks the passed-in options opbject for validity. This does not perform
	 * detailed checks that are covered in the various components' constructors;
	 * they run such checks themselves.
	 * @param {AudioChartOptions} options - AudioChart options
	 * @private
	 */
	static _checkOptions(options) {
		if (!options.hasOwnProperty('duration')) {
			throw Error('No duration given')
		}

		if (!options.hasOwnProperty('frequencyLow')) {
			throw Error('No minimum frequency given')
		}

		if (!options.hasOwnProperty('frequencyHigh')) {
			throw Error('No maximum frequency given')
		}

		switch (options.type) {
			case 'google':
			case 'c3':
			case 'json':
				if (!options.hasOwnProperty('data')) {
					throw Error("Options must include a 'data' key")
				}
				break
			case 'htmlTable':
				if (!options.hasOwnProperty('table')) {
					throw Error("Options must include a 'table' key")
				}
				break
			default:
				throw Error(`Invalid data type '${options.type}' given.`)
		}
	}

	/**
	 * Works out which data source wrapper and visual callback (if requested)
	 * should be used with this chart.
	 * @param {AudioChartOptions} options - given by the user
	 * @returns {WrapperAndCallbackResults}
	 *	- data wrapper, data wrapper parameter and callback (if applicable)
	 *	  for this chart
	 * @private
	 */
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
			case 'c3':
				result.Wrapper = C3DataWrapper
				result.parameter = options.data
				if (options.hasOwnProperty('chart')) {
					result.callback =
						c3VisualCallbackMaker(options.chart)
				}
				break
		}

		return result
	}
}
