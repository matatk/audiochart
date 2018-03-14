/** @module */
/* exported OptionsMaker */

function makePopup() {
	console.log('MOOOOOOOOOOOOOOO!')
}

class OptionsMaker {
	/**
	 * Create an OptionsMaker object.
	 * @param {HTMLElement} trigger - the trigger
	 */
	constructor(trigger) {
		if (!(trigger instanceof Element)) {
			throw Error('Trigger element not given')
		}

		// trigger.onclick = makePopup
		// trigger.addEventListener('click', makePopup)
		trigger.onclick = makePopup
	}
}
