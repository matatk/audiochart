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
 *       of different options required for different chart types would be less *       clear.)
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
	 * @param {options} options - AudioChart options
	 * @param {AudioContext} context - the window's AudioContext
	 */
	constructor(options) {
		const context = getAudioContext()

		if (context === null) {
			throw Error("Sorry, your browser doesn't support the Web Audio API.")
		}

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
				throw Error('Options must include a data key')
		}

		const result = AudioChart._assignWrapperCallback(options)
		const dataWrapper = new result.Wrapper(result.parameter)  // TODO would this be neater if it created and returned by the wrapper assignment function?
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
			default:
				throw Error("Invalid data type '" + options.type + "' given.")
		}

		return result
	}
}
