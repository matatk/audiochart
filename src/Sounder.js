/**
 * Outputs sound using the Web Audio API
 * @private
 * @param {AudioContext} context - the Web Audio API context
 */
class Sounder {
	constructor(context, numSeries) {
		if (context === undefined) {
			throw Error('No audio context given')
		}
		this._context = context

		if (numSeries === undefined) {
			throw Error('No number of data series given')
		} else if (numSeries > 2) {
			throw Error('Large number of data series given')
		}
		this._numSeries = numSeries
	}

	/**
	 * Start the oscillator
	 */
	start() {
		// Oscillators cannot be re-used
		this._oscillator = this._context.createOscillator()
		this._oscillator.connect(this._context.destination)
		this._oscillator.start(0)
	}

	/**
	 * Set the frequency of the oscillator at a given point in time
	 * @param {number} frequency - the frequency to change to
	 */
	frequency(frequency) {
		this._oscillator.frequency.value = frequency
	}

	/**
	 * Stop the oscillator at a given time
	 */
	stop() {
		this._oscillator.stop()
	}
}
