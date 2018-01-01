/**
 * Outputs sound using the Web Audio API
 * @private
 * @param {AudioContext} context - the Web Audio API context
 * @param {number} numberOfSeries - number of data series
 */
class Sounder {
	constructor(context, numberOfSeries) {
		if (context === undefined) {
			throw Error('No audio context given')
		}
		this._context = context

		if (numberOfSeries === undefined) {
			throw Error('No number of data series given')
		} else if (numberOfSeries > 2) {
			throw Error('Large number of data series given')
		}
		this._numberOfSeries = numberOfSeries
	}

	/**
	 * Start the oscillator(s)
	 */
	start() {
		// Oscillators cannot be re-used
		this._oscillators = []
		for (let i = 0; i < this._numberOfSeries; i++) {
			this._oscillators[i] = this._context.createOscillator()
			this._oscillators[i].connect(this._context.destination)
			this._oscillators[i].start(0)
		}
	}

	/**
	 * Set the frequency of the oscillator for a given series
	 * @param {number} series - set frequency for which series?
	 * @param {number} frequency - the frequency to change to (Hz)
	 */
	frequency(series, frequency) {
		this._oscillators[series].frequency.value = frequency
	}

	/**
	 * Stop the oscillator(s)
	 */
	stop() {
		this._oscillators.forEach((oscillator) => oscillator.stop())
	}
}
