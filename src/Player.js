/**
 * Orchestrates the audible (and visual cursor) rendering of the chart
 * @private
 * @param {integer} duration - the length of the rendering in milliseconds
 * @param {DataWrapper} data - the underlying data (wrapped in interface)
 * @param {PitchMapper} pitchMapper - maps data to pitches
 * @param {Sounder} sounder - the sounder object
 * @param {VisualCallback} visualCallback - the callback function that highlights the current datum
 */
class Player {
	constructor(duration, data, pitchMapper, sounder, visualCallback) {
		this.data = data
		this.pitchMapper = pitchMapper
		this.sounder = sounder
		if (arguments.length < 5) {
			this.visualCallback = null
		} else {
			this.visualCallback = visualCallback
		}

		const seriesLen = this.data.seriesLength(0)

		const sampling = Player._samplingInfo(duration, seriesLen)
		this.interval = sampling.interval
		this.sampleOneIn = sampling.in

		this.seriesMaxIndex = seriesLen - 1  // TODO just use seriesLen?
		this._state = 'ready'
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
				0,
				this.pitchMapper.map(
					0,
					this.data.seriesValue(0, this.playIndex)))
		} else {
			clearInterval(this.intervalID)
			this.sounder.stop()
			this._state = 'finished'

			// Debugging info
			// console.log(`Player: Playing ${this.playCount} of ${this.playIndex} took ${Math.round(performance.now() - this.startTime)} ms`)
			const sum = this.playTimes.reduce((acc, cur) => acc + cur)
			const mean = sum / this.playTimes.length
			// console.log(`Player: Average play func time: ${mean.toFixed(2)} ms`)
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

	/* Work out sampling rate */
	static _samplingInfo(duration, seriesLen) {
		const minInterval = 10
		let interval
		let sampleOneIn
		let slots

		const idealInterval = Math.ceil(duration / seriesLen)
		// console.log(`sampleInfo: duration: ${duration}; series length: ${seriesLen}; ideal interval: ${idealInterval}`)

		if (idealInterval < minInterval) {
			interval = minInterval
			slots = Math.floor(duration / minInterval)
			const sampleOneInFloat = seriesLen / slots
			sampleOneIn = Math.round(seriesLen / slots)
			// console.log(`sampleInfo: Need to sample 1 in ${sampleOneIn} (${sampleOneInFloat})`)
		} else {
			slots = Math.floor(duration / minInterval)
			interval = idealInterval
			sampleOneIn = 1
		}

		// console.log(`sampleInfo: it will take ${ (seriesLen / sampleOneIn) * interval}`)

		return {
			'sample': 1,
			'in': sampleOneIn,
			'interval': interval
		}
	}
}
