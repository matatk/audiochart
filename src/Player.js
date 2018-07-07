/* exported Player */
// TODO: the debug info isn't logged any more but it's still calculated; need a
//       debug mode.

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

		this._numberOfSeries = this.data.numSeries()

		const seriesLen = this.data.seriesLength(0)
		this.seriesMaxIndex = seriesLen - 1  // TODO just use seriesLen?

		const sampling = Player._samplingInfo(duration, seriesLen)
		this.interval = sampling.interval
		this.sampleOneIn = sampling.in

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
		// TODO DRY
		const delta = this._delta(skip)
		this.playIndex -= delta
		if (this.playIndex < 0) {
			this.playIndex = 0  // TODO test limiting
		}
		if (this._state === 'paused') {
			this._playOne()
		}
	}

	stepForward(skip) {
		// TODO DRY
		const delta = this._delta(skip)
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
			// Play back one datum point
			if (this.visualCallback !== null) {
				this.visualCallback(this.playIndex)
			}
			for (let i = 0; i < this._numberOfSeries; i++ ) {
				this.sounder.frequency(i, this.pitchMapper.map(i,
					this.data.seriesValue(i, this.playIndex)))
			}
		} else {
			// Playback is complete; clean up
			clearInterval(this.intervalID)
			this.sounder.stop()
			this._state = 'finished'

			// Debugging info
			/* console.log(`Player: Playing ${this.playCount} of ${this.playIndex} took ${Math.round(performance.now() - this.startTime)} ms`)
			const sum = this.playTimes.reduce((acc, cur) => acc + cur)
			const mean = sum / this.playTimes.length
			console.log(`Player: Average play func time: ${mean.toFixed(2)} ms`) */
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

	/**
	 * Work out the delta for a backwards/forwards skip
	 * @param {string} skip - the skip mode
	 * @returns {number} the number of samples to skip
	 * @todo "samples"?
	 * @todo document as enum?
	 */
	_delta(skip) {
		switch (skip) {
			case 'normal':
				return Math.ceil(0.1 * (this.seriesMaxIndex + 1))
			case 'fast':
				return Math.ceil(0.2 * (this.seriesMaxIndex + 1))
			case 'slow':
				return 1
			default:
				throw Error(`skip must be 'normal', 'fast' or 'slow' (got: ${skip})`)
		}
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
