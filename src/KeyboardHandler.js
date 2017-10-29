/**
 * Set up a keyboard event listener to detect chart navigation keypresses.
 * @private
 * @param {HTMLElement} container
 *	- The element (usually a <code>&lt;div&gt;</code>) containing the chart
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

export { KeyboardHandler }
