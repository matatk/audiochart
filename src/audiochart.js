'use strict'
/** @module */
/* exported AudioChart */
/* global getAudioContext FrequencyPitchMapper WebAudioSounder Player KeyboardHandler GoogleDataWrapper googleVisualCallbackMaker JSONDataWrapper HTMLTableDataWrapper htmlTableVisualCallbackMaker */

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
