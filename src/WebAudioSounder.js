/**
 * Outputs sound using the Web Audio API
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

export { WebAudioSounder }
